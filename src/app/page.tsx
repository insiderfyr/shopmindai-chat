"use client"

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { 
  Send, 
  Plus, 
  RotateCcw, 
  User2, 
  Folder, 
  Mic, 
  MessageSquare, 
  Settings, 
  HelpCircle, 
  PanelLeftClose, 
  PanelLeft,
  Edit3,
  Trash2,
  MoreHorizontal,
  Search,
  ArrowUp,
  Tag,
  Star,
  ArrowLeft
} from 'lucide-react'

// Custom scrollbar styles
const scrollbarStyles = `
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(107, 114, 128, 0.3) transparent;
  }
  
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 3px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(107, 114, 128, 0.3);
    border-radius: 3px;
    transition: background-color 0.2s ease;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: rgba(107, 114, 128, 0.5);
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:active {
    background-color: rgba(107, 114, 128, 0.7);
  }
  
  .custom-scrollbar::-webkit-scrollbar-corner {
    background: transparent;
  }
`

// Types following LibreChat conventions
interface TMessage {
  messageId: string
  conversationId: string
  parentMessageId?: string
  role: 'user' | 'assistant'
  content: string
  model?: string
  createdAt: Date
  updatedAt: Date
  isEdited?: boolean
  error?: boolean
  unfinished?: boolean
}

interface TConversation {
  conversationId: string
  title: string
  messages: TMessage[]
  createdAt: Date
  updatedAt: Date
  model?: string
  endpoint?: string
}

interface TSubmission {
  message: string
  conversationId?: string
  parentMessageId?: string
}

// ShopMindAI Logo Component
const ShopMindLogo = ({ size = 32 }: { size?: number }) => (
  <svg 
    version="1.1" 
    viewBox="0 0 1080 1232" 
    width={size} 
    height={size * 1.14} 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      transform="translate(724,310)" 
      d="m0 0h7l7 3 5 5 2 4v7l-4 8-9 11-10 17-7 16-2 9v25l2 12 109 1 12 2 8 3 9 7 7 8 7 14 1 5v281l-2 12-7 23-8 16-7 11-13 15-60 60h-2l-2 4h-2l-2 4-4 4h-2l-2 4-4 4h-2l-2 4h-2l-2 4h-2l-2 4h-2v2h-2v2h-2v2l-8 7-227 227-10 7-11 4-14 1-14-3-10-6-13-12-290-290-6-10-4-11v-16l5-14 7-9 6-7h2l2-4 12-12h2l2-4h2l2-4h2l2-4h2l2-4h2v-2l8-7 103-103h2l1-3 8-7 110-110 6-5 5-6 8-7 78-78 13-10 14-8 13-6 18-5 12-2 131-1-2-18v-15l2-14 7-20 11-21 7-11 11-14zm-175 151-16 4-16 7-11 8-10 9-47 47-6 5-5 5-4 5-8 7-81 81-2 1v2h-2v2h-2v2l-4 2-80 80-6 5v2l-4 2-108 108-3 8 2 5 9 10 290 290 4 2h8l9-7 360-360 7-11 7-14 4-14 1-6v-278l-4-6-4-3h-90l7 11 8 16 5 16 2 10v18l3 5 9 11 7 15 4 15 1 6v15l-6 22-8 14-9 10-9 8-12 7-18 6-5 1h-22l-15-4-16-8-10-8-8-8-8-13-5-11-3-11v-26l4-16 8-15 9-11 9-8 13-8 15-5 8-2h21l7 2h4l-3-10-8-16-10-16-8-11-2-1zm148 84-11 4-9 6-7 7-6 10-3 9v18l5 13 8 11 8 6 11 5 4 1h18l13-5 9-7 8-10 5-13 1-4v-14l-4-11-4 1-7 10-9 11-7 7-9 5-5 1-10-4-3-3-2-6 1-9 6-8 10-10 10-14 1-5-4-2z" 
      fill="#3A7BF5"
    />
    <path 
      transform="translate(403,743)" 
      d="m0 0h10l8 6 7 6 6 7 6 5 112 112 5 8v8l-4 7-6 5-3 1h-7l-6-3-12-11-122-122-6-9v-7l5-8 5-4z" 
      fill="#3A7BF5"
    />
    <path 
      transform="translate(330,815)" 
      d="m0 0h13l6 4 87 87 2 1v2h2v2l4 2v2l4 2v2l4 2v2l4 2 20 20 8 10 1 3v10l-4 6-4 3-4 2h-8l-9-6-132-132-4-7v-7l4-8z" 
      fill="#3A7BF5"
    />
  </svg>
)

