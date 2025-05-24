import fastify from 'fastify'
import cors from '@fastify/cors'
import { knex } from './database'

const app = fastify()

app.register(cors, {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type'],
})

app.post('/transacoes', async (request, reply) => {
  const { descricao, preco, categoria, tipo, data } = request.body as {
    descricao: string
    preco: number
    categoria: string
    tipo: string
    data: string
  }

  try {
    const [created] = await knex('TabTransacao')
      .insert({
        Descricao: descricao,
        Preco: preco,
        Categoria: categoria,
        Tipo: tipo,
        Data: data,
      })
      .returning(['Id', 'Descricao', 'Preco', 'Categoria', 'Tipo', 'Data'])

    reply.code(201).send({
      id: created.Id,
      descricao: created.Descricao,
      preco: created.Preco,
      categoria: created.Categoria,
      tipo: created.Tipo,
      data: created.Data,
    })
  } catch (err) {
    reply.code(400).send({ message: 'Erro ao registrar transação' })
  }
})

app.get('/transacoes', async (request, reply) => {
  try {
    const result = await knex('TabTransacao').select(
      'Id',
      'Descricao',
      'Preco',
      'Categoria',
      'Tipo',
      'Data',
    )

    const transactions = result.map((t) => ({
      id: t.Id,
      descricao: t.Descricao,
      preco: t.Preco,
      categoria: t.Categoria,
      tipo: t.Tipo,
      data: t.Data,
    }))

    if (transactions.length === 0) {
      return reply.code(204).send()
    }

    return reply.code(200).send({ transactions })
  } catch (err) {
    reply.code(500).send({ message: 'Erro ao buscar transações' })
  }
})

app.delete('/transacoes/:id', async (request, reply) => {
  const { id } = request.params

  try {
    const transacao = await knex('TabTransacao').where({ Id: id }).first()

    if (!transacao) {
      return reply.code(404).send({ message: 'Transação não encontrada' })
    }

    await knex('TabTransacao').where({ Id: id }).delete()

    return reply.code(204).send()
  } catch (error) {
    console.error('Erro ao deletar transação:', error)
    return reply.code(500).send({ message: 'Erro ao processar exclusão' })
  }
})

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP Server Running!')
})
