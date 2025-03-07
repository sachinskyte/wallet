/**
 * Search functionality for the MovieGo website
 * Handles search suggestions, recent searches, and search functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Enhanced search functionality
    const searchButton = document.querySelector('.search-bar button');
    const searchInput = document.querySelector('.search-bar input');
    
    if (searchButton && searchInput) {
        // Add search icon to button
        searchButton.innerHTML = '<i class="fas fa-search"></i> Search';
        
        // Create search suggestions container
        const searchSection = document.querySelector('.search-section');
        if (searchSection) {
            const suggestionsContainer = document.createElement('div');
            suggestionsContainer.className = 'search-suggestions';
            searchSection.appendChild(suggestionsContainer);
            
            // Sample search data (in a real app, this would come from an API)
            const searchData = {
                movies: [
                    { id: 1, title: 'Dune: Part Two', genre: 'Sci-Fi', year: 2024 },
                    { id: 2, title: 'The Batman', genre: 'Action', year: 2022 },
                    { id: 3, title: 'Oppenheimer', genre: 'Drama', year: 2023 },
                    { id: 4, title: 'Spider-man No Way Home', genre: 'Action', year: 2021 },
                    { id: 5, title: 'Godzilla X Kong', genre: 'Action', year: 2024 },
                    { id: 6, title: 'Kung Fu Panda 4', genre: 'Animation', year: 2024 }
                ],
                theaters: [
                    { id: 1, name: 'PVR IMAX - Phoenix MarketCity', location: 'Whitefield' },
                    { id: 2, name: 'INOX Garuda - Magrath Road', location: 'Ashok Nagar' },
                    { id: 3, name: 'Cinepolis Royal Meenakshi', location: 'Bannerghatta' },
                    { id: 4, name: 'SPI Palazzo - VV Puram', location: 'VV Puram' },
                    { id: 5, name: 'PVR VR Mall - Anna Nagar', location: 'Anna Nagar' },
                    { id: 6, name: 'INOX CMR - Jaya Nagar', location: 'Jaya Nagar' }
                ]
            };
            
            // Recent searches (would be stored in localStorage in a real app)
            let recentSearches = [];
            try {
                recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
            } catch (e) {
                console.error('Error parsing recent searches from localStorage:', e);
            }
            
            // Function to update search suggestions
            function updateSearchSuggestions(query) {
                suggestionsContainer.innerHTML = '';
                
                if (!query) {
                    // Show recent searches if no query
                    if (recentSearches.length > 0) {
                        const recentSearchesSection = document.createElement('div');
                        recentSearchesSection.className = 'recent-searches';
                        recentSearchesSection.innerHTML = `
                            <h4>Recent Searches</h4>
                            ${recentSearches.map(term => `
                                <div class="recent-search-item" data-term="${term}">
                                    <i class="fas fa-history"></i>
                                    <span>${term}</span>
                                </div>
                            `).join('')}
                        `;
                        suggestionsContainer.appendChild(recentSearchesSection);
                        
                        // Add click event to recent search items
                        document.querySelectorAll('.recent-search-item').forEach(item => {
                            item.addEventListener('click', () => {
                                searchInput.value = item.dataset.term;
                                performSearch(item.dataset.term);
                            });
                        });
                    }
                    return;
                }
                
                // Filter movies
                const movieResults = searchData.movies.filter(movie => 
                    movie.title.toLowerCase().includes(query.toLowerCase()) || 
                    movie.genre.toLowerCase().includes(query.toLowerCase())
                );
                
                // Filter theaters
                const theaterResults = searchData.theaters.filter(theater => 
                    theater.name.toLowerCase().includes(query.toLowerCase()) || 
                    theater.location.toLowerCase().includes(query.toLowerCase())
                );
                
                // Add movie results
                if (movieResults.length > 0) {
                    movieResults.forEach(movie => {
                        const movieItem = document.createElement('div');
                        movieItem.className = 'suggestion-item';
                        movieItem.innerHTML = `
                            <div class="suggestion-icon"><i class="fas fa-film"></i></div>
                            <div class="suggestion-content">
                                <div class="suggestion-title">${movie.title}</div>
                                <div class="suggestion-subtitle">${movie.genre} • ${movie.year}</div>
                            </div>
                        `;
                        movieItem.addEventListener('click', () => {
                            searchInput.value = movie.title;
                            performSearch(movie.title);
                        });
                        suggestionsContainer.appendChild(movieItem);
                    });
                }
                
                // Add theater results
                if (theaterResults.length > 0) {
                    theaterResults.forEach(theater => {
                        const theaterItem = document.createElement('div');
                        theaterItem.className = 'suggestion-item';
                        theaterItem.innerHTML = `
                            <div class="suggestion-icon"><i class="fas fa-building"></i></div>
                            <div class="suggestion-content">
                                <div class="suggestion-title">${theater.name}</div>
                                <div class="suggestion-subtitle">${theater.location}</div>
                            </div>
                        `;
                        theaterItem.addEventListener('click', () => {
                            searchInput.value = theater.name;
                            performSearch(theater.name);
                        });
                        suggestionsContainer.appendChild(theaterItem);
                    });
                }
                
                // Show "No results found" if no matches
                if (movieResults.length === 0 && theaterResults.length === 0) {
                    const noResults = document.createElement('div');
                    noResults.className = 'suggestion-item';
                    noResults.innerHTML = `
                        <div class="suggestion-icon"><i class="fas fa-search"></i></div>
                        <div class="suggestion-content">
                            <div class="suggestion-title">No results found</div>
                            <div class="suggestion-subtitle">Try a different search term</div>
                        </div>
                    `;
                    suggestionsContainer.appendChild(noResults);
                }
            }
            
            // Function to perform search
            function performSearch(term) {
                if (term) {
                    // Add to recent searches
                    if (!recentSearches.includes(term)) {
                        recentSearches.unshift(term);
                        if (recentSearches.length > 5) recentSearches.pop();
                        try {
                            localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
                        } catch (e) {
                            console.error('Error saving recent searches to localStorage:', e);
                        }
                    }
                    
                    // Hide suggestions
                    suggestionsContainer.classList.remove('active');
                    
                    // In a real implementation, this would redirect to a search results page
                    // window.location.href = `/search?q=${encodeURIComponent(term)}`;
                    
                    // For demo purposes, show an alert
                    alert(`Searching for: ${term}`);
                }
            }
            
            // Show suggestions on input focus
            searchInput.addEventListener('focus', () => {
                updateSearchSuggestions(searchInput.value);
                suggestionsContainer.classList.add('active');
            });
            
            // Update suggestions as user types
            searchInput.addEventListener('input', () => {
                updateSearchSuggestions(searchInput.value);
                suggestionsContainer.classList.add('active');
            });
            
            // Hide suggestions when clicking outside
            document.addEventListener('click', (e) => {
                if (!searchSection.contains(e.target)) {
                    suggestionsContainer.classList.remove('active');
                }
            });
            
            // Perform search on button click
            searchButton.addEventListener('click', () => {
                performSearch(searchInput.value.trim());
            });
            
            // Perform search on Enter key
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    performSearch(searchInput.value.trim());
                }
            });
        }
    }
}); 