import { AIMessage, SystemMessage } from '@langchain/core/messages'
import { RunnableConfig } from '@langchain/core/runnables'
import { createReactAgent } from '@langchain/langgraph/prebuilt'
import { createLlm } from '../llm/llm'
import { AgentState } from './types'

export const PSYCHOLOGIST_AGENT_NAME = 'psychologist-agent'

const psychologistAgent = createReactAgent({
  llm: createLlm(),
  tools: [],
  messageModifier: new SystemMessage(
    'You are a psychologist who specializes in diagnosing patients with mental health conditions.',
  ),
})

export const psychologistNode = async (state: typeof AgentState.State, config?: RunnableConfig) => {
  const result = await psychologistAgent.invoke(state, config)
  const lastMessage = result.messages[result.messages.length - 1]
  return {
    messages: [new AIMessage({ content: lastMessage.content, name: PSYCHOLOGIST_AGENT_NAME })],
  }
}
