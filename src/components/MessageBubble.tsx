type MessageBubbleProps = {
  message: {
    id: string
    text: string
    sender: 'user' | 'system'
    timestamp: Date
  }
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === 'user'

  return (
    <div
      className={`flex ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
    >
      <div
        className={`max-w-[70%] rounded-lg p-3 ${
          isUser
            ? 'bg-primary-500 text-white'
            : 'bg-gray-100 text-gray-800'
        }`}
      >
        <p className="text-sm">{message.text}</p>
        <p className="text-xs mt-1 opacity-70">
          {message.timestamp.toLocaleTimeString()}
        </p>
      </div>
    </div>
  )
} 