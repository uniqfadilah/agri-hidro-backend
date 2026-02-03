"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.alterTable('expenses', (table) => {
        table
            .text('status')
            .notNullable()
            .defaultTo('un_paid')
            .checkIn(['paid', 'un_paid']);
    });
}
async function down(knex) {
    await knex.schema.alterTable('expenses', (table) => {
        table.dropColumn('status');
    });
}
//# sourceMappingURL=20260131080006_add_expense_status.js.map