// DOM elements
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

// Initialize the app
function init() {
  setupEventListeners();
  setupAnimations();
}

// Set up event listeners
function setupEventListeners() {
  // Navbar scroll behavior
  window.addEventListener('scroll', handleScroll);
  
  // Mobile menu toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', toggleMobileMenu);
  }
  
  // Smooth scrolling for navigation links
  document.querySelectorAll('.nav-links a, .hero-buttons a, .cta-content a').forEach(link => {
    if (link.getAttribute('href').startsWith('#')) {
      link.addEventListener('click', smoothScroll);
    }
  });
}

// Handle scroll event for navbar
function handleScroll() {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

// Toggle mobile menu
function toggleMobileMenu() {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('active');
}

// Smooth scroll to element
function smoothScroll(e) {
  e.preventDefault();
  
  const targetId = this.getAttribute('href');
  const targetElement = document.querySelector(targetId);
  
  if (targetElement) {
    // Close mobile menu if open
    if (hamburger.classList.contains('active')) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    }
    
    // Scroll to element
    window.scrollTo({
      top: targetElement.offsetTop - 80, // Offset for navbar
      behavior: 'smooth'
    });
  }
}

// Set up animations with Intersection Observer
function setupAnimations() {
  // Feature cards animation
  const featureCards = document.querySelectorAll('.feature-card');
  animateOnScroll(featureCards, 'show', 100);
  
  // Testimonial cards animation
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  animateOnScroll(testimonialCards, 'show', 100);
  
  // Pricing cards animation
  const pricingCards = document.querySelectorAll('.pricing-card');
  animateOnScroll(pricingCards, 'show', 100);
}

// Helper function to animate elements when they enter the viewport
function animateOnScroll(elements, className, delay = 0) {
  if (!elements.length) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Add delay based on element index for staggered animation
        setTimeout(() => {
          entry.target.classList.add(className);
        }, delay * index);
        
        // Unobserve after animation is triggered
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1, // Trigger when at least 10% of the element is visible
    rootMargin: '0px 0px -50px 0px' // Offset from the bottom
  });
  
  elements.forEach(element => {
    observer.observe(element);
  });
}

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);
