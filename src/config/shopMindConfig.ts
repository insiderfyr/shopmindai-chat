export const SHOPMIND_CONFIG = {
    // Limite pentru textarea
    MAX_MESSAGE_LENGTH: 4000,
    MIN_TEXTAREA_HEIGHT: 120,
    MAX_TEXTAREA_HEIGHT: 300,
    
    // PADDING MĂRIT pentru butoane - ACTUALIZAT
    BOTTOM_BUTTONS_HEIGHT: 60, // Înălțimea zonei cu butoane
    TEXTAREA_BOTTOM_PADDING: 80, // Padding MĂRIT pentru siguranță
    
    // Shopping specific limits
    MIN_SEARCH_LENGTH: 2,
    MAX_SEARCH_LENGTH: 200,
    
    // UI Behavior
    AUTO_EXPAND_TEXTAREA: true,
    SHOW_CHAR_COUNT_AT: 0.8,
    
    // Validation
    MAX_REPEATED_CHARACTERS: 5,
    BLOCKED_CATEGORIES: ['adult', 'weapons', 'illegal'],
    
    // Model selectors cooldown
    MODEL_COOLDOWN_MS: 1000,
  }
  