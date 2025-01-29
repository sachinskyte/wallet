// DOM Elements
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

// Function to handle scroll behavior for navbar
function handleScroll() {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// Function to handle smooth scrolling for navigation links
function smoothScroll(e) {
    if (e.target.hasAttribute('href') && e.target.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const id = e.target.getAttribute('href');
        if (id === '#') return;

        const element = document.querySelector(id);
        if (element) {
            // If mobile menu is open, close it first
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            }
            
            const offsetTop = element.offsetTop;
            window.scrollTo({
                top: offsetTop - 80,
                behavior: 'smooth'
            });
        }
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Handle mobile menu toggle
    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
    
    // Handle scroll events
    window.addEventListener('scroll', handleScroll);
    
    // Handle navigation link clicks for smooth scrolling
    document.querySelectorAll('.nav-links a[href^="#"]').forEach(link => {
        link.addEventListener('click', smoothScroll);
    });
    
    // Add active class to nav links based on scroll position
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
        });
        
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Feature animation on scroll
    const featureCards = document.querySelectorAll('.feature-card');
    
    const featureObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, {
        threshold: 0.1
    });
    
    featureCards.forEach((card) => {
        featureObserver.observe(card);
    });
    
    // Testimonial animation on scroll
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    
    const testimonialObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, {
        threshold: 0.1
    });
    
    testimonialCards.forEach((card) => {
        testimonialObserver.observe(card);
    });
    
    // Pricing card animation on scroll
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    const pricingObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add a slight delay for each card
                setTimeout(() => {
                    entry.target.classList.add('show');
                }, index * 150);
            }
        });
    }, {
        threshold: 0.1
    });
    
    pricingCards.forEach((card) => {
        pricingObserver.observe(card);
    });
});
