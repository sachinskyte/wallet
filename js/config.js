/**
 * Configuration file for MovieGo website
 * Contains API keys and other environment variables
 */

// TMDB API Configuration
const CONFIG = {
    // TMDB API
    TMDB_API_KEY: '199daf17ee606d3dcf427b11edc0160f',
    TMDB_ACCESS_TOKEN: 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxOTlkYWYxN2VlNjA2ZDNkY2Y0MjdiMTFlZGMwMTYwZiIsIm5iZiI6MTc0NDA0OTc3My4zMDA5OTk5LCJzdWIiOiI2N2Y0MTY2ZDFiYjA0NzI4OTk5OTczY2MiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.1aCfishepajtvmfYIheQsz7tMTi8VYwT1d7l5hU13Tk',
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