import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import bcrypt from 'bcrypt';

sqlite3.verbose();

let db: Database<sqlite3.Database, sqlite3.Statement>;

export interface Ticket {
  id: number;
  nome: string;
  descricao: string;
  estado: string;
  utilizador_id: number | null;
  created_at: string;
}

export interface User {
  id: number;
  nome: string;
  password: string;
  permissions: string;
  created_at: string;
}

export const initDB = async () => {
  db = await open({
    filename: './tickets.db',
    driver: sqlite3.Database,
  });

  await createTables();
};

export const createTables = async () => {
  const createUtilizadoresTable = `
    CREATE TABLE IF NOT EXISTS utilizadores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      permissions TEXT DEFAULT 'user',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createTicketsTable = `
    CREATE TABLE IF NOT EXISTS tickets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      descricao TEXT NOT NULL,
      estado TEXT DEFAULT 'aberto',
      utilizador_id INTEGER,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (utilizador_id) REFERENCES utilizadores(id) ON DELETE SET NULL
    );
  `;

  try {
    await db.exec(createUtilizadoresTable);
    await db.exec(createTicketsTable);
    console.log('Tabelas criadas com sucesso!');
  } catch (error) {
    console.error('Erro ao criar tabelas:', error);
  }
};

export const getTickets = async (): Promise<Ticket[]> => {
  return await db.all<Ticket[]>('SELECT * FROM tickets');
};

export const getTicketById = async (ticketId: number): Promise<Ticket | null> => {
  const ticket = await db.get<Ticket>('SELECT * FROM tickets WHERE id = ?', ticketId);
  return ticket ?? null;
};


export const createTicket = async (
  nome: string,
  descricao: string,
  estado: string,
  utilizador_id: number | null
): Promise<Ticket> => {
  const result = await db.run(
    `INSERT INTO tickets (nome, descricao, estado, utilizador_id)
     VALUES (?, ?, ?, ?)`,
    nome, descricao, estado, utilizador_id
  );

  return await getTicketById(result.lastID!) as Ticket;
};

export const updateTicketStatus = async (
  ticketId: number,
  newStatus: string
): Promise<{ id: number; estado: string } | null> => {
  await db.run(`UPDATE tickets SET estado = ? WHERE id = ?`, newStatus, ticketId);
  const ticket = await db.get<{ id: number; estado: string }>(
    'SELECT id, estado FROM tickets WHERE id = ?',
    ticketId
  );
  return ticket ?? null;
};

export const deleteTicket = async (id: number): Promise<boolean> => {
  const result = await db.run('DELETE FROM tickets WHERE id = ?', id);
  return result.changes! > 0;
};

export const loginUser = async (nome: string, password: string): Promise<User | null> => {
  const user = await db.get<User>('SELECT * FROM utilizadores WHERE nome = ?', nome);
  if (user && await bcrypt.compare(password, user.password)) {
    return user;
  }
  return null;
};

export const registerUser = async (
  nome: string,
  password: string,
  permissions: string = 'user'
): Promise<Omit<User, 'password'>> => {
  const existing = await db.get('SELECT id FROM utilizadores WHERE nome = ?', nome);
  if (existing) throw new Error('Usuário já existe');

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await db.run(
    `INSERT INTO utilizadores (nome, password, permissions)
     VALUES (?, ?, ?)`,
    nome, hashedPassword, permissions
  );

  return await getUserById(result.lastID!) as Omit<User, 'password'>;
};

export const deleteUser = async (id: number): Promise<boolean> => {
  const result = await db.run('DELETE FROM utilizadores WHERE id = ?', id);
  return result.changes! > 0;
};

export const getAllUsers = async (): Promise<Omit<User, 'password'>[]> => {
  return await db.all<Omit<User, 'password'>[]>(
    `SELECT id, nome, permissions, created_at FROM utilizadores ORDER BY id`
  );
};

export const getUserById = async (id: number): Promise<Omit<User, 'password'> | null> => {
  const user = await db.get<Omit<User, 'password'>>(
    `SELECT id, nome, permissions, created_at FROM utilizadores WHERE id = ?`,
    id
  );
  return user ?? null;
};
