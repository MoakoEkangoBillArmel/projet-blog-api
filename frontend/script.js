const API_BASE = '/api/articles';

let allArticles = [];
let currentPage = 1;
const itemsPerPage = 5;
let activeFilters = {
    search: '',
    category: '',
    author: '',
    date: ''
};
let categoryChartInstance = null;

// DOM Elements
const articlesList = document.getElementById('articlesList');
const resultsCount = document.getElementById('resultsCount');
const paginationControls = document.getElementById('paginationControls');
const articleForm = document.getElementById('articleForm');
const searchText = document.getElementById('searchText');
const resetBtn = document.getElementById('resetBtn');
const filterCategory = document.getElementById('filterCategory');
const filterAuthor = document.getElementById('filterAuthor');
const filterDate = document.getElementById('filterDate');
const searchBtn = document.getElementById('searchBtn');

// KPIs
const kpiTotal = document.getElementById('kpiTotalArticles');
const kpiCat = document.getElementById('kpiCategories');
const kpiViews = document.getElementById('kpiViews');

// Modal Elements
const editModal = document.getElementById('editModal');
const editForm = document.getElementById('editForm');
const modalCloseBtn = document.querySelector('.modal-close-btn');
const modalCancel = document.querySelector('.modal-cancel');
const themeToggle = document.getElementById('themeToggle');

// Toast Notification
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? '✅' : (type === 'error' ? '❌' : 'ℹ️');
    toast.innerHTML = `<span>${icon}</span> <span>${escapeHtml(message)}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// Fetch Stats
async function fetchStats() {
    try {
        const res = await fetch(`${API_BASE}/stats/summary`);
        if (!res.ok) return;
        const stats = await res.json();
        if (kpiTotal) kpiTotal.textContent = stats.totalArticles;
        if (kpiCat) kpiCat.textContent = stats.categories.length;
        if (kpiViews) kpiViews.textContent = stats.totalViews;
        updateChart(stats.categories);
    } catch (e) {
        console.warn('Impossible de charger les statistiques:', e);
    }
}

// Fetch Articles
async function fetchArticles() {
    try {
        const res = await fetch(API_BASE);
        if (!res.ok) throw new Error('Erreur réseau');
        allArticles = await res.json();
        applyFilters();
        fetchStats();
    } catch (err) {
        showToast('Impossible de joindre le serveur API.', 'error');
        if (articlesList) {
            articlesList.innerHTML = `
                <div class="empty-state">
                    <p>⚠️ Serveur indisponible. Vérifiez que le backend Express est en cours d'exécution.</p>
                </div>
            `;
        }
    }
}

// Apply Filters
function applyFilters() {
    let filtered = [...allArticles];

    const q = activeFilters.search.toLowerCase().trim();
    if (q) {
        filtered = filtered.filter(a =>
            (a.title && a.title.toLowerCase().includes(q)) ||
            (a.content && a.content.toLowerCase().includes(q)) ||
            (a.tags && a.tags.toLowerCase().includes(q)) ||
            (a.author && a.author.toLowerCase().includes(q)) ||
            (a.category && a.category.toLowerCase().includes(q))
        );
    }

    if (activeFilters.category) {
        const cat = activeFilters.category.toLowerCase().trim();
        filtered = filtered.filter(a => a.category && a.category.toLowerCase().includes(cat));
    }

    if (activeFilters.author) {
        const aut = activeFilters.author.toLowerCase().trim();
        filtered = filtered.filter(a => a.author && a.author.toLowerCase().includes(aut));
    }

    if (activeFilters.date) {
        filtered = filtered.filter(a => a.date === activeFilters.date);
    }

    resultsCount.textContent = `${filtered.length} article(s) trouvé(s)`;
    renderPaginated(filtered);
}

// Pagination
function renderPaginated(articles) {
    const totalPages = Math.ceil(articles.length / itemsPerPage);
    if (currentPage > totalPages) currentPage = totalPages || 1;

    const start = (currentPage - 1) * itemsPerPage;
    const pageArticles = articles.slice(start, start + itemsPerPage);

    renderArticles(pageArticles);
    renderPaginationButtons(totalPages);
}

// Render Article Cards
function renderArticles(articles) {
    if (!articles || articles.length === 0) {
        articlesList.innerHTML = `
            <div style="padding: 40px; text-align: center; color: var(--text-muted);">
                <p style="font-size: 32px; margin-bottom: 8px;">📭</p>
                <p>Aucun article ne correspond à votre recherche.</p>
            </div>
        `;
        return;
    }

    articlesList.innerHTML = articles.map(a => `
        <article class="article-item" data-id="${a.id}">
            <div class="article-top">
                <div>
                    <h3 class="article-title">${escapeHtml(a.title)}</h3>
                    <div class="article-meta">
                        <span>👤 <strong>${escapeHtml(a.author)}</strong></span>
                        <span>📅 ${a.date}</span>
                        <span class="meta-chip">🏷️ ${escapeHtml(a.category || 'Général')}</span>
                        <span>⏱️ ${a.read_time || 1} min</span>
                        <span>👁️ ${a.views || 0} vues</span>
                    </div>
                </div>
                <div class="article-actions">
                    <button class="btn-icon edit-btn" data-id="${a.id}" title="Modifier">✏️ Éditer</button>
                    <button class="btn-icon delete delete-btn" data-id="${a.id}" title="Supprimer">🗑️</button>
                </div>
            </div>
            ${a.content ? `<div class="article-body">${escapeHtml(a.content)}</div>` : ''}
            ${a.tags ? `
                <div class="article-tags">
                    ${a.tags.split(',').filter(t => t.trim()).map(t => `<span class="tag-item">#${escapeHtml(t.trim())}</span>`).join('')}
                </div>
            ` : ''}
        </article>
    `).join('');

    // Attach listeners
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => openEditModal(btn.dataset.id));
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => handleDelete(btn.dataset.id));
    });
}

