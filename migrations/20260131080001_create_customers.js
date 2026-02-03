"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.createTable('customers', (table) => {
        table.text('id').primary();
        table.text('name').notNullable();
        table.text('pic').notNullable();
        table.text('pic_phone_number').notNullable();
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
    await knex.schema.dropTableIfExists('customers');
}
//# sourceMappingURL=20260131080001_create_customers.js.map