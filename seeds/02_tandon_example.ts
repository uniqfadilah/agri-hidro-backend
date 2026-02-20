import type { Knex } from 'knex';
import { randomUUID } from 'node:crypto';

export async function seed(knex: Knex): Promise<void> {
  const existing = await knex('tandons').where('code', '1000').first();
  if (existing) {
    return;
  }

  await knex('tandons').insert({
    id: randomUUID(),
    code: '1000',
    jwt_secret: '12345678',
    max_level_water: 100,
    min_level_water: 10,
    current_level_water: 50,
    tandon_height: 100,
  });
}
