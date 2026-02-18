// ========================================
// STATE.JS - Game State Management
// ========================================

// GAME STATE
let state = {
    language: localStorage.getItem('ul_lang') || 'uz',
    username: localStorage.getItem('ul_user') || '',
    coins: parseInt(localStorage.getItem('ul_coins')) || 0,
    unlocked: parseInt(localStorage.getItem('ul_lvl')) || 1,
    lives: parseInt(localStorage.getItem('ul_lives')) || 5, // Changed default lives to 5
    hasTelescope: localStorage.getItem('ul_telescope') === 'true',
    titles: JSON.parse(localStorage.getItem('ul_titles') || '[]'),
    currentLevelIndex: 0,
    rated: localStorage.getItem('ul_rated') === 'true'
};