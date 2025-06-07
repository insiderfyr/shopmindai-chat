// ========== src/components/molecules/MessageBubble.tsx ==========

import React from 'react'
import { User2 } from 'lucide-react'
import { ShopMindLogo } from '../atoms/ShopMindLogo'
import { LoadingSpinner } from '../atoms/LoadingSpinner'
import { TMessage } from '../../types/chat'

interface MessageBubbleProps {
  message: TMessage
}

export const MessageBubble = React.memo(({ message }: MessageBubbleProps) => {
  return (
    <div className="flex gap-4">
      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
        {message.role === 'user' ? (
          <div className="w-8 h-8 bg-[#4d8eff] rounded-full flex items-center justify-center">
            <User2 className="w-4 h-4 text-white" />
          </div>
        ) : (
          <ShopMindLogo size={32} />
        )}
      </div>
      <div className="flex-1 pt-1">
        <div className="text-sm text-gray-900 leading-relaxed whitespace-pre-wrap">
          {message.content}
          {message.unfinished && <LoadingSpinner />}
        </div>
      </div>
    </div>
  )
})

MessageBubble.displayName = 'MessageBubble'