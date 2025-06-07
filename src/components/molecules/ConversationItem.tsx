// ========== src/components/molecules/ConversationItem.tsx ==========

import React from 'react'
import { MessageSquare } from 'lucide-react'
import { TConversation } from '../../types/chat'

interface ConversationItemProps {
  conversation: TConversation
  isActive: boolean
  onClick: (conversation: TConversation) => void
}

export const ConversationItem = React.memo(({
  conversation,
  isActive,
  onClick
}: ConversationItemProps) => {
  return (
    <button
      onClick={() => onClick(conversation)}
      className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors text-sm group relative ${
        isActive 
          ? 'bg-gray-700 text-white' 
          : 'text-gray-300 hover:bg-gray-800'
      }`}
    >
      <div className="flex items-center gap-3">
        <MessageSquare className="w-4 h-4 flex-shrink-0" />
        <span className="truncate flex-1">{conversation.title}</span>
      </div>
    </button>
  )
})

ConversationItem.displayName = 'ConversationItem'