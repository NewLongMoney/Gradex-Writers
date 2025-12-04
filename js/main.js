// Quote Calculator Logic
document.addEventListener('DOMContentLoaded', function() {
    const academicLevel = document.getElementById('academic-level');
    const pages = document.getElementById('pages');
    const urgency = document.getElementById('urgency');
    const complexity = document.getElementById('complexity');
    const estimatedCost = document.getElementById('estimated-cost');

    // Base pricing per level (per page)
    const basePricing = {
        highschool: { min: 5, max: 10 },
        college: { min: 10, max: 20 },
        masters: { min: 20, max: 40 },
        phd: { min: 40, max: 80 },
        business: { min: 30, max: 100 }, // per project
        'training-beginner': {
            fixedPrice: 40,
            isTraining: true
        },
        'training-intermediate': {
            fixedPrice: 80,
            isTraining: true
        },
        'training-advanced': {
            fixedPrice: 120,
            isTraining: true
        }
    };

    // Urgency multipliers
    const urgencyMultipliers = {
        standard: 1.0,
        express: 1.2,
        urgent: 1.5
    };

    // Complexity multipliers
    const complexityMultipliers = {
        simple: 1.0,
        moderate: 1.2,
        complex: 1.5
    };

    function calculateQuote() {
        const level = academicLevel.value;
        const pageCount = parseInt(pages.value) || 1;
        const urgencyMultiplier = urgencyMultipliers[urgency.value];
        const complexityMultiplier = complexityMultipliers[complexity.value];

        const servicePricing = basePricing[level];

        // Handle training packages with fixed prices
        if (servicePricing.isTraining && servicePricing.fixedPrice !== undefined) {
            const totalPrice = servicePricing.fixedPrice;
            estimatedCost.textContent = Math.round(totalPrice);
            return;
        }

        let basePrice;
        let totalPrice;

        if (level === 'business') {
            // Business documents are priced per project
            basePrice = (basePricing.business.min + basePricing.business.max) / 2;
            totalPrice = basePrice * urgencyMultiplier * complexityMultiplier;
        } else {
            // Academic writing is priced per page
            const pricing = basePricing[level];
            basePrice = (pricing.min + pricing.max) / 2;
            totalPrice = basePrice * pageCount * urgencyMultiplier * complexityMultiplier;
        }

        // Round to 2 decimal places
        estimatedCost.textContent = Math.round(totalPrice);
    }

    // Add event listeners
    academicLevel.addEventListener('change', calculateQuote);
    pages.addEventListener('input', calculateQuote);
    urgency.addEventListener('change', calculateQuote);
    complexity.addEventListener('change', calculateQuote);

    // Calculate initial quote
    calculateQuote();

    // Smooth scrolling for anchor links
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

    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '100%';
            navLinks.style.left = '0';
            navLinks.style.width = '100%';
            navLinks.style.background = 'var(--deep-blue)';
            navLinks.style.padding = '1rem';
            navLinks.style.boxShadow = '0 5px 10px rgba(0,0,0,0.3)';
        });
    }

    // Update pages input when business or training is selected
    academicLevel.addEventListener('change', function() {
        const selectedPricing = basePricing[this.value];
        if (this.value === 'business') {
            pages.value = 1;
            pages.disabled = true;
            pages.title = 'Business documents are priced per project';
        } else if (selectedPricing && selectedPricing.isTraining) {
            pages.value = 1;
            pages.disabled = true;
            pages.title = 'Training packages have fixed prices';
        } else {
            pages.disabled = false;
            pages.title = '';
        }
        calculateQuote();
    });

    // Initialize: disable pages if business or training is selected
    const initialPricing = basePricing[academicLevel.value];
    if (academicLevel.value === 'business' || (initialPricing && initialPricing.isTraining)) {
        pages.disabled = true;
        pages.title = academicLevel.value === 'business' ? 'Business documents are priced per project' : 'Training packages have fixed prices';
    }

    // Collapsible sections
    const collapsibleHeaders = document.querySelectorAll('.collapsible-header');
    collapsibleHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const content = document.getElementById(targetId);
            const isCollapsed = content.classList.contains('collapsed');
            
            if (isCollapsed) {
                content.classList.remove('collapsed');
                this.classList.add('active');
            } else {
                content.classList.add('collapsed');
                this.classList.remove('active');
            }
        });
    });
});

// Add scroll effect to navbar
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
    }
});

// Animate stats on scroll
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                animateValue(stat);
            });
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const trustSection = document.querySelector('.trust-stats');
if (trustSection) {
    observer.observe(trustSection);
}

function animateValue(element) {
    const text = element.textContent;
    const isPercentage = text.includes('%');
    const isPlus = text.includes('+');
    const isSlash = text.includes('/');
    
    let target;
    if (isPercentage) {
        target = parseInt(text.replace('%', ''));
    } else if (isPlus) {
        target = parseInt(text.replace('+', '').replace(/,/g, ''));
    } else if (isSlash) {
        return; // Don't animate "24/7"
    } else {
        target = parseInt(text.replace(/,/g, ''));
    }
    
    let current = 0;
    const increment = target / 50;
    const duration = 1000;
    const stepTime = duration / 50;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = text; // Restore original text
            clearInterval(timer);
        } else {
            if (isPercentage) {
                element.textContent = Math.floor(current) + '%';
            } else if (isPlus) {
                element.textContent = Math.floor(current).toLocaleString() + '+';
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
        }
    }, stepTime);
}