export default function ChatPage() {
  // State management following LibreChat patterns - EMPTY conversations initially
  const [isNavOpen, setIsNavOpen] = useState(false)
  const [conversations, setConversations] = useState<TConversation[]>([])
  
  const [currentConversation, setCurrentConversation] = useState<TConversation | null>(null)
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [discountsActive, setDiscountsActive] = useState(false)
  const [dealsActive, setDealsActive] = useState(false)

  // Refs
  const textareaRef = useRef<HTMLTextAreaElement>(null)
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

  const generateId = () => `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  const generateTitle = (message: string) => {
    const maxLength = 50
    return message.length > maxLength ? message.slice(0, maxLength) + '...' : message
  }

  // Auto-resize textarea following LibreChat pattern
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      const maxHeight = 200
      const newHeight = Math.min(textarea.scrollHeight, maxHeight)
      textarea.style.height = `${newHeight}px`
    }
  }, [])

  useEffect(() => {
    adjustTextareaHeight()
  }, [text, adjustTextareaHeight])

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
    setText('')
  }, [submitting, currentConversation, generateAIResponse, simulateStreaming])

  // Event handlers
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit({ 
        message: text,
        conversationId: currentConversation?.conversationId,
        parentMessageId: currentConversation?.messages[currentConversation.messages.length - 1]?.messageId
      })
    }
  }, [text, currentConversation, handleSubmit])

  const handleSendClick = useCallback(() => {
    handleSubmit({ 
      message: text,
      conversationId: currentConversation?.conversationId,
      parentMessageId: currentConversation?.messages[currentConversation.messages.length - 1]?.messageId
    })
  }, [text, currentConversation, handleSubmit])

  const newConversation = useCallback(() => {
    setCurrentConversation(null)
    setText('')
  }, [])

  const selectConversation = useCallback((conversation: TConversation) => {
    setCurrentConversation(conversation)
  }, [])

  // Action button handlers
  const handleActionButton = useCallback((action: string) => {
    const prompts = {
      'Smart Search': 'Help me find the best deals on popular products',
      'Compare Products': 'I want to compare similar products and find the best option',
      'Find Deals': 'Show me the best deals and discounts available today',
      'Product Reviews': 'I need help reading and understanding product reviews'
    }
    
    setText(prompts[action as keyof typeof prompts] || action)
  }, [])

  // Date grouping utility
  const groupConversationsByDate = useCallback((conversations: TConversation[]) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

    return {
      today: conversations.filter(c => c.updatedAt >= today),
      yesterday: conversations.filter(c => c.updatedAt >= yesterday && c.updatedAt < today),
      previousWeek: conversations.filter(c => c.updatedAt >= sevenDaysAgo && c.updatedAt < yesterday),
      older: conversations.filter(c => c.updatedAt < sevenDaysAgo)
    }
  }, [])

  if (!mounted) return null

  const groupedConversations = groupConversationsByDate(conversations)
  const hasMessages = (currentConversation?.messages?.length ?? 0) > 0

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: scrollbarStyles }} />
      <div className="flex h-screen bg-white">
        {/* Navigation Sidebar */}
        <div className={`${isNavOpen ? 'w-64' : 'w-16'} transition-all duration-200 bg-[#d8e8ff] text-white flex flex-col`}>
          {isNavOpen ? (
            // Full Navigation
            <>
              {/* Header */}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <ShopMindLogo size={28} />
                  <span className="text-lg font-semibold text-black font-sans">ShopMindAI</span>
                </div>
                <button 
                  onClick={() => setIsNavOpen(false)}
                  className="p-1.5 rounded-lg"
                >
                  <ArrowLeft className="w-6 h-6 text-[#4d8eff]" />
                </button>
              </div>

              {/* New Chat Button */}
              <div className="p-4">
                <button
                  onClick={newConversation}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-[#4d8eff] rounded-full text-white text-sm font-medium shadow-md transition-all duration-300 transform focus:outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus-icon lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                  <span>New chat</span>
                </button>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
                {Object.entries(groupedConversations).map(([period, convos]) => {
                  if (convos.length === 0) return null
                  
                  const labels: Record<string, string> = {
                    today: 'Today',
                    yesterday: 'Yesterday',
                    previousWeek: 'Previous 7 days',
                    older: 'Older'
                  }

                  return (
                    <div key={period} className="mb-6">
                      <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3 px-2">
                        {labels[period]}
                      </h3>
                      <div className="space-y-1">
                        {convos.map((conversation) => (
                          <button
                            key={conversation.conversationId}
                            onClick={() => selectConversation(conversation)}
                            className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors text-sm group relative ${
                              currentConversation?.conversationId === conversation.conversationId 
                                ? 'bg-gray-700 text-white' 
                                : 'text-gray-300 hover:bg-gray-800'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <MessageSquare className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate flex-1">{conversation.title}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                })}

                {conversations.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 text-sm">
                    No conversations yet
                  </div>
                )}
              </div>

              {/* Bottom Section */}
              <div className="p-4 space-y-2">
                {/* User Profile */}
                <div className="flex items-center gap-3 px-3 py-2 hover:bg-gray-200 rounded-2xl transition-all duration-200 cursor-pointer">
                  <div className="w-8 h-8 bg-[#4d8eff] rounded-full flex items-center justify-center">
                    <User2 className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-black">My Profile</span>
                </div>
              </div>
            </>
          ) : (
            // Collapsed Navigation - ShopMindAI Navigation cu structura nouă
            <div className="flex flex-col h-full justify-between p-3">
              {/* Top section */}
              <div className="space-y-3">
                {/* Logo ShopMindAI - Navighează la homepage */}
                <button 
                  onClick={() => setIsNavOpen(true)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl transition-colors"
                  title="Homepage"
                >
                  <ShopMindLogo size={32} />
                </button>
                
                {/* Toggle Sidebar - Deschide/Închide */}
                <button 
                  onClick={() => setIsNavOpen(!isNavOpen)}
                  className="w-10 h-10 hover:bg-gray-100 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200 text-black"
                  title="Deschide/Închide Sidebar"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right-icon lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </button>
                
                {/* Coș de Cumpărături - Card simplu */}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-all duration-200 hover:scale-105 cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shopping-cart-icon lucide-shopping-cart">
                    <circle cx="8" cy="21" r="1"/>
                    <circle cx="19" cy="21" r="1"/>
                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
                  </svg>
                </div>
                
                {/* Căutare Nouă */}
                <button 
                  onClick={newConversation}
                  className="w-10 h-10 hover:bg-gray-100 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200 text-black"
                  title="Căutare Nouă"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus-icon lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                </button>
              </div>
              
              {/* Bottom section - Contul Meu */}
              <button 
                className="w-10 h-10 bg-gradient-to-br from-[#4d8eff] to-[#3a6cd9] rounded-full flex items-center justify-center text-black transition-all duration-200 shadow-md hover:shadow-lg relative"
                title="Contul Meu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-round-icon lucide-user-round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>
              </button>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-[#f0f6ff]">
          {!hasMessages ? (
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
                  <button
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 border border-gray-200 rounded-xl text-xs transition-colors duration-200 ${discountsActive ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                    onClick={() => setDiscountsActive((prev) => !prev)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search-check-icon lucide-search-check"><path d="m8 11 2 2 4-4"/><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    Discounts Finder
                  </button>
                  <button
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 border border-gray-200 rounded-xl text-xs transition-colors duration-200 ${dealsActive ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                    onClick={() => setDealsActive((prev) => !prev)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-hourglass-icon lucide-hourglass"><path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"/><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/></svg>
                    Daily Deals
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center gap-3 mb-8 max-w-2xl mx-auto">
                <button 
                  onClick={() => handleActionButton('Smart Search')}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-[#4d8eff] hover:text-[#4d8eff] transition-colors duration-200 shadow-sm"
                >
                  <Search className="w-4 h-4" />
                  Smart Search
                </button>
                <button 
                  onClick={() => handleActionButton('Compare Products')}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-[#4d8eff] hover:text-[#4d8eff] transition-colors duration-200 shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shopping-bag-icon lucide-shopping-bag"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                  Compare Products
                </button>
                <button 
                  onClick={() => handleActionButton('Find Deals')}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-[#4d8eff] hover:text-[#4d8eff] transition-colors duration-200 shadow-sm"
                >
                  <Tag className="w-4 h-4" />
                  Find Deals
                </button>
                <button 
                  onClick={() => handleActionButton('Product Reviews')}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-[#4d8eff] hover:text-[#4d8eff] transition-colors duration-200 shadow-sm"
                >
                  <Star className="w-4 h-4" />
                  Product Reviews
                </button>
              </div>
            </div>
          ) : (
            // Chat View
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="max-w-4xl mx-auto px-6 py-6">
                  <div className="space-y-6">
                    {currentConversation?.messages.map((message) => (
                      <div key={message.messageId} className="flex gap-4">
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
                            {message.unfinished && (
                              <span className="inline-block w-2 h-4 bg-gray-400 ml-1 animate-pulse"></span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
              </div>

              {/* Input Section */}
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
                      <button
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 border border-gray-200 rounded-xl text-xs transition-colors duration-200 ${discountsActive ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                        onClick={() => setDiscountsActive((prev) => !prev)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search-check-icon lucide-search-check"><path d="m8 11 2 2 4-4"/><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                        Discounts Finder
                      </button>
                      <button
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 border border-gray-200 rounded-xl text-xs transition-colors duration-200 ${dealsActive ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                        onClick={() => setDealsActive((prev) => !prev)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-hourglass-icon lucide-hourglass"><path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"/><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/></svg>
                        Daily Deals
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}