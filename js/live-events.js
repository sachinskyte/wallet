document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initEventFilters();
    initAnimations();
    initPagination();
    
    // Set up newsletter form
    setupNewsletterForm();
});

/**
 * Initialize event filters
 */
function initEventFilters() {
    const filterElements = document.querySelectorAll('.filter-group select');
    
    filterElements.forEach(filter => {
        filter.addEventListener('change', function() {
            filterEvents();
        });
    });
}

/**
 * Filter events based on selected criteria
 */
function filterEvents() {
    const eventType = document.querySelector('#event-type').value;
    const eventDate = document.querySelector('#event-date').value;
    const eventLocation = document.querySelector('#event-location').value;
    
    const eventCards = document.querySelectorAll('.event-card');
    let visibleEvents = 0;
    
    eventCards.forEach(card => {
        const cardType = card.getAttribute('data-type');
        const cardDate = card.getAttribute('data-date');
        const cardLocation = card.getAttribute('data-location');
        
        // Check if the card matches all selected filters
        const typeMatch = eventType === 'all' || cardType === eventType;
        const dateMatch = eventDate === 'all' || cardDate === eventDate;
        const locationMatch = eventLocation === 'all' || cardLocation === eventLocation;
        
        if (typeMatch && dateMatch && locationMatch) {
            card.style.display = 'flex';
            visibleEvents++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Show message if no events match criteria
    const noResultsMessage = document.querySelector('.no-results-message');
    if (noResultsMessage) {
        if (visibleEvents === 0) {
            noResultsMessage.style.display = 'block';
        } else {
            noResultsMessage.style.display = 'none';
        }
    }
}

/**
 * Initialize animations for page elements
 */
function initAnimations() {
    // Add fade-in animations to the event cards
    const eventCards = document.querySelectorAll('.event-card, .category-card, .featured-event-card');
    
    // Create an Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    // Observe each card
    eventCards.forEach(card => {
        observer.observe(card);
        card.classList.add('fade-in');
    });
    
    // Animate the banner elements
    const bannerContent = document.querySelector('.banner-content');
    if (bannerContent) {
        bannerContent.classList.add('animate');
    }
}

/**
 * Initialize pagination functionality
 */
function initPagination() {
    const pageNumbers = document.querySelectorAll('.page-number');
    const prevButton = document.querySelector('.page-nav.prev');
    const nextButton = document.querySelector('.page-nav.next');
    
    let currentPage = 1;
    
    // Set up page number clicks
    pageNumbers.forEach(page => {
        page.addEventListener('click', function() {
            const pageNum = parseInt(this.textContent);
            if (!isNaN(pageNum)) {
                setActivePage(pageNum);
            }
        });
    });
    
    // Set up prev/next buttons
    if (prevButton) {
        prevButton.addEventListener('click', function() {
            if (currentPage > 1) {
                setActivePage(currentPage - 1);
            }
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            if (currentPage < pageNumbers.length) {
                setActivePage(currentPage + 1);
            }
        });
    }
    
    // Function to set active page
    function setActivePage(pageNum) {
        // Update active page
        currentPage = pageNum;
        
        // Update pagination UI
        pageNumbers.forEach(page => {
            const pageNumber = parseInt(page.textContent);
            if (pageNumber === currentPage) {
                page.classList.add('active');
            } else {
                page.classList.remove('active');
            }
        });
        
        // Update prev/next button states
        if (prevButton) {
            if (currentPage === 1) {
                prevButton.classList.add('disabled');
            } else {
                prevButton.classList.remove('disabled');
            }
        }
        
        if (nextButton) {
            if (currentPage === pageNumbers.length) {
                nextButton.classList.add('disabled');
            } else {
                nextButton.classList.remove('disabled');
            }
        }
        
        // Here you would load the events for the current page
        // This is a placeholder for that functionality
        console.log(`Loading events for page ${currentPage}`);
        
        // Scroll to top of events section
        const eventsSection = document.querySelector('.upcoming-events');
        if (eventsSection) {
            eventsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    // Initialize first page
    setActivePage(1);
}

/**
 * Set up newsletter form submission
 */
function setupNewsletterForm() {
    const form = document.querySelector('.newsletter-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (validateEmail(email)) {
                // Simulated successful subscription
                showMessage('success', 'Thank you for subscribing to our newsletter!');
                emailInput.value = '';
            } else {
                showMessage('error', 'Please enter a valid email address.');
            }
        });
    }
}

/**
 * Validate email format
 * @param {string} email - The email to validate
 * @returns {boolean} - Whether the email is valid
 */
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

/**
 * Show a message to the user
 * @param {string} type - The type of message ('success' or 'error')
 * @param {string} text - The message text
 */
function showMessage(type, text) {
    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.textContent = text;
    
    // Append to body
    document.body.appendChild(messageElement);
    
    // Show message
    setTimeout(() => {
        messageElement.classList.add('show');
    }, 10);
    
    // Remove message after 3 seconds
    setTimeout(() => {
        messageElement.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(messageElement);
        }, 300);
    }, 3000);
}

/**
 * Create a modal for event details
 * @param {number} eventId - The ID of the event to show
 */
function showEventModal(eventId) {
    console.log(`Show event details for event ID: ${eventId}`);
    
    // In a real application, you would fetch event details from an API
    // This is just a placeholder implementation
    
    const eventModal = document.querySelector('#event-modal');
    if (eventModal) {
        const modalContent = eventModal.querySelector('.modal-content');
        modalContent.innerHTML = `
            <h2>Event details loading...</h2>
            <p>Loading information for event ID: ${eventId}</p>
        `;
        
        // Show modal
        eventModal.classList.add('open');
        document.body.classList.add('modal-open');
        
        // Setup close button
        const closeBtn = eventModal.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeEventModal);
        }
        
        // Close on background click
        eventModal.addEventListener('click', function(e) {
            if (e.target === eventModal) {
                closeEventModal();
            }
        });
    }
}

/**
 * Close the event details modal
 */
function closeEventModal() {
    const eventModal = document.querySelector('#event-modal');
    if (eventModal) {
        eventModal.classList.remove('open');
        document.body.classList.remove('modal-open');
    }
}

// Add global styles for messages and animations
const styleElement = document.createElement('style');
styleElement.textContent = `
    /* Message styles */
    .message {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 4px;
        color: white;
        font-size: 0.9rem;
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    
    .message.show {
        transform: translateY(0);
        opacity: 1;
    }
    
    .message.success {
        background-color: #28a745;
    }
    
    .message.error {
        background-color: #dc3545;
    }
    
    /* Animation classes */
    .fade-in {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .fade-in.animated {
        opacity: 1;
        transform: translateY(0);
    }
    
    .banner-content.animate h1 {
        animation: slideDown 0.8s ease forwards;
    }
    
    .banner-content.animate p {
        animation: slideDown 0.8s ease 0.2s forwards;
        opacity: 0;
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    /* Modal styles */
    #event-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    }
    
    #event-modal.open {
        opacity: 1;
        visibility: visible;
    }
    
    .modal-content {
        background-color: #1a1b24;
        border-radius: 8px;
        max-width: 800px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        padding: 30px;
        position: relative;
        transform: scale(0.9);
        transition: all 0.3s ease;
    }
    
    #event-modal.open .modal-content {
        transform: scale(1);
    }
    
    .close-modal {
        position: absolute;
        top: 20px;
        right: 20px;
        width: 30px;
        height: 30px;
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .close-modal:hover {
        background-color: rgba(255, 255, 255, 0.2);
    }
    
    body.modal-open {
        overflow: hidden;
    }
`;

document.head.appendChild(styleElement); 