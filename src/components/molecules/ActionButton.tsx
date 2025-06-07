// ========== src/components/molecules/ActionButton.tsx ==========

import React from 'react'

interface ActionButtonProps {
  icon: React.ReactNode
  label: string
  onClick: () => void
}

export const ActionButton = React.memo(({ 
  icon, 
  label, 
  onClick 
}: ActionButtonProps) => {
  return (
    <button 
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-[#4d8eff] hover:text-[#4d8eff] transition-colors duration-200 shadow-sm"
    >
      {icon}
      {label}
    </button>
  )
})

ActionButton.displayName = 'ActionButton'