// src/infrastructure/sqlite/test_select.ts
// ========================================
// Script de leitura simples para validar dados reais do banco.
// ========================================

import db from './database';

// Lê todas as contas
const accounts = db.prepare('SELECT * FROM accounts').all();
console.log('Contas:', accounts);

// Lê todas as transações
const transactions = db.prepare('SELECT * FROM transactions').all();
console.log('Transações:', transactions);
