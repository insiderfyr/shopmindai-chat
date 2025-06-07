// ========== src/app/page.tsx (CORECTAT FINAL) ==========

"use client"

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { ChatLayout } from '../components/templates/ChatLayout'
import { scrollbarStyles } from '../components/atoms/CustomScrollbarStyles'
import { useChat } from '../hooks/useChat'
import { useTextarea } from '../hooks/useTextarea'
import { useConversations } from '../hooks/useConversations'

export default function ChatPage() {
  // State management following LibreChat patterns - EMPTY conversations initially
  const [isNavOpen, setIsNavOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [discountsActive, setDiscountsActive] = useState(false)
  const [dealsActive, setDealsActive] = useState(false)

  // Custom hooks
  const {
    conversations,
    currentConversation,
    submitting,
    handleSubmit,
    newConversation,
    selectConversation
  } = useChat()

  const {
    text,
    setText,
    textareaRef
  } = useTextarea()

  const {
    groupConversationsByDate
  } = useConversations()

  // Refs - CORECTARE: Tipuri corecte pentru ref-uri
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Effects
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [currentConversation?.messages])

  // Utility functions
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  // Event handlers
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit({ 
        message: text,
        conversationId: currentConversation?.conversationId,
        parentMessageId: currentConversation?.messages[currentConversation.messages.length - 1]?.messageId
      })
      setText('')
    }
  }, [text, currentConversation, handleSubmit, setText])

  const handleSendClick = useCallback(() => {
    handleSubmit({ 
      message: text,
      conversationId: currentConversation?.conversationId,
      parentMessageId: currentConversation?.messages[currentConversation.messages.length - 1]?.messageId
    })
    setText('')
  }, [text, currentConversation, handleSubmit, setText])

  const handleNewConversation = useCallback(() => {
    newConversation()
    setText('')
  }, [newConversation, setText])

  const handleActionButton = useCallback((action: string) => {
    const prompts = {
      'Smart Search': 'Help me find the best deals on popular products',
      'Compare Products': 'I want to compare similar products and find the best option',
      'Find Deals': 'Show me the best deals and discounts available today',
      'Product Reviews': 'I need help reading and understanding product reviews'
    }
    
    setText(prompts[action as keyof typeof prompts] || action)
  }, [setText])

  if (!mounted) return null

  const hasMessages = (currentConversation?.messages?.length ?? 0) > 0

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: scrollbarStyles }} />
      <ChatLayout
        isNavOpen={isNavOpen}
        setIsNavOpen={setIsNavOpen}
        conversations={conversations}
        currentConversation={currentConversation}
        newConversation={handleNewConversation}
        selectConversation={selectConversation}
        groupConversationsByDate={groupConversationsByDate}
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
        messagesEndRef={messagesEndRef}
      />
    </>
  )
}