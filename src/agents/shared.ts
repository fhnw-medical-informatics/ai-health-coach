import { AIMessage, BaseMessage } from '@langchain/core/messages'
import { Annotation, END, MessagesAnnotation } from '@langchain/langgraph/web'

// Defines the object that is passed between agents in the graph
// Reducer functions define how to integrate new state returned by an agent with previous state
export const AgentState = Annotation.Root({
  // A utility annotation that provides a 'messages' field and the logic of how to combine them (history + new = new history)
  ...MessagesAnnotation.spec,
  // The agent node that last performed work
  next: Annotation<string>({
    reducer: (x, y) => y ?? x ?? END,
    default: () => END,
  }),
})

// Properly name the messages from the agent such that the UI can display them correctly
export const nameAgentMessages = (messages: BaseMessage[], agentName: string) => {
  return messages.map((message: BaseMessage) => {
    if (message.getType() === 'ai' && !message.name) {
      return new AIMessage({ ...message, name: agentName })
    } else {
      return message
    }
  })
}
