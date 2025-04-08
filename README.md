# MovieGo

MovieGo is a modern movie ticket booking website that allows users to browse movies, find theaters, and book tickets online. The website features a responsive design, interactive UI elements, and a seamless user experience.

## Features

- **Movie Listings**: Browse current and upcoming movies with detailed information
- **Theater Locator**: Find theaters near you with amenities and showtimes
- **User Authentication**: Sign up and sign in functionality
- **Search Functionality**: Search for movies and theaters
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **TMDB Integration**: Fetches latest movie data from The Movie Database API

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Font Awesome for icons
- TMDB API for movie data

## Project Structure

- `index.html` - Home page with latest movies from TMDB
- `movies.html` - Movies listing page
- `theaters.html` - Theaters listing page with 19 theaters in Bangalore
- `signin.html` - Sign in page
- `signup.html` - Sign up page
- `css/` - Stylesheets for different pages
  - `home.css` - Styles for the home page
  - `theaters.css` - Styles for the theaters page
  - `style.css` - Main stylesheet
- `js/` - JavaScript functionality
  - `home.js` - Home page functionality with TMDB integration
  - `theaters.js` - Theaters page functionality
  - `config.js` - Configuration file for API keys
- `images/` - Image assets

## TMDB API Integration

This project uses The Movie Database (TMDB) API to fetch movie data. To use this feature:

1. Get an API key from [TMDB](https://www.themoviedb.org/documentation/api)
2. Open `js/config.js` and replace the placeholder values with your API credentials:
   ```javascript
   const API_KEY = 'YOUR_API_KEY_HERE';
   const ACCESS_TOKEN = 'YOUR_ACCESS_TOKEN_HERE';
   ```

## Getting Started

1. Clone the repository
2. Set up your TMDB API credentials in `js/config.js`
3. Open `index.html` in your browser
4. Explore the website

## License

© 2025 MovieGo. All rights reserved.  
