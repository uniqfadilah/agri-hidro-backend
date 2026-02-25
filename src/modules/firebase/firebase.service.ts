import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private app: admin.app.App | null = null;

  onModuleInit(): void {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKey) {
      return;
    }

    const privateKeyParsed = privateKey.replace(/\\n/g, '\n');

    try {
      this.app = admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey: privateKeyParsed,
        }),
      });
    } catch {
      this.app = null;
    }
  }

  isActive(): boolean {
    return this.app != null;
  }

  /**
   * Send FCM data message to topic when tandon status changes (refill / full).
   * Clients subscribe to topic "tandon" or "tandon.{code}" to receive notifications.
   */
  async sendTandonStatusNotification(
    tandonCode: string,
    status: 'refill' | 'full',
    tandonName?: string | null,
  ): Promise<void> {
    if (!this.app) {
      return;
    }

    const message =
      status === 'refill'
        ? `Tandon ${tandonName ?? tandonCode} perlu isi ulang.`
        : `Tandon ${tandonName ?? tandonCode} sudah penuh.`;

    const payload: admin.messaging.Message = {
      topic: `tandon.${tandonCode}`,
      data: {
        type: 'tandon_status',
        tandonCode,
        status,
        message,
      },
      notification: {
        title: status === 'refill' ? 'Perlu isi ulang' : 'Tandon penuh',
        body: message,
      },
      android: {
        priority: 'high',
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
          },
        },
      },
    };

    try {
      await admin.messaging().send(payload);
    } catch {
      // Log but do not fail the device update
    }
  }
}
