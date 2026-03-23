const API_URL = '/api/articles';

let allArticles = [];
let currentPage = 1;
const itemsPerPage = 6;
let currentFilters = {
    searchText: '',
    category: '',
    author: '',
    date: ''
};

// Éléments DOM
const articlesList = document.getElementById('articlesList');
const paginationControls = document.getElementById('paginationControls');
const articleForm = document.getElementById('articleForm');
const searchBtn = document.getElementById('searchBtn');
const resetBtn = document.getElementById('resetBtn');
const searchText = document.getElementById('searchText');
const filterCategory = document.getElementById('filterCategory');
const filterAuthor = document.getElementById('filterAuthor');
const filterDate = document.getElementById('filterDate');
const editModal = document.getElementById('editModal');
const editForm = document.getElementById('editForm');
const closeModal = document.querySelector('.close');
let chart;

// Toast helper
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? '✅' : (type === 'error' ? '❌' : 'ℹ️');
    toast.innerHTML = `<i>${icon}</i><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Fetch all articles
async function fetchArticles() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Erreur réseau');
        allArticles = await response.json();
        applyFilters();
        updateChart(allArticles);
    } catch (error) {
        showToast('Erreur lors du chargement des articles', 'error');
    }
}

// Apply search/filters
function applyFilters() {
    let filtered = [...allArticles];

    if (currentFilters.searchText) {
        const searchLower = currentFilters.searchText.toLowerCase();
        filtered = filtered.filter(article =>
            article.title.toLowerCase().includes(searchLower) ||
            (article.content && article.content.toLowerCase().includes(searchLower))
        );
    }
    if (currentFilters.category) {
        filtered = filtered.filter(article =>
            article.category && article.category.toLowerCase() === currentFilters.category.toLowerCase()
        );
    }
    if (currentFilters.author) {
        filtered = filtered.filter(article =>
            article.author.toLowerCase() === currentFilters.author.toLowerCase()
        );
    }
    if (currentFilters.date) {
        filtered = filtered.filter(article => article.date === currentFilters.date);
    }

    renderPaginated(filtered);
}

// Render paginated articles
function renderPaginated(articles) {
    const totalPages = Math.ceil(articles.length / itemsPerPage);
    if (currentPage > totalPages) currentPage = totalPages || 1;
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageArticles = articles.slice(start, end);

    displayArticles(pageArticles);
    renderPagination(totalPages, currentPage);
}

// Display articles as cards
function displayArticles(articles) {
    if (articles.length === 0) {
        articlesList.innerHTML = '<p class="no-articles">Aucun article trouvé.</p>';
        return;
    }
    articlesList.innerHTML = articles.map(article => `
        <div class="article-card">
            <h3>${escapeHtml(article.title)}</h3>
            <div class="meta">
                <span>✍️ ${escapeHtml(article.author)}</span>
                <span>📅 ${article.date}</span>
                ${article.category ? `<span>🏷️ ${escapeHtml(article.category)}</span>` : ''}
            </div>
            <div class="content">${escapeHtml(article.content || '')}</div>
            ${article.tags ? `
                <div class="tags">
                    ${article.tags.split(',').map(tag => `<span class="tag">${escapeHtml(tag.trim())}</span>`).join('')}
                </div>
            ` : ''}
            <div class="article-actions">
                <button class="btn-icon edit" data-id="${article.id}">✏️</button>
                <button class="btn-icon delete" data-id="${article.id}">🗑️</button>
            </div>
        </div>
    `).join('');

    // Attach event listeners to buttons
    document.querySelectorAll('.edit').forEach(btn => {
        btn.addEventListener('click', () => openEditModal(parseInt(btn.dataset.id)));
    });
    document.querySelectorAll('.delete').forEach(btn => {
        btn.addEventListener('click', () => deleteArticle(parseInt(btn.dataset.id)));
    });
}

// Render pagination buttons
function renderPagination(totalPages, current) {
    if (totalPages <= 1) {
        paginationControls.innerHTML = '';
        return;
    }
    let html = '<button class="page-btn" data-page="prev" ${current===1?"disabled":""}>‹</button>';
    for (let i = 1; i <= totalPages; i++) {
        html += `<button class="page-btn ${i === current ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }
    html += `<button class="page-btn" data-page="next" ${current===totalPages?"disabled":""}>›</button>`;
    paginationControls.innerHTML = html;

    paginationControls.querySelectorAll('.page-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const page = btn.dataset.page;
            if (page === 'prev' && currentPage > 1) currentPage--;
            else if (page === 'next' && currentPage < totalPages) currentPage++;
            else if (!isNaN(page)) currentPage = parseInt(page);
            applyFilters();
        });
    });
}

