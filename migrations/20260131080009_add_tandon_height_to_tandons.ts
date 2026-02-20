import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('tandons', (table) => {
    table.decimal('tandon_height', 14, 4).nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('tandons', (table) => {
    table.dropColumn('tandon_height');
  });
}
