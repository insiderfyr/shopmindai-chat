// ========== src/hooks/useChat.ts ==========

import { useState, useCallback } from 'react'
import { TMessage, TConversation, TSubmission } from '../types/chat'

export const useChat = () => {
  const [conversations, setConversations] = useState<TConversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<TConversation | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const generateId = () => `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  const generateTitle = (message: string) => {
    const maxLength = 50
    return message.length > maxLength ? message.slice(0, maxLength) + '...' : message
  }

  // AI Response generation
  const generateAIResponse = useCallback((userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    
    if (lowerMessage.includes('iphone') || lowerMessage.includes('phone')) {
      return "📱 I can help you compare iPhone models! The iPhone 15 Pro offers significant improvements with the A17 Pro chip, improved cameras, and USB-C. For the best deals, I recommend checking Apple, Amazon, Best Buy, and carrier stores. What's your budget range and which features matter most to you?"
    }
    
    if (lowerMessage.includes('laptop') || lowerMessage.includes('computer')) {
      return "💻 Great choice! For gaming laptops under $1500, I'd recommend looking at:\n\n• ASUS ROG Strix G15/G16 series\n• Acer Predator Helios 300\n• MSI Katana/Sword series\n• Lenovo Legion 5\n\nThese typically feature RTX 4060/4070 GPUs and latest CPUs. What games will you be playing, and do you prefer performance or battery life?"
    }
    
    if (lowerMessage.includes('fashion') || lowerMessage.includes('clothes') || lowerMessage.includes('style')) {
      return "👗 Fashion trends for Winter 2025 include:\n\n• Oversized blazers and coats\n• Rich burgundy and deep green colors\n• Chunky knit sweaters\n• Statement boots\n• Layered jewelry\n\nAre you looking for specific pieces, or building a complete winter wardrobe? What's your style preference and budget?"
    }
    
    if (lowerMessage.includes('home') || lowerMessage.includes('furniture') || lowerMessage.includes('decor')) {
      return "🏠 Home shopping is exciting! I can help you find furniture, decor, and essentials. Popular trends include:\n\n• Warm, earthy tones\n• Sustainable materials\n• Multi-functional furniture\n• Smart home integration\n\nWhich room are you focusing on, and what's your budget range?"
    }
    
    return "I'm your ShopMindAI assistant! I can help you find the perfect products, compare prices, read reviews, and discover great deals across categories like electronics, fashion, home goods, and more. What are you shopping for today?"
  }, [])

  // Streaming simulation following LibreChat pattern
  const simulateStreaming = useCallback(async (
    messageId: string, 
    content: string, 
    conversationId: string
  ) => {
    const words = content.split(' ')
    
    for (let i = 0; i <= words.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 50))
      
      const partialContent = words.slice(0, i).join(' ')
      const isComplete = i === words.length
      
      setConversations(prev => prev.map(conv => 
        conv.conversationId === conversationId 
          ? {
              ...conv,
              messages: conv.messages.map(msg => 
                msg.messageId === messageId 
                  ? { ...msg, content: partialContent, unfinished: !isComplete }
                  : msg
              )
            }
          : conv
      ))
      
      if (currentConversation?.conversationId === conversationId) {
        setCurrentConversation(prev => prev ? {
          ...prev,
          messages: prev.messages.map(msg => 
            msg.messageId === messageId 
              ? { ...msg, content: partialContent, unfinished: !isComplete }
              : msg
          )
        } : null)
      }
    }
  }, [currentConversation?.conversationId])

  // Message submission following LibreChat pattern
  const handleSubmit = useCallback(async (submission: TSubmission) => {
    if (!submission.message.trim() || submitting) return

    setSubmitting(true)

    const userMessageId = generateId()
    const assistantMessageId = generateId()
    const timestamp = new Date()

    // Create user message
    const userMessage: TMessage = {
      messageId: userMessageId,
      conversationId: submission.conversationId || generateId(),
      parentMessageId: submission.parentMessageId,
      role: 'user',
      content: submission.message.trim(),
      createdAt: timestamp,
      updatedAt: timestamp
    }

    // Create or update conversation
    let targetConversation: TConversation

    if (!currentConversation || !submission.conversationId) {
      // Create new conversation
      targetConversation = {
        conversationId: userMessage.conversationId,
        title: generateTitle(submission.message),
        messages: [userMessage],
        createdAt: timestamp,
        updatedAt: timestamp,
        model: 'shopmind-ai',
        endpoint: 'shopmind'
      }
      
      setConversations(prev => [targetConversation, ...prev])
      setCurrentConversation(targetConversation)
    } else {
      // Add to existing conversation
      targetConversation = {
        ...currentConversation,
        messages: [...currentConversation.messages, userMessage],
        updatedAt: timestamp
      }
      
      setConversations(prev => prev.map(conv => 
        conv.conversationId === targetConversation.conversationId 
          ? targetConversation 
          : conv
      ))
      setCurrentConversation(targetConversation)
    }

    // Generate AI response
    const aiContent = generateAIResponse(submission.message)
    
    const assistantMessage: TMessage = {
      messageId: assistantMessageId,
      conversationId: targetConversation.conversationId,
      parentMessageId: userMessageId,
      role: 'assistant',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      unfinished: true
    }

    // Add assistant message to conversation
    const updatedConversation = {
      ...targetConversation,
      messages: [...targetConversation.messages, assistantMessage]
    }

    setConversations(prev => prev.map(conv => 
      conv.conversationId === updatedConversation.conversationId 
        ? updatedConversation 
        : conv
    ))
    setCurrentConversation(updatedConversation)

    // Start streaming
    await simulateStreaming(assistantMessageId, aiContent, updatedConversation.conversationId)
    
    setSubmitting(false)
  }, [submitting, currentConversation, generateAIResponse, simulateStreaming])

  const newConversation = useCallback(() => {
    setCurrentConversation(null)
  }, [])

  const selectConversation = useCallback((conversation: TConversation) => {
    setCurrentConversation(conversation)
  }, [])

  return {
    conversations,
    currentConversation,
    submitting,
    handleSubmit,
    newConversation,
    selectConversation
  }
}