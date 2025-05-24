import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('TabTransacao', (table) => {
    table.increments('Id').primary()
    table.string('Descricao', 255).notNullable()
    table.decimal('Preco', 18, 2).notNullable()
    table.string('Categoria', 100).notNullable()
    table.string('Tipo', 100).nullable()
    table.dateTime('Data').nullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('TabTransacao')
}
