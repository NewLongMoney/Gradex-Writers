// Smooth scrolling for navigation links
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

// Quote Calculator
const serviceType = document.getElementById('service-type');
const pages = document.getElementById('pages');
const urgency = document.getElementById('urgency');
const calculateBtn = document.getElementById('calculate-btn');
const quotePrice = document.getElementById('quote-price');
const quoteResult = document.getElementById('quote-result');

// Pricing structure based on the investment report
const pricing = {
    'high-school': { base: 7.5, min: 5, max: 10 },
    'college': { base: 15, min: 10, max: 20 },
    'masters': { base: 30, min: 20, max: 40 },
    'phd': { base: 60, min: 40, max: 80 },
    'business': { base: 65, min: 30, max: 100 }
};

// Urgency multipliers
const urgencyMultipliers = {
    'normal': 1.0,
    'urgent': 1.3,
    'very-urgent': 1.6
};

// Calculate quote
function calculateQuote() {
    const selectedService = serviceType.value;
    const pageCount = parseInt(pages.value) || 1;
    const selectedUrgency = urgency.value;
    
    // Get base price
    let basePrice = pricing[selectedService].base;
    
    // Apply urgency multiplier
    const multiplier = urgencyMultipliers[selectedUrgency];
    let totalPrice = basePrice * pageCount * multiplier;
    
    // For business documents, it's per project, not per page
    if (selectedService === 'business') {
        // Business documents have a different pricing model
        // Base price is per project, but we'll adjust based on pages
        if (pageCount <= 5) {
            totalPrice = pricing[selectedService].base * multiplier;
        } else if (pageCount <= 10) {
            totalPrice = (pricing[selectedService].base * 1.5) * multiplier;
        } else {
            totalPrice = (pricing[selectedService].base * 2) * multiplier;
        }
    }
    
    // Round to 2 decimal places
    totalPrice = Math.round(totalPrice * 100) / 100;
    
    // Display the result
    quotePrice.textContent = `$${totalPrice.toFixed(2)}`;
    
    // Animate the result
    quoteResult.style.opacity = '0';
    quoteResult.style.transform = 'scale(0.9)';
    
    setTimeout(() => {
        quoteResult.style.transition = 'all 0.3s ease';
        quoteResult.style.opacity = '1';
        quoteResult.style.transform = 'scale(1)';
    }, 50);
}

// Event listeners
calculateBtn.addEventListener('click', calculateQuote);

// Calculate on input change
pages.addEventListener('input', () => {
    if (pages.value > 0) {
        calculateQuote();
    }
});

serviceType.addEventListener('change', calculateQuote);
urgency.addEventListener('change', calculateQuote);

// Initial calculation
calculateQuote();

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.backgroundColor = 'rgba(10, 31, 68, 0.98)';
    } else {
        navbar.style.backgroundColor = 'rgba(10, 31, 68, 0.95)';
    }
    
    lastScroll = currentScroll;
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe service cards, feature items, and pricing cards
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.service-card, .feature-item, .pricing-card');
    
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
});

// Form validation
pages.addEventListener('input', function() {
    if (this.value < 1) {
        this.value = 1;
    }
    if (this.value > 1000) {
        this.value = 1000;
    }
});

// Mobile menu toggle (if needed in future)
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}
