// ========== src/components/organisms/ChatInput.tsx (CORECTAT) ==========

import React from 'react'
import { ArrowUp, Mic, User2 } from 'lucide-react'
import { ModelSelector } from '../molecules/ModelSelector'

interface ChatInputProps {
  text: string
  setText: (text: string) => void
  handleSendClick: () => void
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  submitting: boolean
  discountsActive: boolean
  dealsActive: boolean
  setDiscountsActive: (active: boolean | ((prev: boolean) => boolean)) => void
  setDealsActive: (active: boolean | ((prev: boolean) => boolean)) => void
  textareaRef: React.RefObject<HTMLTextAreaElement> | null
}

export const ChatInput = React.memo(({
  text,
  setText,
  handleSendClick,
  handleKeyDown,
  submitting,
  discountsActive,
  dealsActive,
  setDiscountsActive,
  setDealsActive,
  textareaRef
}: ChatInputProps) => {
  return (
    <div className="border-t border-gray-200 px-6 py-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message ShopMindAI"
            rows={1}
            disabled={submitting}
            className="w-full px-4 py-3 pr-20 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-300 bg-white text-sm resize-none overflow-hidden min-h-[48px] max-h-[200px] disabled:opacity-50"
            style={{ lineHeight: '1.5' }}
          />
          <div className="absolute right-3 bottom-3 flex items-center gap-2">
            <button
              onClick={handleSendClick}
              disabled={!text.trim() || submitting}
              className={`p-2 rounded-full disabled:opacity-50 ${
                text.trim() && !submitting
                  ? 'bg-[#4d8eff] hover:bg-[#3a6cd9] text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              <ArrowUp className="w-4 h-4" />
            </button>
            <button 
              disabled={submitting}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <Mic className="w-4 h-4 text-gray-400" />
            </button>
            <div className="w-6 h-6 bg-[#4d8eff] rounded-full flex items-center justify-center">
              <User2 className="w-3 h-3 text-white" />
            </div>
          </div>
          {/* Model Selector Buttons */}
          <div className="absolute left-6 bottom-4 flex items-center gap-2">
            <ModelSelector
              isActive={discountsActive}
              icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search-check-icon lucide-search-check"><path d="m8 11 2 2 4-4"/><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>}
              label="Discounts Finder"
              onClick={() => setDiscountsActive((prev) => !prev)}
            />
            <ModelSelector
              isActive={dealsActive}
              icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-hourglass-icon lucide-hourglass"><path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"/><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/></svg>}
              label="Daily Deals"
              onClick={() => setDealsActive((prev) => !prev)}
            />
          </div>
        </div>
      </div>
    </div>
  )
})

ChatInput.displayName = 'ChatInput'