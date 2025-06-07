// ========== src/components/molecules/NavigationButton.tsx ==========

import React from 'react'

interface NavigationButtonProps {
  icon: React.ReactNode
  title?: string
  onClick?: () => void
  className?: string
}

export const NavigationButton = React.memo(({
  icon,
  title,
  onClick,
  className = ''
}: NavigationButtonProps) => {
  return (
    <button 
      onClick={onClick}
      className={`w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200 text-black ${className}`}
      title={title}
    >
      {icon}
    </button>
  )
})

NavigationButton.displayName = 'NavigationButton'