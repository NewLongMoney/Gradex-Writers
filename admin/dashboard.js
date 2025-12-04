// Firebase Authentication Check
let firebaseApp = null;
let auth = null;

// Initialize Firebase
async function initializeFirebase() {
    try {
        if (typeof firebase !== 'undefined' && typeof loadFirebaseConfig === 'function') {
            const config = await loadFirebaseConfig();
            if (config && config.apiKey) {
                firebaseApp = firebase.initializeApp(config);
                auth = firebase.auth();
                console.log('✅ Firebase initialized in dashboard');
            }
        }
    } catch (error) {
        console.log('Firebase not available or already initialized:', error);
    }
}

// Initialize Firebase then verify auth
initializeFirebase().then(() => {
    if (auth) {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                const newToken = await user.getIdToken();
                localStorage.setItem('adminToken', newToken);
                verifyAuth();
            } else {
                localStorage.removeItem('adminToken');
                localStorage.removeItem('adminUser');
                window.location.href = '/admin';
            }
        });
    } else {
        verifyAuth();
    }
});

// Verify token with backend
async function verifyAuth() {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        window.location.href = '/admin';
        return;
    }
    try {
        const response = await fetch('/api/auth/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token })
        });

        const data = await response.json();
        
        if (!data.success) {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
            window.location.href = '/admin';
        } else {
            // Set user name
            const user = JSON.parse(localStorage.getItem('adminUser'));
            document.getElementById('userName').textContent = user.displayName || user.email;
            loadArticles();
        }
    } catch (error) {
        console.error('Auth verification error:', error);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        window.location.href = '/admin';
    }
}

// DOM elements
const logoutBtn = document.getElementById('logoutBtn');
const newArticleBtn = document.getElementById('newArticleBtn');
const articleModal = document.getElementById('articleModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelBtn = document.getElementById('cancelBtn');
const articleForm = document.getElementById('articleForm');
const articlesContainer = document.getElementById('articlesContainer');

// Event listeners
logoutBtn.addEventListener('click', logout);
newArticleBtn.addEventListener('click', openNewArticleModal);
closeModalBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);
articleForm.addEventListener('submit', saveArticle);

// Functions
async function logout() {
    if (auth) {
        try {
            await auth.signOut();
        } catch (error) {
            console.error('Logout error:', error);
        }
    }
    
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = '/admin';
}

function openNewArticleModal() {
    document.getElementById('modalTitle').textContent = 'New Article';
    articleForm.reset();
    document.getElementById('articleId').value = '';
    articleModal.classList.add('show');
}

function openEditArticleModal(article) {
    document.getElementById('modalTitle').textContent = 'Edit Article';
    document.getElementById('articleId').value = article.id;
    document.getElementById('articleTitle').value = article.title;
    document.getElementById('articleExcerpt').value = article.excerpt || '';
    document.getElementById('articleContent').value = article.content;
    document.getElementById('articleCategory').value = article.category;
    document.getElementById('articleAuthor').value = article.author;
    document.getElementById('articleImage').value = article.image_url || '';
    document.getElementById('articleStatus').value = article.status;
    articleModal.classList.add('show');
}

function closeModal() {
    articleModal.classList.remove('show');
    articleForm.reset();
}

async function loadArticles() {
    try {
        const response = await fetch('/api/admin/articles', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        
        if (data.success) {
            displayArticles(data.articles);
        } else {
            articlesContainer.innerHTML = '<div class="no-articles">Failed to load articles</div>';
        }
    } catch (error) {
        console.error('Error loading articles:', error);
        articlesContainer.innerHTML = '<div class="no-articles">Error loading articles</div>';
    }
}

function displayArticles(articles) {
    if (articles.length === 0) {
        articlesContainer.innerHTML = '<div class="no-articles">No articles yet. Create your first article!</div>';
        return;
    }

    articlesContainer.innerHTML = articles.map(article => `
        <div class="article-card" data-id="${article.id}">
            <h3>${escapeHtml(article.title)}</h3>
            <div class="article-meta">
                <span>📁 ${escapeHtml(article.category)}</span>
                <span>✍️ ${escapeHtml(article.author)}</span>
            </div>
            <span class="article-status status-${article.status}">
                ${article.status === 'published' ? '✓ Published' : '📝 Draft'}
            </span>
            <div class="article-excerpt">
                ${escapeHtml(article.excerpt || article.content.substring(0, 150) + '...')}
            </div>
            <div class="article-meta">
                <span>📅 ${new Date(article.created_at).toLocaleDateString()}</span>
            </div>
            <div class="article-actions">
                <button class="btn-edit" onclick="editArticle(${article.id})">Edit</button>
                <button class="btn-delete" onclick="deleteArticle(${article.id}, '${escapeHtml(article.title).replace(/'/g, "\\'")}')">Delete</button>
            </div>
        </div>
    `).join('');
}

async function saveArticle(e) {
    e.preventDefault();
    
    const articleId = document.getElementById('articleId').value;
    const articleData = {
        title: document.getElementById('articleTitle').value,
        excerpt: document.getElementById('articleExcerpt').value,
        content: document.getElementById('articleContent').value,
        category: document.getElementById('articleCategory').value,
        author: document.getElementById('articleAuthor').value,
        image_url: document.getElementById('articleImage').value,
        status: document.getElementById('articleStatus').value
    };

    // Refresh token if using Firebase
    let currentToken = token;
    if (auth && auth.currentUser) {
        currentToken = await auth.currentUser.getIdToken(true);
        localStorage.setItem('adminToken', currentToken);
    }

    try {
        const url = articleId ? `/api/admin/articles/${articleId}` : '/api/admin/articles';
        const method = articleId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentToken}`
            },
            body: JSON.stringify(articleData)
        });

        const data = await response.json();
        
        if (data.success) {
            closeModal();
            loadArticles();
            alert(articleId ? 'Article updated successfully!' : 'Article created successfully!');
        } else {
            alert('Error: ' + data.error);
        }
    } catch (error) {
        console.error('Error saving article:', error);
        alert('Failed to save article. Please try again.');
    }
}

window.editArticle = function(id) {
    fetch(`/api/admin/articles`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(res => res.json())
    .then(data => {
        const article = data.articles.find(a => a.id === id);
        if (article) {
            openEditArticleModal(article);
        }
    });
}

window.deleteArticle = async function(id, title) {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
        return;
    }

    // Refresh token if using Firebase
    let currentToken = token;
    if (auth && auth.currentUser) {
        currentToken = await auth.currentUser.getIdToken(true);
        localStorage.setItem('adminToken', currentToken);
    }

    fetch(`/api/admin/articles/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${currentToken}`
        }
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            loadArticles();
            alert('Article deleted successfully!');
        } else {
            alert('Error: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Error deleting article:', error);
        alert('Failed to delete article. Please try again.');
    });
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Close modal when clicking outside
articleModal.addEventListener('click', function(e) {
    if (e.target === articleModal) {
        closeModal();
    }
});
