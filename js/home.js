// TMDB API Configuration
const TMDB_API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your TMDB API key
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';
const BACKDROP_SIZE = 'original';
const POSTER_SIZE = 'w500';

// Fallback images
const FALLBACK_POSTER = 'https://via.placeholder.com/500x750?text=No+Poster';
const FALLBACK_BACKDROP = 'https://via.placeholder.com/1920x1080?text=No+Backdrop';

// Mock Data for development (when API key is not set)
const MOCK_DATA = {
    nowPlaying: {
        results: [
            {
                id: 872585,
                title: "Oppenheimer",
                poster_path: "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
                backdrop_path: "/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg",
                vote_average: 8.1,
                vote_count: 6952,
                release_date: "2023-07-19",
                overview: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb."
            },
            {
                id: 447365,
                title: "Guardians of the Galaxy Vol. 3",
                poster_path: "/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg",
                backdrop_path: "/5YZbUmjbMa3ClvSW1Wj3D6XGolb.jpg",
                vote_average: 7.9,
                vote_count: 5645,
                release_date: "2023-05-03",
                overview: "Peter Quill, still reeling from the loss of Gamora, must rally his team around him to defend the universe along with protecting one of their own. A mission that, if not completed successfully, could quite possibly lead to the end of the Guardians as we know them."
            },
            {
                id: 569094,
                title: "Spider-Man: Across the Spider-Verse",
                poster_path: "/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
                backdrop_path: "/nGxUxi3PfXDRm7Vg95VBNgNM8yc.jpg",
                vote_average: 8.4,
                vote_count: 5622,
                release_date: "2023-05-31",
                overview: "After reuniting with Gwen Stacy, Brooklyn's full-time, friendly neighborhood Spider-Man is catapulted across the Multiverse, where he encounters the Spider Society, a team of Spider-People charged with protecting the Multiverse's very existence. But when the heroes clash on how to handle a new threat, Miles finds himself pitted against the other Spiders and must set out on his own to save those he loves most."
            },
            {
                id: 385687,
                title: "Fast X",
                poster_path: "/fiVW06jE7z9YnO4trhaMEdclSiC.jpg",
                backdrop_path: "/4XM8DUTQb3lhLemJC51Jx4a2EuA.jpg",
                vote_average: 7.2,
                vote_count: 4624,
                release_date: "2023-05-17",
                overview: "Over many missions and against impossible odds, Dom Toretto and his family have outsmarted, out-nerved and outdriven every foe in their path. Now, they confront the most lethal opponent they've ever faced: A terrifying threat emerging from the shadows of the past who's fueled by blood revenge, and who is determined to shatter this family and destroy everything—and everyone—that Dom loves, forever."
            }
        ]
    },
    popular: {
        results: [
            {
                id: 76600,
                title: "Avatar: The Way of Water",
                poster_path: "/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
                backdrop_path: "/5gPQKfFJnl8d1edbkOzKONo4mnr.jpg",
                vote_average: 7.6,
                vote_count: 10612,
                release_date: "2022-12-14",
                overview: "Set more than a decade after the events of the first film, learn the story of the Sully family (Jake, Neytiri, and their kids), the trouble that follows them, the lengths they go to keep each other safe, the battles they fight to stay alive, and the tragedies they endure."
            },
            {
                id: 667538,
                title: "Transformers: Rise of the Beasts",
                poster_path: "/gPbM0MK8CP8A174rmUwGsADNYKD.jpg",
                backdrop_path: "/bWIIWhnaoWx3EkbWbcwp6B1Jksx.jpg",
                vote_average: 7.5,
                vote_count: 4158,
                release_date: "2023-06-06",
                overview: "When a new threat capable of destroying the entire planet emerges, Optimus Prime and the Autobots must team up with a powerful faction known as the Maximals. With the fate of humanity hanging in the balance, humans Noah and Elena will do whatever it takes to help the Transformers as they engage in the ultimate battle to save Earth."
            },
            {
                id: 298618,
                title: "The Flash",
                poster_path: "/rktDFPbfHfUbArZ6OOOKsXcv0Bm.jpg",
                backdrop_path: "/yF1eOkaYvwiORauRCPWznV9xVvi.jpg",
                vote_average: 6.9,
                vote_count: 3623,
                release_date: "2023-06-13",
                overview: "When his attempt to save his family inadvertently alters the future, Barry Allen becomes trapped in a reality in which General Zod has returned and there are no Super Heroes to turn to. In order to save the world that he is in and return to the future that he knows, Barry's only hope is to race for his life. But will making the ultimate sacrifice be enough to reset the universe?"
            },
            {
                id: 502356,
                title: "The Super Mario Bros. Movie",
                poster_path: "/qNBAXBIQlnOThrVvA6mA2B5ggV6.jpg",
                backdrop_path: "/9n2tJBplPbgR2ca05hS5CKXwP2c.jpg",
                vote_average: 7.8,
                vote_count: 7092,
                release_date: "2023-04-05",
                overview: "While working underground to fix a water main, Brooklyn plumbers—and brothers—Mario and Luigi are transported down a mysterious pipe and wander into a magical new world. But when the brothers are separated, Mario embarks on an epic quest to find Luigi."
            }
        ]
    },
    topRated: {
        results: [
            {
                id: 278,
                title: "The Shawshank Redemption",
                poster_path: "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
                backdrop_path: "/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg",
                vote_average: 8.7,
                vote_count: 24589,
                release_date: "1994-09-23",
                overview: "Framed in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison, where he puts his accounting skills to work for an amoral warden."
            },
            {
                id: 238,
                title: "The Godfather",
                poster_path: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
                backdrop_path: "/tmU7GeKVybMWFButWEGl2M4GeiP.jpg",
                vote_average: 8.7,
                vote_count: 18245,
                release_date: "1972-03-14",
                overview: "Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family. When organized crime family patriarch, Vito Corleone barely survives an attempt on his life, his youngest son, Michael steps in to take care of the would-be killers."
            },
            {
                id: 424,
                title: "Schindler's List",
                poster_path: "/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg",
                backdrop_path: "/loRmRzQXZeqG78TqZuyvSlEQfZb.jpg",
                vote_average: 8.6,
                vote_count: 14676,
                release_date: "1993-12-15",
                overview: "The true story of how businessman Oskar Schindler saved over a thousand Jewish lives from the Nazis while they worked as slaves in his factory during World War II."
            },
            {
                id: 240,
                title: "The Godfather Part II",
                poster_path: "/hek3koDUyRQk7FIhPXsa6mT2Zc3.jpg",
                backdrop_path: "/kGzFbGhp99zva6oZODW5atUtnqi.jpg",
                vote_average: 8.6,
                vote_count: 10965,
                release_date: "1974-12-20",
                overview: "In the continuing saga of the Corleone crime family, a young Vito Corleone grows up in Sicily and in 1910s New York. In the 1950s, Michael Corleone attempts to expand the family business into Las Vegas, Hollywood and Cuba."
            }
        ]
    }
};

