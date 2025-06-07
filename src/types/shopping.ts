export interface ShoppingQuery {
    text: string
    category?: string
    priceRange?: {
      min: number
      max: number
    }
    filters?: string[]
  }
  
  export interface ValidationResult {
    isValid: boolean
    error?: string
    suggestions?: string[]
    charCount?: number
  }
  
  export interface ModelState {
    discountsActive: boolean
    dealsActive: boolean
    lastToggleTime: number
  }