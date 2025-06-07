// ========== src/hooks/useTextarea.ts ==========

import { useState, useRef, useEffect, useCallback } from 'react'

export const useTextarea = () => {
  const [text, setText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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

  return {
    text,
    setText,
    textareaRef,
    adjustTextareaHeight
  }
}