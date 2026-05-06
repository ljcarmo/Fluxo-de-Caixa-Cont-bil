import * as service from './accountService';

// 1. Gabarito local para o teste não chiar com as propriedades 🗂️[cite: 4]
interface Account {
  id: string;
  code: string;
  description: string;
}

async function runTests() {
  try {
    console.log("--- 🚀 INICIANDO TESTES DE SERVIÇO ---");

    // 2. Criar contas de teste[cite: 1]
    console.log("\n1. Criando estrutura...");
    service.createAccount("1", "ATIVO", "ATIVO", false);
    service.createAccount("1.1", "CAIXA", "ATIVO", true, "1");

    // 3. Buscar conta (O 'as Account' resolve o erro de 'description') 🔍[cite: 3, 4]
    console.log("\n2. Buscando conta 1.1...");
    const conta = service.getAccountByCode("1.1") as Account | undefined;
    
    if (conta) {
      console.log(`✅ Sucesso! Descrição encontrada: ${conta.description}`);
    }

    // 4. Validar árvore e resumo[cite: 1]
    const arvore = service.getAccountTree();
    console.log("\n3. Árvore de contas gerada.");

    const resumo = service.getFinancialSummary();
    console.log("\n4. Resumo por grupo:");
    console.table(resumo);

    console.log("\n--- ✨ TESTES FINALIZADOS ---");
  } catch (error) {
    console.error("\n❌ ERRO NOS TESTES:", error instanceof Error ? error.message : error);
  }
}

runTests();