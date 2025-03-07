/**
 * Authentication functionality for the MovieGo website
 * Handles sign-in, sign-up, password visibility, and form validation
 */

document.addEventListener('DOMContentLoaded', function() {
    // Sign In button functionality
    const signInButtons = document.querySelectorAll('.btn-outline');
    signInButtons.forEach(button => {
        if (button.textContent.trim() === 'Sign In') {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                window.location.href = 'signin.html';
            });
        }
    });
    
    // Sign Up button functionality
    const signUpButtons = document.querySelectorAll('.btn-primary');
    signUpButtons.forEach(button => {
        if (button.textContent.trim() === 'Sign Up') {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                window.location.href = 'signup.html';
            });
        }
    });
    
    // Authentication page functionality
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            if (input && input.type === 'password') {
                input.type = 'text';
                this.classList.remove('fa-eye');
                this.classList.add('fa-eye-slash');
            } else if (input) {
                input.type = 'password';
                this.classList.remove('fa-eye-slash');
                this.classList.add('fa-eye');
            }
        });
    });
    
    // Password strength meter
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const strengthBar = document.querySelector('.strength-bar');
            const strengthText = document.querySelector('.strength-text span');
            
            if (strengthBar && strengthText) {
                // Calculate password strength
                let strength = 0;
                if (password.length >= 8) strength += 25;
                if (password.match(/[a-z]+/)) strength += 25;
                if (password.match(/[A-Z]+/)) strength += 25;
                if (password.match(/[0-9]+/)) strength += 25;
                
                // Update strength bar
                strengthBar.style.width = `${strength}%`;
                
                // Update color based on strength
                if (strength <= 25) {
                    strengthBar.style.backgroundColor = '#e50914'; // Red
                    strengthText.textContent = 'Weak';
                } else if (strength <= 50) {
                    strengthBar.style.backgroundColor = '#ffa500'; // Orange
                    strengthText.textContent = 'Fair';
                } else if (strength <= 75) {
                    strengthBar.style.backgroundColor = '#ffd700'; // Yellow
                    strengthText.textContent = 'Good';
                } else {
                    strengthBar.style.backgroundColor = '#00ff00'; // Green
                    strengthText.textContent = 'Strong';
                }
            }
        });
    }
    
    // Form validation
    const authForm = document.querySelector('.auth-form');
    if (authForm) {
        authForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            const email = document.getElementById('email');
            const password = document.getElementById('password');
            const confirmPassword = document.getElementById('confirm-password');
            
            if (email && !isValidEmail(email.value)) {
                showError(email, 'Please enter a valid email address');
                return;
            }
            
            if (password && password.value.length < 8) {
                showError(password, 'Password must be at least 8 characters');
                return;
            }
            
            if (confirmPassword && password && password.value !== confirmPassword.value) {
                showError(confirmPassword, 'Passwords do not match');
                return;
            }
            
            // If validation passes, show success message
            alert('Form submitted successfully!');
        });
    }
    
    // Helper function to validate email
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    // Helper function to show error message
    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        if (formGroup) {
            const errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.textContent = message;
            
            // Remove any existing error message
            const existingError = formGroup.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }
            
            formGroup.appendChild(errorElement);
            input.classList.add('error');
            
            // Remove error after 3 seconds
            setTimeout(() => {
                errorElement.remove();
                input.classList.remove('error');
            }, 3000);
        }
    }
}); 