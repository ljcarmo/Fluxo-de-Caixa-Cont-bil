import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

export const connectDB = () => {
  const db = new Database('casa_carmo.db');
  db.pragma('journal_mode = WAL'); // aumenta segurança contra corrupção

  // Caminho do arquivo de migração
  const migrationPath = path.join(__dirname, 'migrations', '001_initial_schema.sql');
  const sql = fs.readFileSync(migrationPath, 'utf-8');

  // Executa o SQL para criar a tabela
  db.exec(sql);

  return db;
};

