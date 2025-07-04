//Backend para Prod.
/* 
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

try {
  await fastify.listen({ port: 3000, host: '192.168.1.14' });
  console.log('Servidor Fastify iniciado em: http://localhost:3000');
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
*/

// Backend para testar em Dev.
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
  console.log('Servidor Fastify iniciado em: http://localhost:3000')
})
