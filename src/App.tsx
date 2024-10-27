import { useCallback, useEffect, useRef, useState } from 'react'

import Markdown from 'react-markdown'

import './App.css'

import { BaseMessage, HumanMessage } from '@langchain/core/messages'
import { graph } from './agents/agentGraph'
import { useMedicineCabinetStore } from './state/medicineCabinetStore'

export const App = () => {
  const [chatInput, setChatInput] = useState('')
  const [chatMessages, setChatMessages] = useState<ReadonlyArray<BaseMessage>>([])

  const [isLoading, setIsLoading] = useState(false)

  const chatMsgContainerRef = useRef<HTMLDivElement>(null)
  const chatInputRef = useRef<HTMLInputElement>(null)

  const { medications } = useMedicineCabinetStore()

  const invokeAgentGraph = useCallback(async (messages: ReadonlyArray<BaseMessage>) => {
    setIsLoading(true)

    // Invoke the agent graph with our current history of messages
    const agentFinalState = await graph.invoke({ messages })

    const responseMessage = agentFinalState.messages[agentFinalState.messages.length - 1]

    // Add the response message to the chat messages
    setChatMessages((currentChatMessages) => [...currentChatMessages, responseMessage])

    setIsLoading(false)
  }, [])

  // Whenever a new message is added to the chat by the user, the agent graph is called to get a response
  useEffect(() => {
    if (chatMessages.length > 0 && chatMessages[chatMessages.length - 1].getType() == 'human') {
      invokeAgentGraph(chatMessages)
    }

    // Scroll to the bottom of the chat messages
    if (chatMsgContainerRef.current) {
      chatMsgContainerRef.current.scrollTop = chatMsgContainerRef.current.scrollHeight
    }

    // Focus the chat input
    if (chatInputRef.current) {
      chatInputRef.current.focus()
    }
  }, [chatMessages, invokeAgentGraph])

  // Add user message to chat messages
  const handleUserMessage = useCallback(async (message: string) => {
    const userMessage = new HumanMessage(message)

    setChatMessages((currentChatMessages) => [...currentChatMessages, userMessage])
    setChatInput('')
  }, [])

  return (
    <div className="app-container">
      <div className="cabinet-container">
        <div className="title-bar">
          <h3>Medicine Cabinet</h3>
        </div>
        <ul className="cabinet">
          {medications.map((medication, index) => (
            <li key={index}>
              <span>{medication.name}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="chat-container">
        <div className="title-bar">
          <h2>Assistant</h2>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <a href="#" onClick={() => setChatMessages([])}>
              Clear Chat
            </a>
          )}
        </div>
        <div ref={chatMsgContainerRef} className="chat-messages">
          {chatMessages.map((message, index) => (
            <div key={index} className={`chat-message ${message.getType()}`}>
              <Markdown>{`${message.content ?? ''}`}</Markdown>
              {/* {message.getType() === 'ai' && message.tool_calls && (
                <div className="tool-call-info">
                  <p>Tool Call: {message.tool_calls[0]?.function.name}</p>
                </div>
              )} */}
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            ref={chatInputRef}
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleUserMessage(chatInput)}
            placeholder="Enter your message"
            disabled={isLoading}
            autoFocus={true}
          />
          <button onClick={() => handleUserMessage(chatInput)} disabled={isLoading}>
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
