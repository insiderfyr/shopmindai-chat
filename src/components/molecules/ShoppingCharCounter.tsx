import React from 'react'
import { SHOPMIND_CONFIG } from '../../config/shopMindConfig'

interface ShoppingCharCounterProps {
  count: number
  isNearLimit: boolean
  isAtLimit: boolean
  show: boolean
}

export const ShoppingCharCounter = React.memo(({ 
  count, 
  isNearLimit,
  isAtLimit,
  show 
}: ShoppingCharCounterProps) => {
  if (!show) return null

  const maxLength = SHOPMIND_CONFIG.MAX_MESSAGE_LENGTH
  const percentage = (count / maxLength) * 100

  return (
    // POZIȚIONARE CORECTATĂ - between send button și model selectors
    <div className="absolute bottom-8 right-4 flex items-center gap-2 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm border border-gray-100">
      <div className={`text-xs font-medium ${
        isAtLimit ? 'text-red-600' : 
        isNearLimit ? 'text-yellow-600' : 
        'text-gray-500'
      }`}>
        {count.toLocaleString()}/{maxLength.toLocaleString()}
      </div>
      
      <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-200 ${
            isAtLimit ? 'bg-red-500' :
            isNearLimit ? 'bg-yellow-500' :
            'bg-blue-500'
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  )
})

ShoppingCharCounter.displayName = 'ShoppingCharCounter'