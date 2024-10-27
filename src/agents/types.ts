import { BaseMessage } from '@langchain/core/messages'
import { Annotation, END } from '@langchain/langgraph/web'

// This defines the object that is passed between each node
// in the LangGraph. We will create different nodes for each agent and tool
export const AgentState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
    default: () => [],
  }),
  // The agent node that last performed work
  next: Annotation<string>({
    reducer: (x, y) => y ?? x ?? END,
    default: () => END,
  }),
})