// Create article
articleForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value.trim();
    const content = document.getElementById('content').value.trim();
    const author = document.getElementById('author').value.trim();
    const category = document.getElementById('category').value.trim();
    const tags = document.getElementById('tags').value.trim();

    if (!title || !author) {
        showToast('Titre et auteur sont obligatoires', 'error');
        return;
    }

    const newArticle = { title, content, author, category, tags };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newArticle)
        });
        if (!response.ok) throw new Error('Erreur création');
        showToast('Article créé avec succès', 'success');
        articleForm.reset();
        fetchArticles();
    } catch (error) {
        showToast('Erreur lors de la création', 'error');
    }
});

// Delete article
async function deleteArticle(id) {
    if (!confirm('Voulez-vous vraiment supprimer cet article ?')) return;
    try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Erreur suppression');
        showToast('Article supprimé', 'success');
        fetchArticles();
    } catch (error) {
        showToast('Erreur lors de la suppression', 'error');
    }
}

// Open edit modal with article data
async function openEditModal(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error('Article non trouvé');
        const article = await response.json();
        document.getElementById('editId').value = article.id;
        document.getElementById('editTitle').value = article.title;
        document.getElementById('editContent').value = article.content || '';
        document.getElementById('editAuthor').value = article.author;
        document.getElementById('editCategory').value = article.category || '';
        document.getElementById('editTags').value = article.tags || '';
        editModal.style.display = 'block';
    } catch (error) {
        showToast('Erreur chargement article', 'error');
    }
}

// Update article
editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('editId').value;
    const title = document.getElementById('editTitle').value.trim();
    const content = document.getElementById('editContent').value.trim();
    const author = document.getElementById('editAuthor').value.trim();
    const category = document.getElementById('editCategory').value.trim();
    const tags = document.getElementById('editTags').value.trim();

    if (!title || !author) {
        showToast('Titre et auteur sont obligatoires', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content, author, category, tags })
        });
        if (!response.ok) throw new Error('Erreur mise à jour');
        showToast('Article mis à jour', 'success');
        editModal.style.display = 'none';
        fetchArticles();
    } catch (error) {
        showToast('Erreur lors de la mise à jour', 'error');
    }
});

// Close modal
closeModal.onclick = () => editModal.style.display = 'none';
window.onclick = (e) => {
    if (e.target === editModal) editModal.style.display = 'none';
};

// Search filters
searchBtn.addEventListener('click', () => {
    currentFilters.searchText = searchText.value.trim();
    currentFilters.category = filterCategory.value.trim();
    currentFilters.author = filterAuthor.value.trim();
    currentFilters.date = filterDate.value;
    currentPage = 1;
    applyFilters();
});

resetBtn.addEventListener('click', () => {
    searchText.value = '';
    filterCategory.value = '';
    filterAuthor.value = '';
    filterDate.value = '';
    currentFilters = { searchText: '', category: '', author: '', date: '' };
    currentPage = 1;
    applyFilters();
});

// Update chart with all articles
function updateChart(articles) {
    const categories = {};
    articles.forEach(article => {
        const cat = article.category || 'Sans catégorie';
        categories[cat] = (categories[cat] || 0) + 1;
    });
    const ctx = document.getElementById('categoryChart').getContext('2d');
    if (chart) chart.destroy();
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(categories),
            datasets: [{
                label: 'Nombre d\'articles',
                data: Object.values(categories),
                backgroundColor: 'rgba(67, 97, 238, 0.6)',
                borderColor: 'rgba(67, 97, 238, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { position: 'top' },
                tooltip: { callbacks: { label: (ctx) => `${ctx.raw} article(s)` } }
            }
        }
    });
}

// Helper to escape HTML
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// Initial load
fetchArticles();
