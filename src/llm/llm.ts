import { ChatOpenAI } from '@langchain/openai'

export const createLlm = () =>
  // Optionally switch to ChatOllama instead of OpenAI
  // However, Ollama currently does not support tool choice yet (https://github.com/langchain-ai/langchainjs/issues/6897#issuecomment-2384210852)
  new ChatOpenAI({
    model: import.meta.env.VITE_LLM_MODEL,
    apiKey: import.meta.env.VITE_LLM_API_KEY,
    temperature: 0,
  })
