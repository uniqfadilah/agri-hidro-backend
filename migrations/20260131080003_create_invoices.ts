import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(
    'CREATE EXTENSION IF NOT EXISTS "uuid-ossp"',
  );
  await knex.schema.raw(
    "CREATE TYPE invoice_status_enum AS ENUM ('new', 'on_progress', 'done_paid')",
  );

  await knex.schema.createTable('invoices', (table) => {
    table
      .uuid('id')
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'));
    table.text('customer_id').notNullable().references('id').inTable('customers');
    table.text('user_id').notNullable().references('id').inTable('users');
    table.specificType('status', 'invoice_status_enum').notNullable();
    table
      .timestamp('created_at', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());
    table
      .timestamp('updated_at', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('invoice_items', (table) => {
    table
      .uuid('id')
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'));
    table
      .uuid('invoice_id')
      .notNullable()
      .references('id')
      .inTable('invoices')
      .onDelete('CASCADE');
    table.uuid('item_id').notNullable().references('id').inTable('items');
    table.decimal('price', 14, 2).notNullable();
    table.integer('quantity').notNullable();
    table
      .timestamp('created_at', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());
    table
      .timestamp('updated_at', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('invoice_items');
  await knex.schema.dropTableIfExists('invoices');
  await knex.schema.raw('DROP TYPE IF EXISTS invoice_status_enum');
}
