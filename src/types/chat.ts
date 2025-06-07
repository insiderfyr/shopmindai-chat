// ========== src/types/chat.ts ==========

export interface TMessage {
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
  
  export interface TConversation {
    conversationId: string
    title: string
    messages: TMessage[]
    createdAt: Date
    updatedAt: Date
    model?: string
    endpoint?: string
  }
  
  export interface TSubmission {
    message: string
    conversationId?: string
    parentMessageId?: string
  }