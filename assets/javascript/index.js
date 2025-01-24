document.addEventListener('DOMContentLoaded', function() {
    // Navbar scrolling effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Dropdown toggle for mobile
    const dropdowns = document.querySelectorAll('.dropdown');
    
    if (window.innerWidth <= 768) {
        dropdowns.forEach(dropdown => {
            dropdown.addEventListener('click', function(e) {
                // Prevent the link from navigating
                e.preventDefault();
                
                // Toggle the active class
                dropdown.classList.toggle('active');
                
                // Close other dropdowns
                dropdowns.forEach(otherDropdown => {
                    if (otherDropdown !== dropdown && otherDropdown.classList.contains('active')) {
                        otherDropdown.classList.remove('active');
                    }
                });
            });
        });
    }

    // FAQ accordion functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Toggle current item
            item.classList.toggle('active');
            
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
        });
    });

    // Testimonial slider
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;

    // Set the first testimonial as active
    if (testimonials.length > 0) {
        testimonials[0].classList.add('active');
    }

    // Function to show a specific slide
    function showSlide(index) {
        // Remove active class from all testimonials
        testimonials.forEach(testimonial => {
            testimonial.classList.remove('active');
        });
        
        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Add active class to the selected testimonial and dot
        testimonials[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }

    // Event listeners for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
        });
    });

    // Event listeners for previous and next buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + testimonials.length) % testimonials.length;
            showSlide(currentSlide);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % testimonials.length;
            showSlide(currentSlide);
        });
    }

    // Auto-slide functionality
    setInterval(() => {
        currentSlide = (currentSlide + 1) % testimonials.length;
        showSlide(currentSlide);
    }, 5000);

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Account for navbar height
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    hamburger.classList.remove('active');
                }
            }
        });
    });

    // Account modal functionality
    const startJourneyBtn = document.getElementById('startJourneyBtn');
    const startJourneyBtnBottom = document.getElementById('startJourneyBtnBottom');
    const accountModal = document.getElementById('accountModal');
    const modalClose = document.getElementById('modalClose');
    const accountForm = document.getElementById('accountForm');
    const accountAmount = document.getElementById('accountAmount');
    const submitAmount = document.getElementById('submitAmount');
    const amountError = document.getElementById('amountError');

    // Function to open the modal
    function openAccountModal() {
        accountModal.classList.add('active');
        // Focus on the input field
        setTimeout(() => {
            accountAmount.focus();
        }, 300);
    }

    // Only add event listeners if we're on the homepage
    if (startJourneyBtn) {
        // Open modal when clicking "Start Your Journey" buttons
        startJourneyBtn.addEventListener('click', openAccountModal);
        
        if (startJourneyBtnBottom) {
            startJourneyBtnBottom.addEventListener('click', openAccountModal);
        }

        // Close modal when clicking the X
        modalClose.addEventListener('click', function() {
            accountModal.classList.remove('active');
        });

        // Close modal when clicking outside
        accountModal.addEventListener('click', function(e) {
            if (e.target === accountModal) {
                accountModal.classList.remove('active');
            }
        });

        // Input validation - only allow numbers and decimals
        accountAmount.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9.]/g, '');
        });

        // Form submission
        submitAmount.addEventListener('click', submitAccountAmount);
        accountForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitAccountAmount();
        });

        function submitAccountAmount() {
            const amount = accountAmount.value.trim();
            const name = document.getElementById('userName').value.trim();
            
            // Validate the inputs
            let isValid = true;
            
            if (!name) {
                document.getElementById('nameError').classList.add('active');
                document.getElementById('userName').focus();
                isValid = false;
            } else {
                document.getElementById('nameError').classList.remove('active');
            }
            
            if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) < 0) {
                amountError.classList.add('active');
                if (isValid) {
                    accountAmount.focus();
                }
                isValid = false;
            } else {
                amountError.classList.remove('active');
            }
            
            if (!isValid) {
                return;
            }
            
            // Store the data in localStorage
            const balance = parseFloat(amount);
            localStorage.setItem('accountBalance', balance);
            localStorage.setItem('initialBalance', balance);
            localStorage.setItem('userName', name);
            localStorage.setItem('transactions', JSON.stringify([]));
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        }

        // Handle Enter key in the input field
        accountAmount.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                submitAccountAmount();
            }
        });
    }
});
