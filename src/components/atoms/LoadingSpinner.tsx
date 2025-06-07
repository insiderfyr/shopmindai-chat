// ========== src/components/atoms/LoadingSpinner.tsx (CORECTAT) ==========

import React from 'react'

export const LoadingSpinner = React.memo(() => (
  <span className="inline-block w-2 h-4 bg-gray-400 ml-1 animate-pulse"></span>
))

LoadingSpinner.displayName = 'LoadingSpinner'

// SAU varianta alternativă (dacă prima nu merge):
/*
import React from 'react'

const LoadingSpinner = React.memo(() => (
  <span className="inline-block w-2 h-4 bg-gray-400 ml-1 animate-pulse"></span>
))

LoadingSpinner.displayName = 'LoadingSpinner'

export { LoadingSpinner }
*/