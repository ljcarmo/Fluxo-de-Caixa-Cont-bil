// src/infrastructure/sqlite/database.ts
// ================================
// **ARQUIVO PRINCIPAL**: database.ts
// Resolve caminho absoluto do banco e exporta a instância do better-sqlite3.
// Ajuste DB_DIR_ABSOLUTE se quiser outro local fixo.
// ================================

import path from 'path';
import Database from 'better-sqlite3';
import dotenv from 'dotenv';

dotenv.config();

const DB_PATH = process.env.DB_PATH || path.resolve(process.cwd(), 'casa_carmo.db');

console.log('Banco de dados em:', DB_PATH);

const db = new Database(DB_PATH, { readonly: false });
export default db;