let allArticles = [];
let currentCategory = 'all';

// Load articles on page load
document.addEventListener('DOMContentLoaded', function() {
    loadArticles();
    setupFilters();
    setupModal();
    setupMobileMenu();
});

async function loadArticles() {
    const blogGrid = document.getElementById('blogGrid');
    
    try {
        const response = await fetch('/api/articles');
        const data = await response.json();
        
        if (data.success) {
            allArticles = data.articles;
            displayArticles(allArticles);
        } else {
            blogGrid.innerHTML = '<div class="no-articles"><h3>Failed to load articles</h3></div>';
        }
    } catch (error) {
        console.error('Error loading articles:', error);
        blogGrid.innerHTML = '<div class="no-articles"><h3>Error loading articles</h3><p>Please try again later</p></div>';
    }
}

function displayArticles(articles) {
    const blogGrid = document.getElementById('blogGrid');
    
    if (articles.length === 0) {
        blogGrid.innerHTML = '<div class="no-articles"><h3>No articles found</h3><p>Check back soon for new content!</p></div>';
        return;
    }

    blogGrid.innerHTML = articles.map(article => `
        <div class="blog-card" data-slug="${article.slug}">
            <div class="blog-card-image">
                ${article.image_url ? `<img src="${article.image_url}" alt="${escapeHtml(article.title)}">` : '📝'}
            </div>
            <div class="blog-card-content">
                <span class="blog-card-category">${escapeHtml(article.category)}</span>
                <h2 class="blog-card-title">${escapeHtml(article.title)}</h2>
                <p class="blog-card-excerpt">${escapeHtml(article.excerpt || article.content.substring(0, 150))}...</p>
                <div class="blog-card-meta">
                    <div class="blog-card-author">
                        <span>✍️ ${escapeHtml(article.author)}</span>
                    </div>
                    <div class="blog-card-date">
                        <span>${formatDate(article.created_at)}</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    // Add click event to each card
    document.querySelectorAll('.blog-card').forEach(card => {
        card.addEventListener('click', function() {
            const slug = this.dataset.slug;
            openArticle(slug);
        });
    });
}

function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter articles
            const category = this.dataset.category;
            currentCategory = category;
            
            if (category === 'all') {
                displayArticles(allArticles);
            } else {
                const filtered = allArticles.filter(article => article.category === category);
                displayArticles(filtered);
            }
        });
    });
}

function setupModal() {
    const modal = document.getElementById('articleModal');
    const closeBtn = document.getElementById('closeArticle');
    
    closeBtn.addEventListener('click', closeArticleModal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeArticleModal();
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeArticleModal();
        }
    });
}

async function openArticle(slug) {
    const modal = document.getElementById('articleModal');
    const content = document.getElementById('articleDetailContent');
    
    // Show modal with loading state
    modal.classList.add('show');
    content.innerHTML = '<div class="loading">Loading article...</div>';
    
    try {
        const response = await fetch(`/api/articles/${slug}`);
        const data = await response.json();
        
        if (data.success) {
            const article = data.article;
            content.innerHTML = `
                <div class="article-detail-image">
                    ${article.image_url ? `<img src="${article.image_url}" alt="${escapeHtml(article.title)}">` : '📝'}
                </div>
                <div class="article-detail-content">
                    <span class="article-detail-category">${escapeHtml(article.category)}</span>
                    <h1 class="article-detail-title">${escapeHtml(article.title)}</h1>
                    <div class="article-detail-meta">
                        <div>✍️ ${escapeHtml(article.author)}</div>
                        <div>📅 ${formatDate(article.created_at)}</div>
                    </div>
                    <div class="article-detail-text">${escapeHtml(article.content)}</div>
                </div>
            `;
            
            // Update URL without reloading
            history.pushState({ slug }, '', `/blog.html?article=${slug}`);
        } else {
            content.innerHTML = '<div class="no-articles"><h3>Article not found</h3></div>';
        }
    } catch (error) {
        console.error('Error loading article:', error);
        content.innerHTML = '<div class="no-articles"><h3>Error loading article</h3></div>';
    }
}

function closeArticleModal() {
    const modal = document.getElementById('articleModal');
    modal.classList.remove('show');
    
    // Reset URL
    history.pushState({}, '', '/blog.html');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
}

// Mobile menu toggle
function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            if (navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
            } else {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'var(--deep-blue)';
                navLinks.style.padding = '1rem';
                navLinks.style.boxShadow = '0 5px 10px rgba(0,0,0,0.3)';
            }
        });
    }
}

// Handle browser back/forward
window.addEventListener('popstate', function(e) {
    if (e.state && e.state.slug) {
        openArticle(e.state.slug);
    } else {
        closeArticleModal();
    }
});

// Check URL on load for direct article link
const urlParams = new URLSearchParams(window.location.search);
const articleSlug = urlParams.get('article');
if (articleSlug) {
    // Wait for articles to load first
    setTimeout(() => {
        openArticle(articleSlug);
    }, 500);
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="/#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        window.location.href = href;
    });
});

