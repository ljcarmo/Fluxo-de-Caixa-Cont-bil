// src/infrastructure/sqlite/seed.ts
// =======================================
// Script de seed para popular o banco com dados iniciais.
// Usa account_code referenciando accounts.code (chave estrangeira).
// =======================================

import db from './database';

// Habilita validação de chaves estrangeiras
db.pragma('foreign_keys = ON');

// Limpa tabelas (cuidado: apaga dados existentes)
db.prepare('DELETE FROM transactions').run();
db.prepare('DELETE FROM accounts').run();

// Inserir contas de exemplo
const insertAccount = db.prepare(`
  INSERT INTO accounts (id, code, description, account_group, is_monetary, parent_code, is_active, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

const now = new Date().toISOString();

insertAccount.run('acc-001', '1001', 'Caixa', 'ATIVO', 1, null, 1, now);
insertAccount.run('acc-002', '2001', 'Fornecedores', 'PASSIVO', 0, null, 1, now);
insertAccount.run('acc-003', '3001', 'Vendas', 'RECEITA', 1, null, 1, now);
insertAccount.run('acc-004', '4001', 'Despesas Operacionais', 'DESPESA', 1, null, 1, now);

// Inserir transações de exemplo
const insertTransaction = db.prepare(`
  INSERT INTO transactions (account_code, amount, type, transaction_date, description)
  VALUES (?, ?, ?, ?, ?)
`);

insertTransaction.run('1001', 1000.0, 'C', now, 'Seed inicial');
insertTransaction.run('2001', -500.0, 'D', now, 'Pagamento fornecedor');
insertTransaction.run('3001', 2500.0, 'C', now, 'Venda realizada');
insertTransaction.run('4001', -800.0, 'D', now, 'Despesa operacional');

// Finalização
console.log('Seed executado com sucesso.');
db.close();
