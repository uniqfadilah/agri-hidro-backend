import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex('expenses').where('status', 'un_paid').update({ status: 'unpaid' });
  await knex.raw(
    `ALTER TABLE expenses DROP CONSTRAINT IF EXISTS expenses_status_check`,
  );
  await knex.raw(
    `ALTER TABLE expenses ADD CONSTRAINT expenses_status_check CHECK (status IN ('paid', 'unpaid'))`,
  );
  await knex.raw(
    `ALTER TABLE expenses ALTER COLUMN status SET DEFAULT 'unpaid'`,
  );
}

export async function down(knex: Knex): Promise<void> {
  await knex('expenses').where('status', 'unpaid').update({ status: 'un_paid' });
  await knex.raw(
    `ALTER TABLE expenses DROP CONSTRAINT IF EXISTS expenses_status_check`,
  );
  await knex.raw(
    `ALTER TABLE expenses ADD CONSTRAINT expenses_status_check CHECK (status IN ('paid', 'un_paid'))`,
  );
  await knex.raw(
    `ALTER TABLE expenses ALTER COLUMN status SET DEFAULT 'un_paid'`,
  );
}
