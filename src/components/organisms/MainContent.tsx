// ========== src/components/organisms/MainContent.tsx (CORECTAT) ==========

import React from 'react'
import { WelcomeScreen } from './WelcomeScreen'
import { ChatMessages } from './ChatMessages'
import { ChatInput } from './ChatInput'
import { TConversation } from '../../types/chat'

interface MainContentProps {
  hasMessages: boolean
  // WelcomeScreen props
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
  // ChatMessages props
  currentConversation: TConversation | null
  messagesEndRef: React.RefObject<HTMLDivElement> | null
}

export const MainContent = React.memo((props: MainContentProps) => {
  const {
    hasMessages,
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
    textareaRef,
    currentConversation,
    messagesEndRef
  } = props

  return (
    <div className="flex-1 flex flex-col bg-[#f0f6ff]">
      {!hasMessages ? (
        <WelcomeScreen
          text={text}
          setText={setText}
          handleSendClick={handleSendClick}
          handleKeyDown={handleKeyDown}
          submitting={submitting}
          discountsActive={discountsActive}
          dealsActive={dealsActive}
          setDiscountsActive={setDiscountsActive}
          setDealsActive={setDealsActive}
          handleActionButton={handleActionButton}
          textareaRef={textareaRef}
        />
      ) : (
        <>
          <ChatMessages
            currentConversation={currentConversation}
            messagesEndRef={messagesEndRef}
          />
          <ChatInput
            text={text}
            setText={setText}
            handleSendClick={handleSendClick}
            handleKeyDown={handleKeyDown}
            submitting={submitting}
            discountsActive={discountsActive}
            dealsActive={dealsActive}
            setDiscountsActive={setDiscountsActive}
            setDealsActive={setDealsActive}
            textareaRef={textareaRef}
          />
        </>
      )}
    </div>
  )
})

MainContent.displayName = 'MainContent'