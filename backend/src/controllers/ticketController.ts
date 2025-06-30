import { FastifyReply, FastifyRequest } from 'fastify';
import { getTickets, getTicketById, createTicket, loginUser, registerUser, deleteUser,  getAllUsers, updateTicketStatus, getUserById, deleteTicket } from '../models/ticketModel.js';

// Controller para pegar todos os tickets
export const getTicketsController = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const tickets = await getTickets();
    return reply.send(tickets);
  } catch (error) {
    return reply.status(500).send({ error: 'Erro ao buscar tickets' });
  }
};

// Controller para pegar um ticket por ID
export const getTicketByIdController = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };
  try {
    const ticket = await getTicketById(Number(id));
    if (!ticket) {
      return reply.status(404).send({ error: 'Ticket não encontrado' });
    }
    return reply.send(ticket);
  } catch (error) {
    return reply.status(500).send({ error: 'Erro ao buscar ticket' });
  }
};

// Controller para criar um novo ticket
export const createTicketController = async (request: FastifyRequest, reply: FastifyReply) => {
    const { nome, descricao, estado, utilizador_id } = request.body as {
      nome: string;
      descricao: string;
      estado: string;
      utilizador_id: number | null;
    };
  
    try {
      const newTicket = await createTicket(nome, descricao, estado, utilizador_id);
      return reply.status(201).send(newTicket);
    } catch (error) {
      return reply.status(500).send({ error: 'Erro ao criar ticket' });
    }
};

export const updateTicketStatusController = async (
  request: FastifyRequest<{ Params: { id: string }, Body: { estado: string } }>,
  reply: FastifyReply
) => {
  const { id } = request.params;
  const { estado } = request.body;

  try {
    const updatedTicket = await updateTicketStatus(parseInt(id), estado);

    if (!updatedTicket) {
      return reply.status(404).send({ error: 'Ticket não encontrado' });
    }

    return reply.status(200).send(updatedTicket);
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ error: 'Erro ao atualizar status do ticket' });
  }
};

export const deleteTicketController = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const { id } = request.params;

  try {
    const deleted = await deleteTicket(Number(id));

    if (!deleted) {
      return reply.status(404).send({ error: 'Ticket não encontrado' });
    }

    return reply.send({ message: 'Ticket apagado com sucesso' });
  } catch (error) {
    console.error('Erro ao apagar ticket:', error);
    return reply.status(500).send({ error: 'Erro ao apagar ticket' });
  }
};


export const handleLogin = async (
  request: FastifyRequest<{ Body: { nome: string; password: string } }>,
  reply: FastifyReply
) => {
  const { nome, password } = request.body;

  try {
    const user = await loginUser(nome, password);
    if (!user) {
      return reply.status(401).send({ message: 'Credenciais inválidas' });
    }

    // Aqui você pode adicionar geração de token JWT se quiser
    return reply.send({
      message: 'Login bem-sucedido',
      user: {
        id: user.id,
        nome: user.nome,
        permissions: user.permissions,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    return reply.status(500).send({ message: 'Erro interno no servidor' });
  }
};

export const handleRegister = async (
  request: FastifyRequest<{ Body: { nome: string; password: string; permissions?: string } }>,
  reply: FastifyReply
) => {
  const { nome, password, permissions } = request.body;

  try {
    const user = await registerUser(nome, password, permissions || 'user');
    console.log("Utilizador criado:", user);
    return reply.code(200).send({ message: 'Utilizador criado com sucesso' });
  } catch (error: any) {
    console.error('Erro ao registrar usuário:', error.message);
    return reply.status(500).send({ message: 'Erro ao registrar usuário', erroOriginal: error?.message });
  }
};

export const deleteUserController = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const userId = parseInt(request.params.id, 10);

  if (isNaN(userId)) {
    return reply.status(400).send({ error: 'ID inválido' });
  }

  try {
    const deleted = await deleteUser(userId);

    if (deleted) {
      return reply.status(200).send({ message: 'Usuário deletado com sucesso' });
    } else {
      return reply.status(404).send({ error: 'Usuário não encontrado' });
    }
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ error: 'Erro ao deletar usuário' });
  }
};

export const getAllUsersController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const users = await getAllUsers();
    return reply.status(200).send(users);
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ error: 'Erro ao buscar usuários' });
  }
};

export const getUserByIdController = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const { id } = request.params;

  try {
    const user = await getUserById(Number(id));

    if (!user) {
      return reply.status(404).send({ error: 'Usuário não encontrado' });
    }

    return reply.send(user);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return reply.status(500).send({ error: 'Erro ao buscar usuário' });
  }
};