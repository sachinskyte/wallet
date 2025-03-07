/**
 * Movies functionality for the MovieGo website
 * Fetches and displays movies using TMDB API
 * Compatible with modern browsers and fallback for local development
 */

// Polyfill for older browsers that might not support some ES6 features
if (!Object.entries) {
  Object.entries = function(obj) {
    var ownProps = Object.keys(obj),
        i = ownProps.length,
        resArray = new Array(i);
    while (i--)
      resArray[i] = [ownProps[i], obj[ownProps[i]]];
    return resArray;
  };
}

// Main script
document.addEventListener('DOMContentLoaded', function() {
    // Check if CONFIG is available
    if (typeof CONFIG === 'undefined') {
        console.error('CONFIG is not defined. Make sure config.js is loaded before this script.');
        return;
    }
    
    // Check if running locally (file://) - API calls might be blocked by CORS
    const isLocalFile = window.location.protocol === 'file:';
    
    // DOM Elements
    const moviesGrid = document.getElementById('movies-grid');
    const loadingElement = document.getElementById('loading');
    const errorContainer = document.getElementById('error-container');
    const paginationContainer = document.getElementById('pagination');
    const languageFilter = document.getElementById('language-filter');
    const sortFilter = document.getElementById('sort-filter');
    const searchInput = document.getElementById('movie-search');
    const searchButton = document.getElementById('search-button');
    
    // App State
    let currentPage = CONFIG.DEFAULT_PAGE;
    let totalPages = 0;
    let currentLanguage = CONFIG.DEFAULT_LANGUAGE;
    let currentSort = CONFIG.DEFAULT_SORT;
    let currentSearchQuery = '';
    
    // Add a note for local file users
    if (isLocalFile) {
        const note = document.createElement('div');
        note.style.backgroundColor = "rgba(255, 180, 0, 0.2)";
        note.style.padding = "10px 15px";
        note.style.borderRadius = "5px";
        note.style.marginBottom = "20px";
        note.style.color = "#fff";
        note.style.fontSize = "0.9rem";
        note.innerHTML = `<strong>Note:</strong> You're running this page locally. For security reasons, browsers restrict API calls from local files. 
                          You will see sample data instead of live data from TMDB. For the full experience, please run on a web server.`;
        
        const container = document.querySelector('.movie-grid-container');
        container.insertBefore(note, loadingElement);
    }
    
    // Initialize the page
    init();
    
    // Initialize the page
    function init() {
        console.log('Initializing Movies page...');
        // Set up event listeners
        languageFilter.addEventListener('change', handleLanguageChange);
        sortFilter.addEventListener('change', handleSortChange);
        searchButton.addEventListener('click', handleSearch);
        searchInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                handleSearch();
            }
        });
        
        // Load data - either from API or sample data
        if (isLocalFile) {
            console.log('Running locally, loading sample data...');
            loadSampleMovies();
        } else {
            // Load initial movies from API
            fetchMovies();
        }
    }
    
    // Handle language filter change
    function handleLanguageChange() {
        currentLanguage = languageFilter.value;
        currentPage = 1;
        fetchMovies();
    }
    
    // Handle sort filter change
    function handleSortChange() {
        currentSort = sortFilter.value;
        currentPage = 1;
        fetchMovies();
    }
    
    // Handle search
    function handleSearch() {
        currentSearchQuery = searchInput.value.trim();
        currentPage = 1;
        fetchMovies();
    }
    
    // Fetch movies from TMDB API
    function fetchMovies() {
        console.log('Fetching movies...');
        // Show loading state
        loadingElement.style.display = 'block';
        moviesGrid.innerHTML = '';
        errorContainer.innerHTML = '';
        paginationContainer.innerHTML = '';
        
        // Define the endpoint based on whether we're searching or browsing
        let endpoint = currentSearchQuery 
            ? `${CONFIG.TMDB_BASE_URL}/search/movie` 
            : `${CONFIG.TMDB_BASE_URL}/discover/movie`;
        
        // Build query parameters
        let params = new URLSearchParams({
            api_key: CONFIG.TMDB_API_KEY,
            page: currentPage,
            sort_by: currentSort,
        });
        
        // Add region filter
        if (currentLanguage === 'all') {
            // When "All Languages" is selected, include all movies but bias toward Indian
            params.append('region', CONFIG.DEFAULT_REGION);
        } else {
            // For specific language, filter by that language
            params.append('with_original_language', currentLanguage);
        }
        
        // Add search query if present
        if (currentSearchQuery) {
            params.append('query', currentSearchQuery);
        } else {
            // If not searching, include these additional filters
            const today = new Date().toISOString().split('T')[0];
            const sixMonthsAgo = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            params.append('primary_release_date.gte', sixMonthsAgo);
            params.append('primary_release_date.lte', today);
        }
        
        // Construct the final URL
        const apiUrl = `${endpoint}?${params.toString()}`;
        console.log('API URL:', apiUrl);
        
        // Fetch data from TMDB API
        fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${CONFIG.TMDB_ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            mode: 'cors'
        })
        .then(response => {
            if (!response.ok) {
                console.error('Response not OK:', response.status, response.statusText);
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('API response:', data);
            // Hide loading state
            loadingElement.style.display = 'none';
            
            // Update total pages
            totalPages = Math.min(data.total_pages || 0, 500); // TMDB limits to 500 pages
            
            if (!data.results || data.results.length === 0) {
                // Show no results message
                showError('No Movies Found', 'No movies match your search criteria. Please try different filters.');
                return;
            }
            
            // Display movies
            displayMovies(data.results);
            
            // Update pagination
            createPagination();
        })
        .catch(error => {
            console.error('Error fetching movies:', error);
            loadingElement.style.display = 'none';
            
            // Try loading sample data as a fallback
            loadSampleMovies();
        });
    }
    
    // Fallback: Load sample movies when API fails
    function loadSampleMovies() {
        console.log('Loading sample movies as fallback...');
        const sampleMovies = [
            // Indian movies
            {
                id: 1170809,
                title: "Shaitaan",
                poster_path: "/rMqBHwasoe5T1YiQoIFCufIVn8V.jpg",
                release_date: "2024-03-08",
                vote_average: 6.2,
                original_language: "hi",
                overview: "A family's pleasant weekend takes a terrifying turn when a mysterious man casts a chilling spell on them, leading to dire consequences."
            },
            {
                id: 1243440,
                title: "Laapataa Ladies",
                poster_path: "/tgRRKboGh5TB5fE9k6wxvBAEkrX.jpg",
                release_date: "2024-03-01",
                vote_average: 7.6,
                original_language: "hi",
                overview: "Two brides get lost on a train journey in rural India, leading to an unexpected series of events that challenges tradition and redefines empowerment."
            },
            {
                id: 1143190,
                title: "Bade Miyan Chote Miyan",
                poster_path: "/lnMGVK8Y5F2biZZ1nGFYinlXcZK.jpg",
                release_date: "2024-04-10",
                vote_average: 5.0,
                original_language: "hi",
                overview: "Two elite soldiers must put aside their rivalry to thwart a terrorist plot against India before time runs out."
            },
            // English and International movies
            {
                id: 458156,
                title: "John Wick: Chapter 3 - Parabellum",
                poster_path: "/ziEuG1essDuWuC5lpWUaw1uXY2O.jpg",
                release_date: "2019-05-15",
                vote_average: 7.4,
                original_language: "en",
                overview: "Super-assassin John Wick returns with a $14 million price tag on his head and an army of bounty-hunting killers on his trail."
            },
            {
                id: 872585,
                title: "Oppenheimer",
                poster_path: "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
                release_date: "2023-07-19",
                vote_average: 8.1,
                original_language: "en",
                overview: "The story of American scientist, J. Robert Oppenheimer, and his role in the development of the atomic bomb."
            },
            {
                id: 1111152,
                title: "Kalki 2898 AD",
                poster_path: "/8mZXYkZkH3pamfU1kgdJGeVp50G.jpg",
                release_date: "2024-06-27",
                vote_average: 0,
                original_language: "te",
                overview: "In a war-torn, dystopian future as the world awaits the reincarnation of Lord Vishnu himself, Kalki, prophesied as the hero of a new era amidst unprecedented conflict."
            },
            {
                id: 1161856,
                title: "Manjummel Boys",
                poster_path: "/jpdKYp7lxQu4C8n83vVRzYlC0o8.jpg",
                release_date: "2024-02-22",
                vote_average: 7.4,
                original_language: "ml",
                overview: "A group of friends from Kerala embark on a vacation to Kodaikanal, but their trip takes a terrifying turn when one of them becomes trapped in the notorious Guna Caves."
            },
            {
                id: 654736,
                title: "Kung Fu Panda 4",
                poster_path: "/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg",
                release_date: "2024-03-08",
                vote_average: 6.9,
                original_language: "en",
                overview: "Po is gearing up to become the spiritual leader of his Valley of Peace, but also needs someone to take his place as Dragon Warrior. As such, he will train a new kung fu practitioner and find a worthy successor to his title."
            }
        ];
        
        // Filter by language if selected
        if (currentLanguage !== 'all') {
            const filteredMovies = sampleMovies.filter(movie => movie.original_language === currentLanguage);
            if (filteredMovies.length > 0) {
                displayMovies(filteredMovies);
            } else {
                displayMovies(sampleMovies);
                showError('Limited Sample Data', 'No sample movies available for the selected language filter. Showing all sample movies instead.');
            }
        } else {
            displayMovies(sampleMovies);
        }
        
        // Set total pages to 1 for the sample data
        totalPages = 1;
        createPagination();
    }
    
    // Display movies in the grid
    function displayMovies(movies) {
        moviesGrid.innerHTML = '';
        
        movies.forEach(movie => {
            // Skip movies without posters if it's from the API (sample data always has posters)
            if (!movie.poster_path && movie.id > 10000) {
                console.log('Skipping movie without poster:', movie.title);
                return;
            }
            
            // Create movie card element
            const movieCard = document.createElement('div');
            movieCard.className = 'movie-card';
            
            // Format release date
            let releaseDate = movie.release_date 
                ? new Date(movie.release_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })
                : 'Coming Soon';
            
            // Format language
            let language = CONFIG.LANGUAGE_NAMES[movie.original_language] || movie.original_language;
            
            // Format vote average
            let rating = movie.vote_average ? (movie.vote_average / 2).toFixed(1) : 'N/A';
            let stars = '';
            if (movie.vote_average) {
                const fullStars = Math.floor(movie.vote_average / 2);
                const halfStar = movie.vote_average % 2 >= 1 ? 1 : 0;
                const emptyStars = 5 - fullStars - halfStar;
                
                stars = '★'.repeat(fullStars) + (halfStar ? '½' : '') + '☆'.repeat(emptyStars);
            }
            
            // Ensure we have a valid poster path (use fallback if needed)
            const posterPath = movie.poster_path 
                ? (movie.poster_path.startsWith('http') ? movie.poster_path : `${CONFIG.TMDB_IMG_BASE_URL}${movie.poster_path}`)
                : 'https://via.placeholder.com/500x750?text=No+Poster';
            
            // Set HTML content
            movieCard.innerHTML = `
                <div class="movie-poster">
                    <img src="${posterPath}" alt="${movie.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/500x750?text=Image+Error'">
                </div>
                <div class="movie-info">
                    <h3 class="movie-title">${movie.title}</h3>
                    <span class="movie-language">${language}</span>
                    <p class="release-date">${releaseDate}</p>
                    <div class="movie-rating">
                        <span class="stars">${stars}</span>
                        <span>${rating}/5</span>
                    </div>
                    <a href="#" class="book-now" data-movie-id="${movie.id}">Book Now</a>
                </div>
            `;
            
            // Add book now button event listener
            const bookButton = movieCard.querySelector('.book-now');
            bookButton.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Get movie details
                const movieId = this.getAttribute('data-movie-id');
                const movieTitle = movieCard.querySelector('.movie-title').textContent;
                
                // Show booking message (dummy implementation)
                alert(`Booking for "${movieTitle}" (ID: ${movieId}) will be implemented in the future.`);
            });
            
            // Add to grid
            moviesGrid.appendChild(movieCard);
        });
    }
    
    // Create pagination controls
    function createPagination() {
        paginationContainer.innerHTML = '';
        
        if (totalPages <= 1) return;
        
        // Previous button
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                fetchMovies();
                // Scroll to top of movies section
                document.querySelector('.page-banner').scrollIntoView({ behavior: 'smooth' });
            }
        });
        paginationContainer.appendChild(prevButton);
        
        // Page numbers
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);
        
        // Adjust startPage if we're near the end
        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.classList.toggle('active', i === currentPage);
            pageButton.addEventListener('click', () => {
                currentPage = i;
                fetchMovies();
                // Scroll to top of movies section
                document.querySelector('.page-banner').scrollIntoView({ behavior: 'smooth' });
            });
            paginationContainer.appendChild(pageButton);
        }
        
        // Next button
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                fetchMovies();
                // Scroll to top of movies section
                document.querySelector('.page-banner').scrollIntoView({ behavior: 'smooth' });
            }
        });
        paginationContainer.appendChild(nextButton);
    }
    
    // Show error message
    function showError(title, message) {
        console.error(title, message);
        errorContainer.innerHTML = `
            <div class="error-message">
                <h3>${title}</h3>
                <p>${message}</p>
            </div>
        `;
    }
}); 