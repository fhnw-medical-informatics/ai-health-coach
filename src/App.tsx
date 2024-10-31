import { BaseMessage, HumanMessage } from '@langchain/core/messages'
import { useCallback, useEffect, useRef, useState } from 'react'

import Markdown from 'react-markdown'

import './App.css'

import { graph } from './agents/agentGraph'
import { useMedicineCabinetStore } from './state/medicineCabinetStore'

export const App = () => {
  const chatMsgContainerRef = useRef<HTMLDivElement>(null)
  const [chatMessages, setChatMessages] = useState<BaseMessage[]>([])
  const [chatInput, setChatInput] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const chatInputRef = useRef<HTMLInputElement>(null)

  const { medications } = useMedicineCabinetStore()

  // Append new human messages to the chat
  const handleUserMessage = useCallback(
    async (userMessageText: string) => {
      const newHumanMessage = new HumanMessage(userMessageText)
      setChatMessages((messageHistory) => [...messageHistory, newHumanMessage])
      setChatInput('')
    },
    [setChatMessages, setChatInput],
  )

  // Scroll to the bottom of the chat messages when they change
  useEffect(() => {
    if (chatMsgContainerRef.current) {
      chatMsgContainerRef.current.scrollTop = chatMsgContainerRef.current.scrollHeight
    }
  }, [isLoading, setIsLoading, chatMessages])

  // Invoke the graph when a new human message is appended to the chat
  useEffect(() => {
    const invokeGraph = async () => {
      if (chatMessages.length > 0 && chatMessages[chatMessages.length - 1].getType() === 'human') {
        setIsLoading(true)
        const agentFinalState = await graph.invoke({
          messages: chatMessages,
        })
        if (agentFinalState.messages.length !== chatMessages.length) {
          setChatMessages(agentFinalState.messages)
        }
        setIsLoading(false)
      }
    }
    invokeGraph()
  }, [chatMessages])

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
              <br />
              <div className="medication-info">
                <span>{`${medication.strength} – ${medication.indication}`}</span>
              </div>
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
            <div key={index} className={`chat-message ${message.getType()} ${message.name}`}>
              {message.getType() === 'ai' && message.name && message.content.length > 0 && (
                <div className="agent-call-info">
                  <p>{message.name.split('-')[0].toUpperCase()}</p>
                </div>
              )}
              <Markdown>{`${message.content ?? ''}`}</Markdown>
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
