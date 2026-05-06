import db from './database';
import fs from 'fs';
import path from 'path';

// 📂 Caminho para a pasta onde estão seus arquivos SQL
const migrationsDir = path.resolve(__dirname, 'migrations');

/**
 * Função para rodar os arquivos de migração em ordem 📜
 */
function initialize() {
  console.log("🚀 Iniciando a configuração do banco de dados...");

  // Lista os arquivos e garante que rodem na ordem (001, 002...)
  const files = fs.readdirSync(migrationsDir).sort();

  files.forEach(file => {
    if (file.endsWith('.sql')) {
      console.log(`📑 Executando: ${file}`);
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      db.exec(sql); // Executa o comando SQL no banco ⚡
    }
  });

  console.log("✅ Banco de dados pronto para uso!");
}

initialize();