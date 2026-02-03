import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(
    'CREATE EXTENSION IF NOT EXISTS "uuid-ossp"',
  );

  await knex.schema.createTable('customer_items', (table) => {
    table
      .uuid('id')
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'));
    table
      .text('customer_id')
      .notNullable()
      .references('id')
      .inTable('customers')
      .onDelete('CASCADE');
    table
      .uuid('item_id')
      .notNullable()
      .references('id')
      .inTable('items')
      .onDelete('CASCADE');
    table.decimal('price', 14, 2).notNullable();
    table
      .timestamp('created_at', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());
    table
      .timestamp('updated_at', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());
    table.unique(['customer_id', 'item_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('customer_items');
}
