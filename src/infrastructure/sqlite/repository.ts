// =======================================
// Camada de acesso aos dados (DAO / Repositório).
// Este arquivo concentra funções para consultar e manipular
// contas e transações no banco SQLite.
// =======================================

import db from './database'; // importa a conexão com o banco

// Tipos auxiliares para dar forma aos dados retornados
export interface Account {
  id: string;                // chave primária da conta
  code: string;              // código único da conta
  description: string;       // descrição textual da conta
  account_group: 'ATIVO' | 'PASSIVO' | 'RECEITA' | 'DESPESA'; // grupo contábil
  is_monetary: number;       // indica se é monetária (1 = sim, 0 = não)
  parent_code: string | null;// código da conta pai (se houver)
  is_active: number;         // indica se está ativa (1 = sim, 0 = não)
  created_at: string;        // data de criação
}

export interface Transaction {
  id: number;                // chave primária da transação
  account_code: string;      // código da conta associada
  amount: number;            // valor da transação
  type: 'C' | 'D';           // tipo (C = crédito, D = débito)
  transaction_date: string;  // data da transação
  description: string | null;// descrição opcional
}

// ----------------------
// Funções de acesso a contas
// ----------------------

export function getAllAccounts(): Account[] {
  // Seleciona todas as contas ordenadas pelo código
  const stmt = db.prepare('SELECT * FROM accounts ORDER BY code');
  return stmt.all() as Account[];
}

export function getAccountByCode(code: string): Account | undefined {
  // Busca uma conta específica pelo código
  const stmt = db.prepare('SELECT * FROM accounts WHERE code = ?');
  return stmt.get(code) as Account | undefined;
}

// ----------------------
// Funções de acesso a transações
// ----------------------

export function getTransactionsByAccount(code: string): Transaction[] {
  // Seleciona todas as transações de uma conta específica
  const stmt = db.prepare('SELECT * FROM transactions WHERE account_code = ? ORDER BY transaction_date');
  return stmt.all(code) as Transaction[];
}

export function addTransaction(t: Omit<Transaction, 'id'>): void {
  // Insere uma nova transação vinculada a uma conta
  const stmt = db.prepare(`
    INSERT INTO transactions (account_code, amount, type, transaction_date, description)
    VALUES (?, ?, ?, ?, ?)
  `);
  stmt.run(t.account_code, t.amount, t.type, t.transaction_date, t.description);
}

export function listAccounts() {
  throw new Error('Function not implemented.');
}
