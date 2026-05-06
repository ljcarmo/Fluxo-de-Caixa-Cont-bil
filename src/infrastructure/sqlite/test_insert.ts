// src/infrastructure/sqlite/test_insert.ts
import db from './database';

// Cria tabela de teste se não existir
db.prepare(`
  CREATE TABLE IF NOT EXISTS demo (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message TEXT NOT NULL
  )
`).run();

// Insere uma linha
const insert = db.prepare('INSERT INTO demo (message) VALUES (?)');
insert.run('Olá Leonardo, teste de escrita!');

// Lê todas as linhas
const rows = db.prepare('SELECT * FROM demo').all();
console.log('Linhas na tabela demo:', rows);
