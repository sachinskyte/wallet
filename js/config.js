/**
 * Configuration file for MovieGo website
 * Contains API keys and other environment variables
 */

// TMDB API Configuration
const CONFIG = {
    // TMDB API - Replace with your own API credentials from https://www.themoviedb.org/settings/api
    TMDB_API_KEY: 'YOUR_API_KEY_HERE',
    TMDB_ACCESS_TOKEN: 'YOUR_ACCESS_TOKEN_HERE',
    TMDB_BASE_URL: 'https://api.themoviedb.org/3',
    TMDB_IMG_BASE_URL: 'https://image.tmdb.org/t/p/w500',
    
    // Default region for API requests
    DEFAULT_REGION: 'IN',
    
    // Other configuration settings
    DEFAULT_LANGUAGE: 'all',
    DEFAULT_SORT: 'popularity.desc',
    DEFAULT_PAGE: 1,
    
    // Language mapping
    LANGUAGE_NAMES: {
        'hi': 'Hindi',
        'ta': 'Tamil',
        'te': 'Telugu',
        'ml': 'Malayalam',
        'kn': 'Kannada',
        'bn': 'Bengali',
        'mr': 'Marathi',
        'pa': 'Punjabi',
        'gu': 'Gujarati',
        'or': 'Odia',
        'as': 'Assamese',
        'en': 'English'
    }
}; 