// ========== src/hooks/useConversations.ts ==========

import { useCallback } from 'react'
import { TConversation } from '../types/chat'

export const useConversations = () => {
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

  return {
    groupConversationsByDate
  }
}