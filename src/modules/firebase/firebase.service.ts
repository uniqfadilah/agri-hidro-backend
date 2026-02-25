import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';

import { PushService } from '../push/push.service';

/**
 * Backend mengirim notifikasi ke Firebase (FCM); Firebase yang mengirim ke device.
 * Alur: Backend → Firebase Cloud Messaging → Device (HP/user).
 */
@Injectable()
export class FirebaseService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseService.name);
  private app: admin.app.App | null = null;

  constructor(private readonly pushService: PushService) {}

  onModuleInit(): void {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKey) {
      this.logger.warn(
        'Firebase skipped: set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY in .env',
      );
      return;
    }

    const privateKeyParsed = privateKey.replace(/\\n/g, '\n');

    try {
      if (admin.apps.length === 0) {
        this.app = admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            clientEmail,
            privateKey: privateKeyParsed,
          }),
        });
      } else {
        this.app = admin.app();
      }
      this.logger.log('Firebase Admin initialized');
    } catch (err) {
      this.app = null;
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`Firebase init failed: ${message}`);
    }
  }

  isActive(): boolean {
    return this.app != null;
  }

  /** FCM multicast max 500 tokens per request; batch untuk blast ke banyak device. */
  private static readonly BATCH_SIZE = 500;

  /**
   * Kirim notifikasi blast: satu pesan ke semua token (dari DB). FCM yang mengirim ke device.
   * Token di-batch 500 per request bila perlu.
   */
  async sendTandonStatusNotification(
    tandonCode: string,
    status: 'refill' | 'full',
    tandonName: string | null | undefined,
    tokens: string[],
  ): Promise<void> {
    if (!this.app) return;
    if (tokens.length === 0) {
      this.logger.debug('FCM blast skipped: no tokens in DB');
      return;
    }

    const payload = this.buildTandonMessage(tandonCode, status, tandonName);
    let totalSuccess = 0;

    for (let i = 0; i < tokens.length; i += FirebaseService.BATCH_SIZE) {
      const batch = tokens.slice(i, i + FirebaseService.BATCH_SIZE);
      try {
        const result = await admin.messaging().sendEachForMulticast({
          tokens: batch,
          ...payload,
        });
        totalSuccess += result.successCount;
        if (result.failureCount > 0) {
          for (let j = 0; j < result.responses.length; j++) {
            const r = result.responses[j];
            if (!r.success) {
              const msg = r.error?.message ?? '';
              this.logger.warn(`FCM token failed: ${msg}`);
              if (this.isInvalidTokenError(msg)) {
                await this.pushService.deleteToken(batch[j]);
                this.logger.log(`Deleted invalid token from DB`);
              }
            }
          }
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        this.logger.error(`FCM blast batch failed: ${message}`);
      }
    }

    this.logger.log(
      `FCM blast sent to ${totalSuccess}/${tokens.length} devices tandon=${tandonCode}`,
    );
  }

  /** Error FCM yang menandakan token invalid/unregistered → hapus dari DB. */
  private isInvalidTokenError(message: string): boolean {
    const lower = message.toLowerCase();
    return (
      lower.includes('requested entity was not found') ||
      lower.includes('unregistered') ||
      lower.includes('invalid registration') ||
      lower.includes('not found')
    );
  }

  /**
   * Build payload FCM: data + notification (semua nilai string, key snake_case).
   */
  private buildTandonMessage(
    tandonCode: string,
    status: 'refill' | 'full',
    tandonName?: string | null,
  ): Omit<admin.messaging.Message, 'topic' | 'token'> {
    const displayName = tandonName ?? tandonCode;
    const body =
      status === 'refill'
        ? `Tandon ${displayName} perlu isi ulang.`
        : `Tandon ${displayName} sudah penuh.`;
    const title = status === 'refill' ? 'Perlu isi ulang' : 'Tandon penuh';

    const data: Record<string, string> = {
      type: 'tandon_status',
      tandon_code: String(tandonCode),
      status: String(status),
      message: body,
    };

    return {
      data,
      notification: { title, body },
      android: {
        priority: 'high',
        notification: { sound: 'base.mp3', channelId: 'tandon' },
      },
      apns: { payload: { aps: { sound: 'base.mp3', channelId: 'tandon' } } },
    };
  }
}
