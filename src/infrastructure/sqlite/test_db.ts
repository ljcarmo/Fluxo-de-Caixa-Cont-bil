import { connectDB } from './connection';

const db = connectDB();

// Lista todas as tabelas existentes no banco
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table';").all();

console.log("Tabelas no banco:", tables);
