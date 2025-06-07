import { useState, useRef, useEffect, useCallback } from 'react'
import { SHOPMIND_CONFIG } from '../config/shopMindConfig'
import { ShoppingValidators } from '../utils/shoppingValidators'
import { TextareaState } from '../types/validation'

export const useShoppingTextarea = () => {
  const [state, setState] = useState<TextareaState>({
    text: '',
    charCount: 0,
    isNearLimit: false,
    isAtLimit: false,
    error: null,
    suggestions: []
  })
  
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize cu limitare STRICTĂ pentru butoane
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current
    if (textarea && SHOPMIND_CONFIG.AUTO_EXPAND_TEXTAREA) {
      textarea.style.height = 'auto'
      
      // LIMITARE STRICTĂ - nu permite expandare peste zona butoanelor
      const scrollHeight = textarea.scrollHeight
      const minHeight = SHOPMIND_CONFIG.MIN_TEXTAREA_HEIGHT
      const maxHeight = Math.min(
        SHOPMIND_CONFIG.MAX_TEXTAREA_HEIGHT,
        220 // LIMITĂ HARD pentru a nu atinge butoanele
      )
      
      const newHeight = Math.min(
        Math.max(scrollHeight, minHeight),
        maxHeight
      )
      
      textarea.style.height = `${newHeight}px`
      
      // Dacă textul e prea mult și nu mai încape, adaugă scroll
      if (scrollHeight > maxHeight) {
        textarea.style.overflowY = 'auto'
      } else {
        textarea.style.overflowY = 'hidden'
      }
    }
  }, [])

  const updateText = useCallback((newText: string) => {
    if (newText.length > SHOPMIND_CONFIG.MAX_MESSAGE_LENGTH) {
      newText = newText.slice(0, SHOPMIND_CONFIG.MAX_MESSAGE_LENGTH)
    }

    const charCount = newText.length
    const warningThreshold = SHOPMIND_CONFIG.MAX_MESSAGE_LENGTH * SHOPMIND_CONFIG.SHOW_CHAR_COUNT_AT
    const isNearLimit = charCount >= warningThreshold
    const isAtLimit = charCount >= SHOPMIND_CONFIG.MAX_MESSAGE_LENGTH
    
    let error: string | null = null
    let suggestions: string[] = []
    
    if (newText.trim().length > 0) {
      const validation = ShoppingValidators.validateShoppingQuery(newText)
      error = validation.isValid ? null : validation.error!
      suggestions = validation.suggestions || []
    }

    setState({
      text: newText,
      charCount,
      isNearLimit,
      isAtLimit,
      error,
      suggestions
    })
  }, [])

  useEffect(() => {
    adjustTextareaHeight()
    // Re-adjust on window resize
    const handleResize = () => adjustTextareaHeight()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [state.text, adjustTextareaHeight])

  const clearText = useCallback(() => {
    setState({
      text: '',
      charCount: 0,
      isNearLimit: false,
      isAtLimit: false,
      error: null,
      suggestions: []
    })
  }, [])

  return {
    ...state,
    setText: updateText,
    textareaRef,
    clearText,
    maxLength: SHOPMIND_CONFIG.MAX_MESSAGE_LENGTH,
    shouldShowCounter: state.charCount >= SHOPMIND_CONFIG.MAX_MESSAGE_LENGTH * SHOPMIND_CONFIG.SHOW_CHAR_COUNT_AT
  }
}