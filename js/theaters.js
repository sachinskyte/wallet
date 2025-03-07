/**
 * Theaters page functionality for the MovieGo website
 * Handles theater filtering, scrolling, and intersection observation
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize loading state
    const loadingAnimation = document.getElementById('loading-animation');
    
    // Hide navigation buttons since we're using scroll instead
    const prevButton = document.getElementById('prev-theater');
    const nextButton = document.getElementById('next-theater');
    if (prevButton) prevButton.style.display = 'none';
    if (nextButton) nextButton.style.display = 'none';
    
    // Show all theaters with fade-in effect once page loads
    const theaterCards = document.querySelectorAll('.theater-card');
    const theaterThumbs = document.querySelectorAll('.theater-thumb');
    
    // Initialize Intersection Observer for scrolling
    const observerOptions = {
        root: null, // viewport
        rootMargin: '-10% 0px -10% 0px', // trigger when 10% in viewport
        threshold: 0.4 // trigger when 40% of the element is visible
    };
    
    // Create observer to detect which theater is in view
    const theaterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const theaterId = entry.target.id;
                const theaterNumber = theaterId.split('-')[1];
                
                // Update active state for thumbnails
                document.querySelectorAll('.theater-thumb').forEach(thumb => {
                    thumb.classList.remove('active');
                });
                
                const activeThumb = document.querySelector(`.theater-thumb[data-theater="${theaterNumber}"]`);
                if (activeThumb) {
                    activeThumb.classList.add('active');
                    
                    // Update the current theater counter
                    const currentTheaterElement = document.getElementById('current-theater');
                    if (currentTheaterElement) {
                        currentTheaterElement.textContent = theaterNumber;
                    }
                }
            }
        });
    }, observerOptions);
    
    // Start observing all theater cards
    theaterCards.forEach(card => {
        theaterObserver.observe(card);
    });
    
    // Add click functionality for thumbnails to scroll to theater
    theaterThumbs.forEach(thumb => {
        thumb.addEventListener('click', function() {
            const theaterNumber = this.getAttribute('data-theater');
            const targetTheater = document.getElementById(`theater-${theaterNumber}`);
            
            if (targetTheater) {
                // Smooth scroll to the theater
                targetTheater.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Initialize filter functionality
    const locationFilter = document.getElementById('location-filter');
    const experienceFilter = document.getElementById('experience-filter');
    
    if (locationFilter || experienceFilter) {
        const filterTheaters = () => {
            const selectedLocation = locationFilter ? locationFilter.value.toLowerCase() : '';
            const selectedExperience = experienceFilter ? experienceFilter.value.toLowerCase() : '';
            
            let visibleCount = 0;
            
            theaterCards.forEach(card => {
                let showCard = true;
                
                // Location filtering
                if (selectedLocation) {
                    const addressElement = card.querySelector('.theater-address');
                    if (addressElement) {
                        const address = addressElement.textContent.toLowerCase();
                        if (!address.includes(selectedLocation)) {
                            showCard = false;
                        }
                    }
                }
                
                // Experience filtering
                if (selectedExperience) {
                    const featuresElement = card.querySelector('.theater-features');
                    if (featuresElement) {
                        const features = featuresElement.textContent.toLowerCase();
                        if (!features.includes(selectedExperience)) {
                            showCard = false;
                        }
                    }
                }
                
                // Show or hide the card
                if (showCard) {
                    card.style.display = 'flex';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
                
                // Also update the corresponding thumbnail
                const theaterNumber = card.id.split('-')[1];
                const thumb = document.querySelector(`.theater-thumb[data-theater="${theaterNumber}"]`);
                if (thumb) {
                    thumb.style.display = showCard ? 'block' : 'none';
                }
            });
            
            // Update theater counter
            const totalTheatersElement = document.getElementById('total-theaters');
            if (totalTheatersElement) {
                totalTheatersElement.textContent = visibleCount;
            }
            
            // Show error message if no theaters match the filters
            const errorMessage = document.getElementById('no-results-error');
            if (errorMessage) {
                if (visibleCount === 0) {
                    errorMessage.style.display = 'flex';
                } else {
                    errorMessage.style.display = 'none';
                }
            }
        };
        
        // Add event listeners to filters
        if (locationFilter) locationFilter.addEventListener('change', filterTheaters);
        if (experienceFilter) experienceFilter.addEventListener('change', filterTheaters);
    }
    
    // Hide loading animation after a short delay
    setTimeout(() => {
        if (loadingAnimation) {
            loadingAnimation.style.display = 'none';
        }
        
        // Show all theaters with staggered animation
        theaterCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100 * index);
        });
    }, 800);
    
    // Add hover effects for theater cards
    theaterCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        });
    });
}); 