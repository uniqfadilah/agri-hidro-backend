import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('expenses', (table) => {
    table
      .text('status')
      .notNullable()
      .defaultTo('un_paid')
      .checkIn(['paid', 'un_paid']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('expenses', (table) => {
    table.dropColumn('status');
  });
}
