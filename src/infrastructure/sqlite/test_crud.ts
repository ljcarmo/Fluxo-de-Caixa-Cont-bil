// src/infrastructure/sqlite/test_crud.ts
// =======================================
// Script de CRUD para validar operações básicas no banco.
// =======================================

import db from './database';

// 1) Criar tabelas de exemplo (se não existirem)
db.prepare(`
  CREATE TABLE IF NOT EXISTS accounts (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL,
    description TEXT NOT NULL,
    account_group TEXT NOT NULL,
    is_monetary INTEGER NOT NULL,
    parent_code TEXT,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    account_code TEXT NOT NULL,
    amount REAL NOT NULL,
    type TEXT NOT NULL,
    transaction_date TEXT NOT NULL,
    description TEXT
  )
`).run();

// 2) Inserir dados de teste
const insertAccount = db.prepare(`
  INSERT INTO accounts (id, code, description, account_group, is_monetary, parent_code, is_active, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);
insertAccount.run('acc-001', '1001', 'Caixa', 'Ativo', 1, null, 1, new Date().toISOString());

const insertTransaction = db.prepare(`
  INSERT INTO transactions (account_code, amount, type, transaction_date, description)
  VALUES (?, ?, ?, ?, ?)
`);
insertTransaction.run('1001', 250.00, 'entrada', new Date().toISOString(), 'Depósito inicial');

// 3) Consultar dados
const accounts = db.prepare('SELECT * FROM accounts').all();
console.log('Contas:', accounts);

const transactions = db.prepare('SELECT * FROM transactions').all();
console.log('Transações:', transactions);

// 4) Atualizar dados
db.prepare('UPDATE accounts SET description = ? WHERE code = ?').run('Caixa Principal', '1001');

// 5) Excluir dados
db.prepare('DELETE FROM transactions WHERE account_code = ?').run('1001');

console.log('Após atualização/exclusão:');
console.log('Contas:', db.prepare('SELECT * FROM accounts').all());
console.log('Transações:', db.prepare('SELECT * FROM transactions').all());
