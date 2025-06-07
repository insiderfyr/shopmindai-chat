import { SHOPMIND_CONFIG } from '../config/shopMindConfig'
import { ValidationResult } from '../types/shopping'

export class ShoppingValidators {
  static validateShoppingQuery(query: string): ValidationResult {
    // Verifică lungimea
    if (query.trim().length < SHOPMIND_CONFIG.MIN_SEARCH_LENGTH) {
      return { 
        isValid: false, 
        error: 'Search query too short. Please be more specific.',
        suggestions: [
          'Try: "iPhone 15 Pro"', 
          'Try: "wireless headphones"', 
          'Try: "gaming laptop under $1000"'
        ]
      }
    }
    
    if (query.length > SHOPMIND_CONFIG.MAX_MESSAGE_LENGTH) {
      return { 
        isValid: false, 
        error: `Message too long. Maximum ${SHOPMIND_CONFIG.MAX_MESSAGE_LENGTH} characters.`,
        charCount: query.length
      }
    }
    
    // Verifică categorii blocate
    const blockedTerms = this.checkBlockedContent(query)
    if (blockedTerms.length > 0) {
      return { 
        isValid: false, 
        error: 'This search contains restricted content.' 
      }
    }
    
    // Verifică dacă e spam
    if (this.isSpamQuery(query)) {
      return { 
        isValid: false, 
        error: 'Please avoid repetitive or spam-like searches.',
        suggestions: ['Try a more natural search query']
      }
    }
    
    return { isValid: true, charCount: query.length }
  }

  static validateModelToggle(lastToggleTime: number): { allowed: boolean; waitTime?: number } {
    const now = Date.now()
    const timeSinceLastToggle = now - lastToggleTime
    
    if (timeSinceLastToggle < SHOPMIND_CONFIG.MODEL_COOLDOWN_MS) {
      const waitTime = Math.ceil((SHOPMIND_CONFIG.MODEL_COOLDOWN_MS - timeSinceLastToggle) / 1000)
      return { allowed: false, waitTime }
    }
    
    return { allowed: true }
  }

  private static checkBlockedContent(query: string): string[] {
    const blocked = SHOPMIND_CONFIG.BLOCKED_CATEGORIES
    const foundBlocked: string[] = []
    
    const lowerQuery = query.toLowerCase()
    blocked.forEach(category => {
      if (lowerQuery.includes(category)) {
        foundBlocked.push(category)
      }
    })
    
    return foundBlocked
  }

  private static isSpamQuery(query: string): boolean {
    // Verifică pattern-uri de spam
    const spamPatterns = [
      new RegExp(`(.)\\1{${SHOPMIND_CONFIG.MAX_REPEATED_CHARACTERS},}`), // Same character repeated 5+ times
      /^[!@#$%^&*()]+$/, // Only special characters
      /(.{1,10})\1{3,}/, // Short phrases repeated 3+ times
    ]
    
    return spamPatterns.some(pattern => pattern.test(query))
  }
}
