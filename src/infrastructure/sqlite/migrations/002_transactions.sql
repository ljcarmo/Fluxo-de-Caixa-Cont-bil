-- 💸 Tabela para registrar as movimentações financeiras
CREATE TABLE IF NOT EXISTS transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_code TEXT NOT NULL, 
  amount REAL NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('C', 'D')), -- ⚖️ Garante a organização
  transaction_date TEXT NOT NULL,
  description TEXT,
  FOREIGN KEY (account_code) REFERENCES accounts (code)
);