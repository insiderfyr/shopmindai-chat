export interface TextareaState {
    text: string
    charCount: number
    isNearLimit: boolean
    isAtLimit: boolean
    error: string | null
    suggestions: string[]
  }
  
  export interface CooldownState {
    isActive: boolean
    remainingTime: number
    message?: string
  }