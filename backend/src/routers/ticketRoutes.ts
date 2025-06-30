import { FastifyInstance } from 'fastify';
import { getTicketsController, getTicketByIdController, createTicketController, handleLogin, handleRegister, deleteUserController, getAllUsersController, updateTicketStatusController, getUserByIdController, deleteTicketController } from '../controllers/ticketController.js';

export const ticketRoutes = async (fastify: FastifyInstance) => {
  fastify.get('/tickets', getTicketsController);
  fastify.get('/tickets/:id', getTicketByIdController);
  fastify.post('/tickets', createTicketController);
  fastify.put('/tickets/:id/status', updateTicketStatusController);
  fastify.delete('/tickets/:id', deleteTicketController);
  fastify.get('/users', getAllUsersController);
  fastify.get('/users/:id', getUserByIdController);
  fastify.post('/login', handleLogin);
  fastify.post('/register', handleRegister);
  fastify.delete('/users/:id', deleteUserController);
};
