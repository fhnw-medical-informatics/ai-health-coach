import { createReactAgent } from '@langchain/langgraph/prebuilt'
import { createLlm } from '../llm/llm'

import { AIMessage, SystemMessage } from '@langchain/core/messages'
import { RunnableConfig } from '@langchain/core/runnables'
import { DynamicStructuredTool } from '@langchain/core/tools'
import { z } from 'zod'
import { AgentState } from './types'

export const MATH_AGENT_NAME = 'math-agent'

const calcTool = new DynamicStructuredTool({
  name: 'calculate',
  description: 'Can perform additions',
  schema: z.object({
    a: z.number(),
    b: z.number(),
  }),
  func: async ({ a, b }) => {
    return a + b
  },
})

const mathAgent = createReactAgent({
  llm: createLlm(),
  tools: [calcTool],
  messageModifier: new SystemMessage(
    'You are a math agent who specializes in calculations. Please use your tools whenever possible.',
  ),
})

export const mathAgentNode = async (state: typeof AgentState.State, config?: RunnableConfig) => {
  const result = await mathAgent.invoke(state, config)
  const lastMessage = result.messages[result.messages.length - 1]
  return {
    messages: [new AIMessage({ content: lastMessage.content, name: MATH_AGENT_NAME })],
  }
}
