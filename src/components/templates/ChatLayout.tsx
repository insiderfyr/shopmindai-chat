// ========== src/components/templates/ChatLayout.tsx (CORECTAT FINAL) ==========

import React from 'react'
import { NavigationSidebar } from '../organisms/NavigationSidebar'
import { MainContent } from '../organisms/MainContent'
import { TConversation } from '../../types/chat'

interface ChatLayoutProps {
  // NavigationSidebar props
  isNavOpen: boolean
  setIsNavOpen: (open: boolean) => void
  conversations: TConversation[]
  currentConversation: TConversation | null
  newConversation: () => void
  selectConversation: (conversation: TConversation) => void
  groupConversationsByDate: (conversations: TConversation[]) => {
    today: TConversation[]
    yesterday: TConversation[]
    previousWeek: TConversation[]
    older: TConversation[]
  }
  // MainContent props
  hasMessages: boolean
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
  textareaRef: React.RefObject<HTMLTextAreaElement>
  messagesEndRef: React.RefObject<HTMLDivElement>
}

export const ChatLayout = React.memo((props: ChatLayoutProps) => {
  const {
    isNavOpen,
    setIsNavOpen,
    conversations,
    currentConversation,
    newConversation,
    selectConversation,
    groupConversationsByDate,
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
    messagesEndRef
  } = props

  return (
    <div className="flex h-screen bg-white">
      <NavigationSidebar
        isNavOpen={isNavOpen}
        setIsNavOpen={setIsNavOpen}
        conversations={conversations}
        currentConversation={currentConversation}
        newConversation={newConversation}
        selectConversation={selectConversation}
        groupConversationsByDate={groupConversationsByDate}
      />
      <MainContent
        hasMessages={hasMessages}
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
        currentConversation={currentConversation}
        messagesEndRef={messagesEndRef}
      />
    </div>
  )
})

ChatLayout.displayName = 'ChatLayout'