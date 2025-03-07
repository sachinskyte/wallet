/**
 * Carousel functionality for the MovieGo website
 * Handles the automatic and manual navigation of the carousel
 */

document.addEventListener('DOMContentLoaded', function() {
    // Carousel functionality
    const carousel = document.querySelector('.carousel');
    const indicators = document.querySelectorAll('.indicator');
    
    if (carousel && indicators.length > 0) {
        // Manual carousel navigation
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                // Stop the animation
                carousel.style.animation = 'none';
                
                // Move to the clicked slide
                carousel.style.transform = `translateX(-${index * 25}%)`;
                
                // Update active indicator
                const activeIndicator = document.querySelector('.indicator.active');
                if (activeIndicator) {
                    activeIndicator.classList.remove('active');
                }
                indicator.classList.add('active');
                
                // Optionally restart the animation after a delay
                setTimeout(() => {
                    carousel.style.animation = '';
                }, 5000);
            });
        });
    }
}); 