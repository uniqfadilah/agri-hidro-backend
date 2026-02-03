"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await knex.schema.createTable('sellers', (table) => {
        table
            .uuid('id')
            .primary()
            .defaultTo(knex.raw('uuid_generate_v4()'));
        table.text('seller_name').notNullable();
        table.text('address').nullable();
        table.text('contact').nullable();
        table
            .timestamp('created_at', { useTz: true })
            .notNullable()
            .defaultTo(knex.fn.now());
        table
            .timestamp('updated_at', { useTz: true })
            .notNullable()
            .defaultTo(knex.fn.now());
    });
    await knex.schema.createTable('materials', (table) => {
        table
            .uuid('id')
            .primary()
            .defaultTo(knex.raw('uuid_generate_v4()'));
        table.text('material_name').notNullable();
        table
            .timestamp('created_at', { useTz: true })
            .notNullable()
            .defaultTo(knex.fn.now());
        table
            .timestamp('updated_at', { useTz: true })
            .notNullable()
            .defaultTo(knex.fn.now());
    });
    await knex.schema.createTable('material_sellers', (table) => {
        table
            .uuid('id')
            .primary()
            .defaultTo(knex.raw('uuid_generate_v4()'));
        table
            .uuid('material_id')
            .notNullable()
            .references('id')
            .inTable('materials')
            .onDelete('CASCADE');
        table
            .uuid('seller_id')
            .notNullable()
            .references('id')
            .inTable('sellers')
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
        table.unique(['material_id', 'seller_id']);
    });
    await knex.schema.createTable('expenses', (table) => {
        table
            .uuid('id')
            .primary()
            .defaultTo(knex.raw('uuid_generate_v4()'));
        table.text('user_id').notNullable().references('id').inTable('users');
        table
            .uuid('seller_id')
            .notNullable()
            .references('id')
            .inTable('sellers');
        table
            .timestamp('created_at', { useTz: true })
            .notNullable()
            .defaultTo(knex.fn.now());
        table
            .timestamp('updated_at', { useTz: true })
            .notNullable()
            .defaultTo(knex.fn.now());
    });
    await knex.schema.createTable('expense_materials', (table) => {
        table
            .uuid('id')
            .primary()
            .defaultTo(knex.raw('uuid_generate_v4()'));
        table
            .uuid('expense_id')
            .notNullable()
            .references('id')
            .inTable('expenses')
            .onDelete('CASCADE');
        table
            .uuid('material_id')
            .notNullable()
            .references('id')
            .inTable('materials');
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
async function down(knex) {
    await knex.schema.dropTableIfExists('expense_materials');
    await knex.schema.dropTableIfExists('expenses');
    await knex.schema.dropTableIfExists('material_sellers');
    await knex.schema.dropTableIfExists('materials');
    await knex.schema.dropTableIfExists('sellers');
}
//# sourceMappingURL=20260131080005_create_sellers_materials_expenses.js.map