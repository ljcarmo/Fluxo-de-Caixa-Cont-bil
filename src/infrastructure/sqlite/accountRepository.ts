// src/infrastructure/sqlite/accountRepository.ts
// Repositório SQLite para contas e lançamentos (assume uso de better-sqlite3)
// Implementação em TypeScript com tipos explícitos e retornos corretos.

import db from './database';
import { randomUUID } from 'crypto';

export interface Account {
  id: string;
  code: string;
  description: string;
  account_group: string;
  is_monetary: number; // 1 ou 0
  parent_code: string | null;
  is_active?: number; // opcional caso a coluna não exista em todas as versões
  created_at: string;
}

export interface Transaction {
  id?: string;
  account_code: string;
  amount: number;
  type: 'C' | 'D';
  transaction_date: string;
  description?: string | null;
}

// --- CONTAS ---

/**
 * Insere uma nova conta no banco.
 * Retorna o resultado do run (better-sqlite3 StatementRunResult).
 */
export function insertAccount(
  code: string,
  description: string,
  group: string,
  isMonetary: boolean,
  parentCode?: string
) {
  const stmt = db.prepare(`
    INSERT INTO accounts (id, code, description, account_group, is_monetary, parent_code, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  return stmt.run(
    randomUUID(),
    code,
    description,
    group,
    isMonetary ? 1 : 0,
    parentCode ?? null,
    new Date().toISOString()
  );
}

/**
 * Retorna a conta correspondente ao código ou undefined se não existir.
 */
export function getAccountByCode(code: string): Account | undefined {
  const stmt = db.prepare(`SELECT * FROM accounts WHERE code = ? LIMIT 1`);
  const row = stmt.get(code);
  return (row as Account) ?? undefined;
}

/**
 * Lista todas as contas ordenadas por código.
 */
export function listAccounts(): Account[] {
  const stmt = db.prepare(`SELECT * FROM accounts ORDER BY code`);
  return stmt.all() as Account[];
}

/**
 * Retorna subcontas cujo parent_code é igual ao informado.
 */
export function getSubAccounts(parentCode: string): Account[] {
  const stmt = db.prepare(`SELECT * FROM accounts WHERE parent_code = ? ORDER BY code`);
  return stmt.all(parentCode) as Account[];
}

/**
 * Retorna um resumo (contagem) por grupo contábil.
 */
export function getGroupSummary(): { account_group: string; total: number }[] {
  const stmt = db.prepare(`
    SELECT account_group, COUNT(*) as total
    FROM accounts
    GROUP BY account_group
    ORDER BY account_group
  `);
  return stmt.all() as { account_group: string; total: number }[];
}

/**
 * Retorna apenas as contas marcadas como monetárias.
 */
export function getMonetaryAccounts(): Account[] {
  const stmt = db.prepare(`SELECT * FROM accounts WHERE is_monetary = 1 ORDER BY code`);
  return stmt.all() as Account[];
}

// --- TRANSAÇÕES / LANÇAMENTOS ---

/**
 * Insere uma transação (lançamento) vinculada a uma conta.
 * type deve ser 'C' (Crédito) ou 'D' (Débito).
 */
export function insertTransaction(
  accountCode: string,
  amount: number,
  type: 'C' | 'D',
  description?: string | null
) {
  const stmt = db.prepare(`
    INSERT INTO transactions (id, account_code, amount, type, transaction_date, description)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  return stmt.run(
    randomUUID(),
    accountCode,
    amount,
    type,
    new Date().toISOString(),
    description ?? null
  );
}

/**
 * Retorna todas as transações de uma conta (ordenadas por data).
 */
export function getTransactionsByAccount(accountCode: string): Transaction[] {
  const stmt = db.prepare(`
    SELECT id, account_code, amount, type, transaction_date, description
    FROM transactions
    WHERE account_code = ?
    ORDER BY transaction_date DESC
  `);
  return stmt.all(accountCode) as Transaction[];
}

/**
 * Retorna todas as transações (útil para debug).
 */
export function listTransactions(): Transaction[] {
  const stmt = db.prepare(`
    SELECT id, account_code, amount, type, transaction_date, description
    FROM transactions
    ORDER BY transaction_date DESC
  `);
  return stmt.all() as Transaction[];
}