// Pagination Controls
function renderPaginationButtons(totalPages) {
    if (totalPages <= 1) {
        paginationControls.innerHTML = '';
        return;
    }

    let html = `<button class="page-btn" data-action="prev" ${currentPage === 1 ? 'disabled' : ''}>←</button>`;
    for (let i = 1; i <= totalPages; i++) {
        html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }
    html += `<button class="page-btn" data-action="next" ${currentPage === totalPages ? 'disabled' : ''}>→</button>`;

    paginationControls.innerHTML = html;

    paginationControls.querySelectorAll('.page-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.dataset.action === 'prev' && currentPage > 1) currentPage--;
            else if (btn.dataset.action === 'next' && currentPage < totalPages) currentPage++;
            else if (btn.dataset.page) currentPage = parseInt(btn.dataset.page, 10);
            applyFilters();
        });
    });
}

// Handle Form Submission (Create)
articleForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value.trim();
    const author = document.getElementById('author').value.trim();
    const category = document.getElementById('category').value.trim();
    const tags = document.getElementById('tags').value.trim();
    const content = document.getElementById('content').value.trim();

    if (!title || !author) {
        showToast('Titre et auteur sont requis.', 'error');
        return;
    }

    try {
        const res = await fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, author, category, tags, content })
        });

        if (!res.ok) throw new Error('Échec de la publication');
        showToast('Article publié avec succès !', 'success');
        articleForm.reset();
        document.getElementById('category').value = 'Technologie';
        fetchArticles();
    } catch (err) {
        showToast(err.message, 'error');
    }
});

// Handle Delete
async function handleDelete(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return;

    try {
        const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Échec de la suppression');
        showToast('Article supprimé.', 'success');
        fetchArticles();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

// Edit Modal Handling
async function openEditModal(id) {
    try {
        const res = await fetch(`${API_BASE}/${id}`);
        if (!res.ok) throw new Error('Article non trouvé');
        const article = await res.json();

        document.getElementById('editId').value = article.id;
        document.getElementById('editTitle').value = article.title;
        document.getElementById('editAuthor').value = article.author;
        document.getElementById('editCategory').value = article.category || '';
        document.getElementById('editTags').value = article.tags || '';
        document.getElementById('editContent').value = article.content || '';

        editModal.classList.add('active');
    } catch (err) {
        showToast(err.message, 'error');
    }
}

function closeEditModal() {
    editModal.classList.remove('active');
}

modalCloseBtn.onclick = closeEditModal;
modalCancel.onclick = closeEditModal;
editModal.querySelector('.modal-backdrop').onclick = closeEditModal;

editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('editId').value;
    const title = document.getElementById('editTitle').value.trim();
    const author = document.getElementById('editAuthor').value.trim();
    const category = document.getElementById('editCategory').value.trim();
    const tags = document.getElementById('editTags').value.trim();
    const content = document.getElementById('editContent').value.trim();

    try {
        const res = await fetch(`${API_BASE}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, author, category, tags, content })
        });
        if (!res.ok) throw new Error('Échec de la mise à jour');
        showToast('Article mis à jour avec succès.', 'success');
        closeEditModal();
        fetchArticles();
    } catch (err) {
        showToast(err.message, 'error');
    }
});

// Search & Filter Events
let debounceTimeout;
searchText.addEventListener('input', () => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
        activeFilters.search = searchText.value;
        currentPage = 1;
        applyFilters();
    }, 200);
});

searchBtn.addEventListener('click', () => {
    activeFilters.category = filterCategory.value;
    activeFilters.author = filterAuthor.value;
    activeFilters.date = filterDate.value;
    currentPage = 1;
    applyFilters();
});

resetBtn.addEventListener('click', () => {
    searchText.value = '';
    filterCategory.value = '';
    filterAuthor.value = '';
    filterDate.value = '';
    activeFilters = { search: '', category: '', author: '', date: '' };
    currentPage = 1;
    applyFilters();
});

// Chart.js Category Distribution
function updateChart(categoriesData) {
    const ctx = document.getElementById('categoryChart');
    if (!ctx) return;

    const labels = categoriesData.map(c => c.category || 'Général');
    const data = categoriesData.map(c => c.count);

    if (categoryChartInstance) {
        categoryChartInstance.destroy();
    }

    categoryChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: [
                    '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#6366f1'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#94a3b8', boxWidth: 12, padding: 12 }
                }
            }
        }
    });
}

// Theme Toggle
themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
});

// HTML escaping helper
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Init
fetchArticles();
