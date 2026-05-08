import * as dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Carrega a chave do ficheiro .env
dotenv.config();

async function testarSistema() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error("Erro: GEMINI_API_KEY não encontrada no ficheiro .env");
    return;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const prompt = "Responde apenas com a frase: Sistema Operacional.";
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
  } catch (error) {
    console.error("Erro na ligação:", error);
  }
}

testarSistema();