'use client'

import { useState } from 'react'
import { MicrophoneIcon, PaperAirplaneIcon } from '@heroicons/react/24/solid'
import MessageBubble from './MessageBubble'

type Message = {
  id: string
  text: string
  sender: 'user' | 'system'
  timestamp: Date
}

export default function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isRecording, setIsRecording] = useState(false)

  const handleSendMessage = async () => {
    if (!inputText.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])
    setInputText('')

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputText }),
      })

      if (!response.ok) {
        throw new Error('Failed to process message')
      }

      const data = await response.json()
      
      const systemMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: 'system',
        timestamp: new Date(),
      }
      
      setMessages((prev) => [...prev, systemMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, there was an error processing your message. Please try again.',
        sender: 'system',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    }
  }

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice input is not supported in your browser.')
      return
    }

    const recognition = new (window as any).webkitSpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => {
      setIsRecording(true)
    }

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setInputText(transcript)
      setIsRecording(false)
    }

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      setIsRecording(false)
    }

    recognition.onend = () => {
      setIsRecording(false)
    }

    recognition.start()
  }

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-lg">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </div>
      <div className="border-t p-4">
        <div className="flex space-x-2">
          <button
            onClick={handleVoiceInput}
            className={`p-2 rounded-full ${
              isRecording ? 'bg-red-500' : 'bg-gray-100'
            } hover:bg-gray-200 transition-colors`}
          >
            <MicrophoneIcon className="h-5 w-5 text-gray-600" />
          </button>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            onClick={handleSendMessage}
            className="p-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
} 