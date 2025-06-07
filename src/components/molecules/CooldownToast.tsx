import React from 'react'

interface CooldownToastProps {
  message: string | null
}

export const CooldownToast = React.memo(({ message }: CooldownToastProps) => {
  if (!message) return null

  return (
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-yellow-100 border border-yellow-400 text-yellow-700 px-3 py-1 rounded-md text-xs whitespace-nowrap z-20">
      ⏱️ {message}
    </div>
  )
})

CooldownToast.displayName = 'CooldownToast'