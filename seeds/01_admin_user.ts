import type { Knex } from 'knex';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'node:crypto';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'adminadmin';
const SALT_ROUNDS = 10;

export async function seed(knex: Knex): Promise<void> {
  const existing = await knex('users')
    .where('username', ADMIN_USERNAME)
    .first();
  if (existing) {
    return;
  }

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);
  await knex('users').insert({
    id: randomUUID(),
    username: ADMIN_USERNAME,
    password: hashedPassword,
    role: 'admin',
  });
}
