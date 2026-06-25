const isLaravelServer = window.location.protocol !== 'file:';
const storedBase = localStorage.getItem('apiBase');
const API_BASE = storedBase || (isLaravelServer ? window.location.origin : '');
const USE_API = !!API_BASE;
let apiToken = localStorage.getItem('apiToken') || '';

function apiHeaders(extra = {}) {
    const headers = { 'Content-Type': 'application/json', ...extra };
    if (apiToken) headers['Authorization'] = `Bearer ${apiToken}`;
    return headers;
}

async function apiGetRaw(endpoint) {
    const res = await fetch(`${API_BASE}/api${endpoint}`, { headers: apiHeaders() });
    if (res.status === 204) return null;
    if (!res.ok) {
        const msg = await res.json().catch(() => ({}));
        throw new Error(msg.message || `HTTP ${res.status}`);
    }
    return await res.json();
}

async function apiGet(endpoint) {
    const res = await fetch(`${API_BASE}/api${endpoint}`, { headers: apiHeaders() });
    if (res.status === 204) return null;
    if (!res.ok) {
        const msg = await res.json().catch(() => ({}));
        throw new Error(msg.message || `HTTP ${res.status}`);
    }
    const json = await res.json();
    return json.data || json;
}

async function apiPost(endpoint, body) {
    const res = await fetch(`${API_BASE}/api${endpoint}`, {
        method: 'POST', headers: apiHeaders(), body: JSON.stringify(body),
    });
    if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        if (json.errors) showFieldErrors(json.errors);
        throw new Error(json.message || `HTTP ${res.status}`);
    }
    return await res.json();
}

async function apiPut(endpoint, body) {
    const res = await fetch(`${API_BASE}/api${endpoint}`, {
        method: 'PUT', headers: apiHeaders(), body: JSON.stringify(body),
    });
    if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        if (json.errors) showFieldErrors(json.errors);
        throw new Error(json.message || `HTTP ${res.status}`);
    }
    return await res.json();
}

async function apiPostMultipart(endpoint, formData) {
    const headers = {};
    if (apiToken) headers['Authorization'] = `Bearer ${apiToken}`;
    const res = await fetch(`${API_BASE}/api${endpoint}`, {
        method: 'POST', headers, body: formData,
    });
    if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        if (json.errors) showFieldErrors(json.errors);
        throw new Error(json.message || `HTTP ${res.status}`);
    }
    return await res.json();
}

async function apiPutMultipart(endpoint, formData) {
    const headers = {};
    if (apiToken) headers['Authorization'] = `Bearer ${apiToken}`;
    formData.append('_method', 'PUT');
    const res = await fetch(`${API_BASE}/api${endpoint}`, {
        method: 'POST', headers, body: formData,
    });
    if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        if (json.errors) showFieldErrors(json.errors);
        throw new Error(json.message || `HTTP ${res.status}`);
    }
    return await res.json();
}

async function apiDelete(endpoint) {
    const res = await fetch(`${API_BASE}/api${endpoint}`, {
        method: 'DELETE', headers: apiHeaders(),
    });
    if (!res.ok) {
        const msg = await res.json().catch(() => ({}));
        throw new Error(msg.message || `HTTP ${res.status}`);
    }
}

async function apiLogin(email, password) {
    const res = await fetch(`${API_BASE}/api/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Login gagal');
    return json.data;
}

function initApiConfig() {
    const input = document.getElementById('apiBaseUrl');
    const form = document.getElementById('apiConfigForm');
    if (!input || !form) return;

    input.value = API_BASE;

    const statusEl = document.createElement('p');
    statusEl.style.cssText = 'margin-top:12px;font-size:0.9rem;';
    if (USE_API) {
        const mode = isLaravelServer ? 'Laravel Built-in Server' : 'External Server';
        statusEl.innerHTML = apiToken
            ? `<span style="color:var(--success);">Terhubung ke API (${mode}) &#10003;</span>`
            : `<span style="color:var(--warning);">Mode API aktif (${mode}), tapi belum login ke admin</span>`;
    } else {
        statusEl.innerHTML = '<span style="color:var(--text-light);">Mode localStorage (offline)</span>';
    }
    form.after(statusEl);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const url = input.value.trim().replace(/\/+$/, '');
        if (url) {
            localStorage.setItem('apiBase', url);
            if (apiToken) localStorage.setItem('apiToken', apiToken);
            showToast('Refresh halaman untuk menggunakan backend.', 'success', 'API URL Disimpan');
        } else {
            localStorage.removeItem('apiBase');
            localStorage.removeItem('apiToken');
            apiToken = '';
            showToast('Refresh halaman untuk menggunakan data lokal.', 'info', 'Mode Lokal');
        }
    });
}
