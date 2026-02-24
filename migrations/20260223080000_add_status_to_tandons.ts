import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('tandons', (table) => {
    table.string('status', 10).notNullable().defaultTo('full');
  });
  await knex.schema.raw(
    "ALTER TABLE tandons ADD CONSTRAINT tandons_status_check CHECK (status IN ('full', 'refill'))",
  );
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(
    'ALTER TABLE tandons DROP CONSTRAINT IF EXISTS tandons_status_check',
  );
  await knex.schema.alterTable('tandons', (table) => {
    table.dropColumn('status');
  });
}
