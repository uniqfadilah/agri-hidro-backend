"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.raw("CREATE TYPE role_enum AS ENUM ('admin', 'user')");
    await knex.schema.createTable('users', (table) => {
        table.text('id').primary();
        table.text('username').notNullable().unique();
        table.text('password').notNullable();
        table.specificType('role', 'role_enum').notNullable();
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
    await knex.schema.dropTableIfExists('users');
    await knex.schema.raw('DROP TYPE IF EXISTS role_enum');
}
//# sourceMappingURL=20260131080000_create_users.js.map