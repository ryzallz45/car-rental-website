function showToast(message, type = 'info', title = '') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', warning: 'fa-exclamation-triangle', info: 'fa-info-circle' };
    const titles = { success: 'Berhasil', error: 'Gagal', warning: 'Peringatan', info: 'Informasi' };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas ${icons[type] || icons.info} toast-icon"></i>
        <div class="toast-body">
            <div class="toast-title">${title || titles[type] || ''}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close">&times;</button>
    `;

    toast.querySelector('.toast-close').addEventListener('click', () => removeToast(toast));
    container.appendChild(toast);
    setTimeout(() => removeToast(toast), 4000);
}

function removeToast(toast) {
    if (toast.classList.contains('removing')) return;
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
}

function formatDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatPrice(num) {
    return 'Rp ' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function getNextId(arr) {
    return arr.length ? Math.max(...arr.map(i => i.id)) + 1 : 1;
}

function setLoading(btn, loading, text) {
    if (loading) {
        btn.disabled = true;
        btn.classList.add('btn-loading');
        if (!btn.querySelector('.spinner')) {
            btn.insertAdjacentHTML('afterbegin', '<span class="spinner"></span>');
        }
        const span = btn.querySelector('.btn-text') || document.createElement('span');
        if (!btn.querySelector('.btn-text')) {
            span.className = 'btn-text';
            span.textContent = btn.textContent;
            btn.textContent = '';
            btn.appendChild(span);
        }
    } else {
        btn.disabled = false;
        btn.classList.remove('btn-loading');
        const spinner = btn.querySelector('.spinner');
        if (spinner) spinner.remove();
        const span = btn.querySelector('.btn-text');
        if (span) {
            btn.textContent = span.textContent;
            span.remove();
        }
    }
}

let loadingCount = 0;

function showCarsLoading() {
    const grid = document.getElementById('carsGrid');
    loadingCount++;
    grid.innerHTML = `
        <div class="skeleton-grid" id="carsSkeleton">
            ${Array(6).fill(`
                <div class="skeleton-card">
                    <div class="skeleton-image"></div>
                    <div class="skeleton-body">
                        <div class="skeleton-line skeleton-line-sm"></div>
                        <div class="skeleton-line"></div>
                        <div class="skeleton-line skeleton-line-xs"></div>
                    </div>
                </div>
            `).join('')}
        </div>`;
}

function hideCarsLoading() {
    loadingCount = Math.max(0, loadingCount - 1);
}

function showFieldErrors(errors) {
    document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
    document.querySelectorAll('.form-group.has-error').forEach(el => el.classList.remove('has-error'));

    if (!errors || typeof errors !== 'object') return;
    Object.entries(errors).forEach(([field, messages]) => {
        const input = document.querySelector(`[name="${field}"], #${field}`);
        if (!input) return;
        const group = input.closest('.form-group');
        if (!group) return;
        group.classList.add('has-error');
        const errorEl = group.querySelector('.form-error') || (() => {
            const el = document.createElement('div');
            el.className = 'form-error';
            group.appendChild(el);
            return el;
        })();
        errorEl.textContent = Array.isArray(messages) ? messages[0] : messages;
    });
}

function clearFieldErrors() {
    document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
    document.querySelectorAll('.form-group.has-error').forEach(el => el.classList.remove('has-error'));
}
