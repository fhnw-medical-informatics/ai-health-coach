import { SystemMessage } from '@langchain/core/messages'
import { RunnableConfig } from '@langchain/core/runnables'
import { createReactAgent } from '@langchain/langgraph/prebuilt'
import { createLlm } from '../llm/llm'
import { AgentState, nameAgentMessages } from './shared'

export const PSYCHOLOGIST_AGENT_NAME = 'psychologist-agent'

const psychologistAgent = createReactAgent({
  llm: createLlm(),
  tools: [],
  messageModifier: new SystemMessage(
    'You are a psychologist who specializes in supporting patients with mental health struggles. Please be empathetic and supportive.',
  ),
})

export const psychologistNode = async (state: typeof AgentState.State, config?: RunnableConfig) => {
  const result = await psychologistAgent.invoke(state, config)
  const messages = nameAgentMessages(result.messages, PSYCHOLOGIST_AGENT_NAME)
  return { messages }
}
