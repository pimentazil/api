"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.createTable('TabTransacao', (table) => {
        table.increments('Id').primary();
        table.string('Descricao', 255).notNullable();
        table.decimal('Preco', 18, 2).notNullable();
        table.string('Categoria', 100).notNullable();
        table.string('Tipo', 100).nullable();
        table.dateTime('Data').nullable();
    });
}
async function down(knex) {
    await knex.schema.dropTable('TabTransacao');
}
