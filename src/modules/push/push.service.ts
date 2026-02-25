import { Injectable } from '@nestjs/common';

import { PushToken } from '../../models';

/**
 * Token dipakai untuk notifikasi blast: satu event (mis. tandon refill/full) dikirim ke semua device terdaftar.
 */
function isUniqueViolation(err: unknown): boolean {
  if (typeof err !== 'object' || err === null) return false;
  const e = err as { code?: string; name?: string; native?: { code?: string } };
  return (
    e.code === '23505' ||
    e.name === 'UniqueViolationError' ||
    e.native?.code === '23505'
  );
}

@Injectable()
export class PushService {
  async registerToken(token: string): Promise<{ message: string }> {
    const t = token?.trim();
    if (!t) {
      return { message: 'Token kosong' };
    }
    try {
      await PushToken.query().insert({ token: t });
      return { message: 'Token terdaftar untuk notifikasi' };
    } catch (err: unknown) {
      if (isUniqueViolation(err)) {
        return { message: 'Token terdaftar untuk notifikasi' };
      }
      throw err;
    }
  }

  /** Ambil semua token untuk kirim notifikasi blast (satu event ke semua device). */
  async getTokens(): Promise<string[]> {
    const rows = await PushToken.query().select('token');
    return rows.map((r) => r.token);
  }

  /** Hapus token dari DB (dipanggil saat FCM mengembalikan token invalid/not found). */
  async deleteToken(token: string): Promise<void> {
    await PushToken.query().where('token', token).delete();
  }
}
