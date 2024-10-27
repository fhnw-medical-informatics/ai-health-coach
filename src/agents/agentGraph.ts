import { START, StateGraph } from '@langchain/langgraph/web'
import { PHARMACIST_AGENT_NAME, pharmacistAgentNode } from './pharmacistAgent'
import { PSYCHOLOGIST_AGENT_NAME, psychologistNode } from './psychologistAgent'
import { SUPERVISOR_AGENT_NAME, supervisorChain } from './supervisorAgent'
import { AgentState } from './types'

const workflow = new StateGraph(AgentState)
  .addNode(PSYCHOLOGIST_AGENT_NAME, psychologistNode)
  .addNode(PHARMACIST_AGENT_NAME, pharmacistAgentNode)
  .addNode(SUPERVISOR_AGENT_NAME, supervisorChain)
  // Non-Conditional edges which allow for agents to report back to supervisor
  .addEdge(PSYCHOLOGIST_AGENT_NAME, SUPERVISOR_AGENT_NAME)
  .addEdge(PHARMACIST_AGENT_NAME, SUPERVISOR_AGENT_NAME)
  // Conditional edge which allow the supervisor to decide the next agent to call
  .addConditionalEdges(SUPERVISOR_AGENT_NAME, (x: typeof AgentState.State) => {
    console.log('supervisor > ', x.next)
    return x.next
  })
  .addEdge(START, SUPERVISOR_AGENT_NAME)

export const graph = workflow.compile()
