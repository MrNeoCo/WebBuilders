
// ===== TYPING ANIMATION ===== 
class TypingAnimation {
    constructor(element, texts, options = {}) {
        this.element = element;
        this.texts = texts;
        this.options = {
            typeSpeed: options.typeSpeed || 100,
            backSpeed: options.backSpeed || 50,
            pauseDelay: options.pauseDelay || 2000,
            loop: options.loop !== false,
            ...options
        };

        this.currentTextIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.isPaused = false;

        this.init();
    }

    init() {
        this.type();
    }

    type() {
        const currentText = this.texts[this.currentTextIndex];

        if (this.isPaused) {
            setTimeout(() => {
                this.isPaused = false;
                this.type();
            }, this.options.pauseDelay);
            return;
        }

        if (this.isDeleting) {
            // Deleting characters
            this.element.textContent = currentText.substring(0, this.currentCharIndex - 1);
            this.currentCharIndex--;

            if (this.currentCharIndex === 0) {
                this.isDeleting = false;
                this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
            }
        } else {
            // Typing characters
            this.element.textContent = currentText.substring(0, this.currentCharIndex + 1);
            this.currentCharIndex++;

            if (this.currentCharIndex === currentText.length) {
                this.isPaused = true;
                if (this.options.loop) {
                    this.isDeleting = true;
                }
            }
        }

        const speed = this.isDeleting ? this.options.backSpeed : this.options.typeSpeed;
        const variance = Math.random() * 50; // Add natural variance

        setTimeout(() => this.type(), speed + variance);
    }
}

// ===== INITIALIZE TYPING ANIMATION =====
document.addEventListener('DOMContentLoaded', function () {
    const typingElement = document.getElementById('typingText');
    const texts = [
        'SYSTEM ACCESSED',
        'WELCOME TO THE WEB DEVELOPMENT',
        'BUILD WEBSITE',
        'BUILD FUTURE',

    ];

    new TypingAnimation(typingElement, texts, {
        typeSpeed: 80,
        backSpeed: 40,
        pauseDelay: 2000
    });
});

// ===== SMOOTH SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== CONTACT FORM HANDLING =====

// ===== ENHANCED CONTACT FORM HANDLING =====
class FormValidator {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.successMessage = document.getElementById('successMessage');
        this.errorMessageGlobal = document.getElementById('errorMessageGlobal');

        // Replace with your Google Apps Script Web App URL
        this.scriptURL = 'https://script.google.com/macros/s/AKfycbyGEyYmhefXZCckwRNeNMPgxJ5SoEE20mb6o8vLFGbFV8sppR4tWlJ8Xvj-28KhmAlo/exec';



        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Real-time validation
        document.getElementById('name').addEventListener('blur', () => this.validateName());
        document.getElementById('phone').addEventListener('blur', () => this.validatePhone());
        document.getElementById('name').addEventListener('input', () => this.clearError('name'));
        document.getElementById('phone').addEventListener('input', () => this.clearError('phone'));
    }

    validateName() {
        const name = document.getElementById('name').value.trim();
        const nameGroup = document.getElementById('name').parentElement;
        const nameError = document.getElementById('nameError');

        if (!name) {
            this.showError(nameGroup, nameError, 'Name is required');
            return false;
        }

        if (name.length < 2) {
            this.showError(nameGroup, nameError, 'Name must be at least 2 characters');
            return false;
        }

        if (!/^[a-zA-Z\s]+$/.test(name)) {
            this.showError(nameGroup, nameError, 'Name should only contain letters and spaces');
            return false;
        }

        this.showSuccess(nameGroup);
        return true;
    }

    validatePhone() {
        const phone = document.getElementById('phone').value.trim();
        const phoneGroup = document.getElementById('phone').parentElement;
        const phoneError = document.getElementById('phoneError');

        if (!phone) {
            this.showError(phoneGroup, phoneError, 'Phone number is required');
            return false;
        }

        // Remove all non-digit characters for validation
        const cleanPhone = phone.replace(/\D/g, '');

        if (cleanPhone.length < 10) {
            this.showError(phoneGroup, phoneError, 'Phone number must be at least 10 digits');
            return false;
        }

        if (cleanPhone.length > 15) {
            this.showError(phoneGroup, phoneError, 'Phone number cannot exceed 15 digits');
            return false;
        }

        // Basic international phone number pattern
        const phonePattern = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phonePattern.test(cleanPhone)) {
            this.showError(phoneGroup, phoneError, 'Please enter a valid phone number');
            return false;
        }

        this.showSuccess(phoneGroup);
        return true;
    }

    showError(group, errorElement, message) {
        group.classList.remove('success');
        group.classList.add('error');
        errorElement.textContent = message;
    }

    showSuccess(group) {
        group.classList.remove('error');
        group.classList.add('success');
    }

    clearError(fieldName) {
        const group = document.getElementById(fieldName).parentElement;
        if (group.classList.contains('error')) {
            group.classList.remove('error');
        }
    }

    async handleSubmit(e) {
        e.preventDefault();

        // Hide previous messages
        this.successMessage.style.display = 'none';
        this.errorMessageGlobal.style.display = 'none';

        // Validate all fields
        const isNameValid = this.validateName();
        const isPhoneValid = this.validatePhone();

        if (!isNameValid || !isPhoneValid) {
            return;
        }

        // Show loading state
        this.submitBtn.classList.add('loading');
        this.submitBtn.disabled = true;

        try {
            const formData = new FormData(this.form);

            // Add timestamp
            formData.append('timestamp', new Date().toLocaleString());

            const response = await fetch(this.scriptURL, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                this.showSuccessMessage();
                this.form.reset();
                this.clearAllValidationStates();
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Error:', error);
            this.showErrorMessage();
        } finally {
            // Hide loading state
            this.submitBtn.classList.remove('loading');
            this.submitBtn.disabled = false;
        }
    }

    showSuccessMessage() {
        this.successMessage.style.display = 'block';
        setTimeout(() => {
            this.successMessage.style.display = 'none';
        }, 5000);
    }

    showErrorMessage() {
        this.errorMessageGlobal.style.display = 'block';
        setTimeout(() => {
            this.errorMessageGlobal.style.display = 'none';
        }, 5000);
    }

    clearAllValidationStates() {
        const formGroups = this.form.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            group.classList.remove('error', 'success');
        });
    }
}

// Initialize the form validator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new FormValidator();
});


// ===== NAVBAR BACKGROUND ON SCROLL =====
window.addEventListener('scroll', function () {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.style.background = 'rgba(10, 10, 10, 0.98)';
    } else {
        nav.style.background = 'rgba(10, 10, 10, 0.95)';
    }
});

// ===== PERFORMANCE OPTIMIZATION =====
// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe cards for entrance animations
document.querySelectorAll('.card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});


const toggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');

toggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// ===== CONSOLE EASTER EGG =====
console.log(`
    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
    ░  ██████╗██╗   ██╗██████╗ ███████╗  ░
    ░ ██╔════╝╚██╗ ██╔╝██╔══██╗██╔════╝  ░
    ░ ██║      ╚████╔╝ ██████╔╝█████╗    ░
    ░ ██║       ╚██╔╝  ██╔══██╗██╔══╝    ░
    ░ ╚██████╗   ██║   ██████╔╝███████╗  ░
    ░  ╚═════╝   ╚═╝   ╚═════╝ ╚══════╝  ░
    ░                                     ░
    ░          CORE SYSTEMS ONLINE        ░
    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
    
    Access Level: Developer
    Status: Authorized
    Welcome to CyberCore Systems...
        `);