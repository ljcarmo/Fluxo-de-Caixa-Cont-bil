// src/infrastructure/sqlite/accountService.ts
// import * as repo from '../infrastructure/sqlite/accountRepository'; // ajuste para o arquivo real
// Antes (incorreto quando os dois arquivos estão na mesma pasta)
// import * as repo from '../infrastructure/sqlite/accountRepository';

// Depois (correto)
import * as repo from './accountRepository';


interface Account {
  id: string;
  code: string;
  description: string;
  account_group: string;
  is_monetary: number;
  parent_code: string | null;
  is_active?: number;
  created_at: string;
}

// Cria conta
export function createAccount(code: string, description: string, group: string, isMonetary: boolean, parentCode?: string) {
  if (!code || !description || !group) {
    throw new Error("Dados obrigatórios ausentes: código, descrição e grupo são necessários.");
  }
  if (typeof (repo as any).insertAccount === 'function') {
    return (repo as any).insertAccount(code, description, group, isMonetary, parentCode);
  }
  throw new Error("Função repo.insertAccount não implementada no repositório.");
}

// Busca por código
export function getAccountByCode(code: string): Account | undefined {
  if (typeof (repo as any).getAccountByCode === 'function') {
    return (repo as any).getAccountByCode(code) as Account | undefined;
  }
  return undefined;
}

// Monta árvore de contas (usa listAccounts síncrono)
export function getAccountTree(parentCode: string | null = null): any[] {
  const all = (typeof (repo as any).listAccounts === 'function') ? (repo.listAccounts() as Account[]) : [];
  const children = all.filter(a => a.parent_code === parentCode);
  return children.map((account: Account) => ({
    ...account,
    children: getAccountTree(account.code)
  }));
}

export function getFinancialSummary() {
  if (typeof (repo as any).getGroupSummary === 'function') {
    return (repo as any).getGroupSummary();
  }
  throw new Error("Função repo.getGroupSummary não implementada.");
}

export function getMonetaryAccounts() {
  if (typeof (repo as any).getMonetaryAccounts === 'function') {
    return (repo as any).getMonetaryAccounts();
  }
  const all = (typeof (repo as any).listAccounts === 'function') ? (repo.listAccounts() as Account[]) : [];
  return all.filter(a => a.is_monetary === 1);
}

// Lançamento
export function postTransaction(code: string, value: number, type: 'D' | 'C', description: string) {
  const account = getAccountByCode(code);
  if (!account) throw new Error(`A conta ${code} não existe no sistema.`);
  if (account.is_active === 0) throw new Error(`A conta ${code} está desativada.`);
  if (value <= 0) throw new Error("O valor do lançamento deve ser positivo.");

  if (typeof (repo as any).insertTransaction === 'function') {
    return (repo as any).insertTransaction(code, value, type, description);
  }
  if (typeof (repo as any).addTransaction === 'function') {
    return (repo as any).addTransaction({
      account_code: code,
      amount: value,
      type,
      transaction_date: new Date().toISOString(),
      description
    });
  }
  throw new Error("Função de inserção de transação não implementada no repositório.");
}
