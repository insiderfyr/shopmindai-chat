// ========== src/components/molecules/ModelSelector.tsx ==========

import React from 'react'

interface ModelSelectorProps {
  isActive: boolean
  icon: React.ReactNode
  label: string
  onClick: () => void
}

export const ModelSelector = React.memo(({ 
  isActive, 
  icon, 
  label, 
  onClick 
}: ModelSelectorProps) => {
  return (
    <button
      className={`flex items-center gap-1.5 px-2.5 py-1.5 border border-gray-200 rounded-xl text-xs transition-colors duration-200 ${
        isActive 
          ? 'bg-blue-600 text-white' 
          : 'bg-white text-gray-600 hover:bg-gray-100'
      }`}
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  )
})

ModelSelector.displayName = 'ModelSelector'