// API endpoints
const ENDPOINTS = {
    nowPlaying: '/movie/now_playing',
    popular: '/movie/popular',
    topRated: '/movie/top_rated'
};

// Fetch data from TMDB
async function fetchFromTMDB(endpoint) {
    // Use mock data if API key is not set
    if (TMDB_API_KEY === 'YOUR_API_KEY_HERE') {
        console.log('Using mock data for', endpoint);
        // Return the corresponding mock data based on endpoint
        if (endpoint === ENDPOINTS.nowPlaying) return MOCK_DATA.nowPlaying;
        if (endpoint === ENDPOINTS.popular) return MOCK_DATA.popular;
        if (endpoint === ENDPOINTS.topRated) return MOCK_DATA.topRated;
        return null;
    }

    try {
        const response = await fetch(`${TMDB_BASE_URL}${endpoint}?api_key=${TMDB_API_KEY}&language=en-US&page=1`);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

// Get image URL with fallback
function getImageUrl(path, size, fallback) {
    if (!path) return fallback;
    return `${IMAGE_BASE_URL}${size}${path}`;
}

// Render movie card
function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.innerHTML = `
        <img src="${getImageUrl(movie.poster_path, POSTER_SIZE, FALLBACK_POSTER)}" 
             alt="${movie.title}" 
             class="movie-poster"
             loading="lazy">
        <div class="movie-info">
            <h3 class="movie-title">${movie.title}</h3>
            <div class="movie-rating">★ ${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</div>
        </div>
    `;
    card.addEventListener('click', () => showMovieDetails(movie));
    return card;
}

// Show movie details in modal
function showMovieDetails(movie) {
    const modal = document.getElementById('movie-modal');
    const modalDetails = document.getElementById('modal-details');
    
    modalDetails.innerHTML = `
        <img src="${getImageUrl(movie.backdrop_path, BACKDROP_SIZE, FALLBACK_BACKDROP)}" 
             alt="${movie.title}" 
             style="width: 100%; border-radius: 8px;">
        <h2>${movie.title}</h2>
        <p><strong>Release Date:</strong> ${movie.release_date || 'Unknown'}</p>
        <p><strong>Rating:</strong> ${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'} (${movie.vote_count || 0} votes)</p>
        <p>${movie.overview || 'No description available.'}</p>
    `;
    
    modal.style.display = 'block';
}

// Close modal when clicking the X
document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('movie-modal').style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    const modal = document.getElementById('movie-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Render movies section
async function renderMoviesSection(endpoint, sectionId) {
    const section = document.getElementById(sectionId);
    const grid = section.querySelector('.movies-grid');
    
    try {
        const data = await fetchFromTMDB(endpoint);
        if (!data || !data.results) throw new Error('No data available');
        
        data.results.forEach(movie => {
            grid.appendChild(createMovieCard(movie));
        });
    } catch (error) {
        console.error(`Error rendering ${sectionId}:`, error);
        grid.innerHTML = `<p>Unable to load movies. Please try again later.</p>`;
    } finally {
        section.classList.remove('loading');
    }
}

// Create and display hero slider
async function renderHeroSection() {
    const heroSection = document.getElementById('hero');
    const heroContent = heroSection.querySelector('.hero-content');
    
    try {
        const data = await fetchFromTMDB(ENDPOINTS.nowPlaying);
        if (!data || !data.results) throw new Error('No data available');
        
        // Get first 3 movies for hero
        const heroMovies = data.results.slice(0, 3);
        
        // Create hero content
        heroContent.innerHTML = `
            <div class="hero-slider">
                ${heroMovies.map((movie, index) => `
                    <div class="hero-slide ${index === 0 ? 'active' : ''}">
                        <div class="hero-backdrop" style="background-image: url('${getImageUrl(movie.backdrop_path, BACKDROP_SIZE, FALLBACK_BACKDROP)}')"></div>
                        <div class="hero-details">
                            <h1>${movie.title}</h1>
                            <p>${movie.overview || 'No description available.'}</p>
                            <div class="hero-meta">
                                <span class="hero-rating">★ ${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
                                <span class="hero-year">${movie.release_date ? movie.release_date.split('-')[0] : ''}</span>
                            </div>
                            <button class="hero-button">Watch Trailer</button>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="hero-nav">
                ${heroMovies.map((_, index) => `
                    <span class="hero-nav-item ${index === 0 ? 'active' : ''}" data-index="${index}"></span>
                `).join('')}
            </div>
        `;
        
        // Add event listeners for hero navigation
        const navItems = heroContent.querySelectorAll('.hero-nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const index = item.getAttribute('data-index');
                const slides = heroContent.querySelectorAll('.hero-slide');
                
                // Update active states
                heroContent.querySelector('.hero-slide.active').classList.remove('active');
                heroContent.querySelector('.hero-nav-item.active').classList.remove('active');
                
                slides[index].classList.add('active');
                item.classList.add('active');
            });
        });
        
        // Auto-rotate hero slides every 7 seconds
        let currentSlide = 0;
        const slides = heroContent.querySelectorAll('.hero-slide');
        const indicators = heroContent.querySelectorAll('.hero-nav-item');
        
        if (slides.length > 1) {
            setInterval(() => {
                // Remove active class from current
                slides[currentSlide].classList.remove('active');
                indicators[currentSlide].classList.remove('active');
                
                // Move to next slide
                currentSlide = (currentSlide + 1) % slides.length;
                
                // Add active class to new current
                slides[currentSlide].classList.add('active');
                indicators[currentSlide].classList.add('active');
            }, 7000);
        }
        
    } catch (error) {
        console.error('Error rendering hero section:', error);
        heroContent.innerHTML = `<p>Unable to load featured movies.</p>`;
    } finally {
        heroSection.classList.remove('loading');
    }
}

// Initialize page
async function initializePage() {
    // Load hero section
    renderHeroSection();
    
    // Load movie sections
    renderMoviesSection(ENDPOINTS.nowPlaying, 'now-playing');
    renderMoviesSection(ENDPOINTS.popular, 'popular');
    renderMoviesSection(ENDPOINTS.topRated, 'top-rated');
}

// Start loading when DOM is ready
document.addEventListener('DOMContentLoaded', initializePage); 