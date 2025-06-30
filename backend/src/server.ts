import Fastify from 'fastify'
import cors from '@fastify/cors'
import { initDB } from './models/ticketModel.js'
import { ticketRoutes } from './routers/ticketRoutes.js'

const fastify = Fastify({ logger: false })

await fastify.register(cors, {
  origin: '*',
})

await initDB()

await fastify.register(ticketRoutes)

fastify.listen({ port: 3000 }, (err) => {
  if (err) throw err
  console.log('🚀 Fastify rodando em http://localhost:3000')
})
