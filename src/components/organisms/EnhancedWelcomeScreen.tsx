import React from 'react'
import { Search, Tag, Star, ArrowUp } from 'lucide-react'
import { ShopMindLogo } from '../atoms/ShopMindLogo'
import { ActionButton } from '../molecules/ActionButton'
import { ModelSelector } from '../molecules/ModelSelector'
import { SearchSuggestions } from '../molecules/SearchSuggestions'
import { ShoppingCharCounter } from '../molecules/ShoppingCharCounter'
import { CooldownToast } from '../molecules/CooldownToast'
import { useShoppingTextarea } from '../../hooks/useShoppingTextarea'
import { useModelSelector } from '../../hooks/useModelSelector'

interface EnhancedWelcomeScreenProps {
  onSendMessage: (message: string) => void
  onActionButton: (action: string) => void
}

export const EnhancedWelcomeScreen = React.memo(({
  onSendMessage,
  onActionButton
}: EnhancedWelcomeScreenProps) => {
  const {
    text,
    setText,
    textareaRef,
    charCount,
    isNearLimit,
    isAtLimit,
    error,
    suggestions,
    clearText,
    shouldShowCounter
  } = useShoppingTextarea()

  const {
    discountsActive,
    dealsActive,
    toggleDiscounts,
    toggleDeals,
    cooldownError
  } = useModelSelector()

  const handleSend = () => {
    if (text.trim() && !error) {
      onSendMessage(text)
      clearText()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

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
      
      {/* TEXTAREA CONTAINER cu PADDING MĂRIT */}
      <div className="relative mb-8 mt-6 w-full max-w-2xl mx-auto">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message ShopMindAI"
            rows={1}
            className={`w-full px-6 py-6 pr-20 border border-gray-200 rounded-3xl focus:outline-none focus:border-gray-300 bg-white text-base resize-none overflow-hidden min-h-[120px] max-h-[300px] ${
              error ? 'border-red-300' : ''
            }`}
            style={{ 
              lineHeight: '1.5',
              paddingBottom: '80px' // MĂRIT la 80px pentru siguranță
            }}
          />
          
          {/* SEND BUTTON - poziționat mai sus */}
          <div className="absolute right-4 bottom-16 flex items-center gap-2">
            <button
              onClick={handleSend}
              disabled={!text.trim() || !!error || isAtLimit}
              className={`p-2.5 rounded-full disabled:opacity-50 transition-all ${
                text.trim() && !error && !isAtLimit
                  ? 'bg-[#4d8eff] hover:bg-[#3a6cd9] text-white shadow-lg' 
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
          
          {/* MODEL SELECTOR BUTTONS - poziție fixă jos */}
          <div className="absolute left-6 bottom-4 flex items-center gap-2">
            <div className="relative">
              <ModelSelector
                isActive={discountsActive}
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m8 11 2 2 4-4"/><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>}
                label="Discounts Finder"
                onClick={toggleDiscounts}
              />
              {cooldownError && <CooldownToast message={cooldownError} />}
            </div>
            
            <div className="relative">
              <ModelSelector
                isActive={dealsActive}
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"/><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/></svg>}
                label="Daily Deals"
                onClick={toggleDeals}
              />
            </div>
          </div>

          {/* SEARCH SUGGESTIONS */}
          <SearchSuggestions 
            suggestions={suggestions}
            onSelectSuggestion={setText}
            show={suggestions.length > 0 && !error}
          />

          {/* CHARACTER COUNTER - poziționat mai sus */}
          {shouldShowCounter && (
            <ShoppingCharCounter 
              count={charCount}
              isNearLimit={isNearLimit}
              isAtLimit={isAtLimit}
              show={shouldShowCounter}
            />
          )}

          {/* ERROR MESSAGE */}
          {error && (
            <div className="absolute top-full left-0 right-0 mt-1 p-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex flex-wrap justify-center gap-3 mb-8 max-w-2xl mx-auto">
        <ActionButton 
          icon={<Search className="w-4 h-4" />}
          label="Smart Search"
          onClick={() => onActionButton('Smart Search')}
        />
        <ActionButton 
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>}
          label="Compare Products"
          onClick={() => onActionButton('Compare Products')}
        />
        <ActionButton 
          icon={<Tag className="w-4 h-4" />}
          label="Find Deals"
          onClick={() => onActionButton('Find Deals')}
        />
        <ActionButton 
          icon={<Star className="w-4 h-4" />}
          label="Product Reviews"
          onClick={() => onActionButton('Product Reviews')}
        />
      </div>
    </div>
  )
})

EnhancedWelcomeScreen.displayName = 'EnhancedWelcomeScreen'