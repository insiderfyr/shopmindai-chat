// ========== src/components/organisms/WelcomeScreen.tsx (CORECTAT) ==========

import React from 'react'
import { Search, Tag, Star, ArrowUp } from 'lucide-react'
import { ShopMindLogo } from '../atoms/ShopMindLogo'
import { ActionButton } from '../molecules/ActionButton'
import { ModelSelector } from '../molecules/ModelSelector'

interface WelcomeScreenProps {
  text: string
  setText: (text: string) => void
  handleSendClick: () => void
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  submitting: boolean
  discountsActive: boolean
  dealsActive: boolean
  setDiscountsActive: (active: boolean | ((prev: boolean) => boolean)) => void
  setDealsActive: (active: boolean | ((prev: boolean) => boolean)) => void
  handleActionButton: (action: string) => void
  textareaRef: React.RefObject<HTMLTextAreaElement> | null
}

export const WelcomeScreen = React.memo(({
  text,
  setText,
  handleSendClick,
  handleKeyDown,
  submitting,
  discountsActive,
  dealsActive,
  setDiscountsActive,
  setDealsActive,
  handleActionButton,
  textareaRef
}: WelcomeScreenProps) => {
  return (
    <div className="flex flex-1 flex-col justify-center items-center p-6">
      <div className="max-w-2xl w-full text-center mx-auto">
        <div className="mb-12">
          <h1 className="text-3xl font-semibold text-gray-900 mb-4 flex items-center gap-3 justify-center">
            <ShopMindLogo size={36} />
            Hi, I'm ShopMindAI.
          </h1>
        </div>
      </div>
      
      <div className="relative mb-8 mt-6 w-full max-w-2xl mx-auto">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message ShopMindAI"
          rows={1}
          disabled={submitting}
          className="w-full px-6 py-6 pr-20 border border-gray-200 rounded-3xl focus:outline-none focus:border-gray-300 bg-white text-base resize-none overflow-hidden min-h-[120px] max-h-[300px] disabled:opacity-50"
          style={{ lineHeight: '1.5' }}
        />
        <div className="absolute right-4 bottom-4 flex items-center gap-2">
          <button
            onClick={handleSendClick}
            disabled={!text.trim() || submitting}
            className={`p-2.5 rounded-full disabled:opacity-50 ${
              text.trim() && !submitting
                ? 'bg-[#4d8eff] hover:bg-[#3a6cd9] text-white shadow-lg' 
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            <ArrowUp className="w-4 h-4" />
          </button>
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

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-8 max-w-2xl mx-auto">
        <ActionButton 
          icon={<Search className="w-4 h-4" />}
          label="Smart Search"
          onClick={() => handleActionButton('Smart Search')}
        />
        <ActionButton 
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shopping-bag-icon lucide-shopping-bag"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>}
          label="Compare Products"
          onClick={() => handleActionButton('Compare Products')}
        />
        <ActionButton 
          icon={<Tag className="w-4 h-4" />}
          label="Find Deals"
          onClick={() => handleActionButton('Find Deals')}
        />
        <ActionButton 
          icon={<Star className="w-4 h-4" />}
          label="Product Reviews"
          onClick={() => handleActionButton('Product Reviews')}
        />
      </div>
    </div>
  )
})

WelcomeScreen.displayName = 'WelcomeScreen'