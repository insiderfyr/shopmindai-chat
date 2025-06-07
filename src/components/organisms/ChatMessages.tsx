// ========== src/components/organisms/ChatMessages.tsx (CORECTAT) ==========

import React from 'react'
import { MessageBubble } from '../molecules/MessageBubble'
import { TConversation } from '../../types/chat'

interface ChatMessagesProps {
  currentConversation: TConversation | null
  messagesEndRef: React.RefObject<HTMLDivElement> | null
}

export const ChatMessages = React.memo(({ 
  currentConversation, 
  messagesEndRef 
}: ChatMessagesProps) => {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar">
      <div className="max-w-4xl mx-auto px-6 py-6">
        <div className="space-y-6">
          {currentConversation?.messages.map((message) => (
            <MessageBubble key={message.messageId} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  )
})

ChatMessages.displayName = 'ChatMessages'