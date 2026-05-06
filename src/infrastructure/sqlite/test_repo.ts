import { insertAccount, listAccounts } from './accountRepository';

// Inserir uma conta de exemplo
insertAccount("1.1.1", "Caixa", "ATIVO", true);

// Listar todas as contas
listAccounts();
