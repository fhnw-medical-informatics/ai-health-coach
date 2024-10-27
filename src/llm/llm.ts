import { ChatOpenAI } from '@langchain/openai'

export const createLlm = () =>
  new ChatOpenAI({
    model: import.meta.env.VITE_LLM_MODEL,
    apiKey: import.meta.env.VITE_LLM_API_KEY,
    temperature: 0,
  })
