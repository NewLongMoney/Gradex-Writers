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

// Pricing structure based on urgency-based pricing sheet
// Format: { standard: {min, max}, rush: {min, max}, urgent: {min, max}, perPage: boolean }
const pricing = {
    'high-school': {
        standard: { min: 10, max: 15 },
        rush: { min: 20, max: 25 },
        urgent: { min: 30, max: 45 },
        perPage: true
    },
    'undergraduate': {
        standard: { min: 12, max: 20 },
        rush: { min: 25, max: 35 },
        urgent: { min: 40, max: 60 },
        perPage: true
    },
    'masters': {
        standard: { min: 18, max: 28 },
        rush: { min: 35, max: 50 },
        urgent: { min: 60, max: 90 },
        perPage: true
    },
    'phd': {
        standard: { min: 25, max: 40 },
        rush: { min: 50, max: 80 },
        urgent: { min: 90, max: 150 },
        perPage: true
    },
    'technical': {
        standard: { min: 20, max: 35 },
        rush: { min: 40, max: 65 },
        urgent: { min: 70, max: 120 },
        perPage: true
    },
    'data-analysis': {
        standard: { min: 50, max: 120 },
        rush: { min: 120, max: 250 },
        urgent: { min: 250, max: 500 },
        perPage: false
    },
    'dissertation': {
        standard: { min: 200, max: 500 },
        rush: { min: 500, max: 900 },
        urgent: { min: 900, max: 1500 },
        perPage: false
    },
    'business-docs': {
        standard: { min: 30, max: 80 },
        rush: { min: 80, max: 140 },
        urgent: { min: 140, max: 250 },
        perPage: true
    },
    'content': {
        standard: { min: 40, max: 120 },
        rush: { min: 75, max: 180 },
        urgent: { min: 120, max: 300 },
        perPage: false
    },
    'editing': {
        standard: { min: 5, max: 10 },
        rush: { min: 10, max: 15 },
        urgent: { min: 15, max: 25 },
        perPage: true
    }
};

// Calculate quote
function calculateQuote() {
    const selectedService = serviceType.value;
    const pageCount = parseInt(pages.value) || 1;
    const selectedUrgency = urgency.value;
    
    if (!pricing[selectedService]) {
        quotePrice.textContent = '$0.00';
        return;
    }
    
    const servicePricing = pricing[selectedService];
    
    // Map urgency values to pricing tiers
    let priceTier;
    if (selectedUrgency === 'standard') {
        priceTier = servicePricing.standard;
    } else if (selectedUrgency === 'rush') {
        priceTier = servicePricing.rush;
    } else if (selectedUrgency === 'urgent') {
        priceTier = servicePricing.urgent;
    } else {
        priceTier = servicePricing.standard; // Default
    }
    
    // Calculate average price from min/max range
    const avgPrice = (priceTier.min + priceTier.max) / 2;
    let totalPrice;
    
    // Check if service is per-page or fixed price
    if (servicePricing.perPage) {
        // Per-page pricing: average price * page count
        totalPrice = avgPrice * pageCount;
    } else {
        // Fixed price services (data analysis, dissertation, content writing)
        if (selectedService === 'data-analysis' || selectedService === 'dissertation') {
            // These are project-based, use average price
            totalPrice = avgPrice;
        } else if (selectedService === 'content') {
            // Content writing is per article, use average price
            totalPrice = avgPrice;
        } else {
            totalPrice = avgPrice;
        }
    }
    
    // Round to 2 decimal places
    totalPrice = Math.round(totalPrice * 100) / 100;
    
    // Display the result with price range
    const minTotal = servicePricing.perPage ? priceTier.min * pageCount : priceTier.min;
    const maxTotal = servicePricing.perPage ? priceTier.max * pageCount : priceTier.max;
    quotePrice.textContent = `$${totalPrice.toFixed(2)}`;
    quotePrice.setAttribute('data-range', `$${minTotal.toFixed(0)} - $${maxTotal.toFixed(0)}`);
    
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
