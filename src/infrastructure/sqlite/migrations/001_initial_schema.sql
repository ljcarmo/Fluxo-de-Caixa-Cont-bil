CREATE TABLE IF NOT EXISTS accounts (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  description TEXT NOT NULL,
  account_group TEXT NOT NULL CHECK (account_group IN ('ATIVO','PASSIVO','RECEITA','DESPESA')),
  is_monetary INTEGER NOT NULL,
  parent_code TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL
);