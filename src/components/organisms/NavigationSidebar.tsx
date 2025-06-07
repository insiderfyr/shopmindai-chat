// ========== src/components/organisms/NavigationSidebar.tsx ==========

import React from 'react'
import { ArrowLeft, User2 } from 'lucide-react'
import { ShopMindLogo } from '../atoms/ShopMindLogo'
import { ConversationItem } from '../molecules/ConversationItem'
import { NavigationButton } from '../molecules/NavigationButton'
import { TConversation } from '../../types/chat'

interface NavigationSidebarProps {
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
}

export const NavigationSidebar = React.memo(({
  isNavOpen,
  setIsNavOpen,
  conversations,
  currentConversation,
  newConversation,
  selectConversation,
  groupConversationsByDate
}: NavigationSidebarProps) => {
  const groupedConversations = groupConversationsByDate(conversations)

  if (!isNavOpen) {
    return (
      <div className="w-16 transition-all duration-200 bg-[#d8e8ff] text-white flex flex-col">
        <div className="flex flex-col h-full justify-between p-3">
          {/* Top section */}
          <div className="space-y-3">
            {/* Logo ShopMindAI - Navighează la homepage */}
            <NavigationButton 
              icon={<ShopMindLogo size={32} />}
              onClick={() => setIsNavOpen(true)}
              title="Homepage"
            />
            
            {/* Toggle Sidebar - Deschide/Închide */}
            <NavigationButton 
              icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right-icon lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>}
              onClick={() => setIsNavOpen(!isNavOpen)}
              title="Deschide/Închide Sidebar"
            />
            
            {/* Coș de Cumpărături - Card simplu */}
            <div className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-all duration-200 hover:scale-105 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shopping-cart-icon lucide-shopping-cart">
                <circle cx="8" cy="21" r="1"/>
                <circle cx="19" cy="21" r="1"/>
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
              </svg>
            </div>
            
            {/* Căutare Nouă */}
            <NavigationButton 
              icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus-icon lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>}
              onClick={newConversation}
              title="Căutare Nouă"
            />
          </div>
          
          {/* Bottom section - Contul Meu */}
          <button 
            className="w-10 h-10 bg-gradient-to-br from-[#4d8eff] to-[#3a6cd9] rounded-full flex items-center justify-center text-black transition-all duration-200 shadow-md hover:shadow-lg relative"
            title="Contul Meu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-round-icon lucide-user-round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-64 transition-all duration-200 bg-[#d8e8ff] text-white flex flex-col">
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
                  <ConversationItem
                    key={conversation.conversationId}
                    conversation={conversation}
                    isActive={currentConversation?.conversationId === conversation.conversationId}
                    onClick={selectConversation}
                  />
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
    </div>
  )
})

NavigationSidebar.displayName = 'NavigationSidebar'