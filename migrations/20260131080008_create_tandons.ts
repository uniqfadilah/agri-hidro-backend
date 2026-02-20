import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(
    'CREATE EXTENSION IF NOT EXISTS "uuid-ossp"',
  );
  await knex.schema.createTable('tandons', (table) => {
    table
      .uuid('id')
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('code', 4).unique().notNullable();
    table.string('jwt_secret', 8).notNullable();
    table.decimal('max_level_water', 14, 4).notNullable();
    table.decimal('min_level_water', 14, 4).notNullable();
    table.decimal('current_level_water', 14, 4).notNullable();
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
  await knex.schema.dropTableIfExists('tandons');
}
