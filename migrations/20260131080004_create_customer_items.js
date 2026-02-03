"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
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
async function down(knex) {
    await knex.schema.dropTableIfExists('customer_items');
}
//# sourceMappingURL=20260131080004_create_customer_items.js.map