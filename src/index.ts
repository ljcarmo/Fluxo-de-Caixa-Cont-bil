// src/index.ts
// Ponto de entrada — lida com repositório síncrono (better-sqlite3) ou assíncrono (sqlite3/Promise)

import * as repo from './infrastructure/sqlite/accountRepository';

interface Account {
  code: string;
  description: string;
  account_group: string;
}

interface Transaction {
  transaction_date: string;
  type: string;
  amount: number;
  description: string | null;
}

/**
 * Utility: aceita um valor que pode ser T ou Promise<T> e sempre retorna Promise<T>.
 */
function asPromise<T>(maybe: T | Promise<T>): Promise<T> {
  if (maybe && typeof (maybe as any).then === 'function') {
    return maybe as Promise<T>;
  }
  return Promise.resolve(maybe as T);
}

async function main() {
  // 1) Verifica se a função existe
  if (typeof (repo as any).listAccounts !== 'function') {
    console.error('Função listAccounts não encontrada no repositório.');
    return;
  }

  // 2) Chama a função e normaliza para Promise<Account[]>
  const maybeAccounts = (repo as any).listAccounts();
  const accounts: Account[] = await asPromise<Account[]>(maybeAccounts) || [];

  console.log("=== Lista de Contas ===");
  accounts.forEach((acc: Account) => {
    console.log(`${acc.code} - ${acc.description} (${acc.account_group})`);
  });

  // Transações: mesma abordagem defensiva
  if (typeof (repo as any).getTransactionsByAccount === 'function') {
    const maybeTx = (repo as any).getTransactionsByAccount('1001');
    const transactions: Transaction[] = await asPromise<Transaction[]>(maybeTx) || [];

    console.log("\n=== Transações ===");
    transactions.forEach((t: Transaction) => {
      console.log(`${t.transaction_date} | ${t.type} | ${t.amount} | ${t.description}`);
    });
  } else {
    console.log("\nFunção getTransactionsByAccount não encontrada no repositório.");
  }
}

main().catch(err => {
  console.error('Erro na execução:', err);
});
