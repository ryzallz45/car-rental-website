const VALIDATORS = {
    required: (v) => v ? '' : 'Wajib diisi.',
    minLength: (min) => (v) => v && v.length >= min ? '' : `Minimal ${min} karakter.`,
    maxLength: (max) => (v) => v && v.length <= max ? '' : `Maksimal ${max} karakter.`,
    email: (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Format email tidak valid.',
    phone: (v) => !v || /^[0-9]{10,15}$/.test(v.replace(/[\s\-\+]/g, '')) ? '' : 'Nomor telepon tidak valid (10-15 digit).',
    number: (v) => v === '' || !isNaN(v) ? '' : 'Harus berupa angka.',
    min: (min) => (v) => !v || parseFloat(v) >= min ? '' : `Minimal ${min}.`,
    positive: (v) => !v || parseFloat(v) > 0 ? '' : 'Harus lebih dari 0.',
    url: (v) => !v || /^https?:\/\/.+/.test(v) ? '' : 'URL tidak valid.',
    dateAfter: (refId) => (v, form) => {
        const ref = form ? form.querySelector(`#${refId}`) : null;
        if (!ref || !v || !ref.value) return '';
        return new Date(v) >= new Date(ref.value) ? '' : 'Harus setelah tanggal mulai.';
    },
};

function validateField(input) {
    const rules = input.dataset.validate;
    if (!rules) return '';
    const form = input.closest('form');
    const group = input.closest('.form-group');
    const errorEl = group ? group.querySelector('.form-error') : null;

    let msg = '';
    rules.split(',').forEach(rule => {
        if (msg) return;
        const [name, ...args] = rule.split(':');
        const validator = VALIDATORS[name];
        if (validator) {
            const fn = typeof validator === 'function' ? validator(...args) : validator;
            msg = fn(input.value, form);
        }
    });

    if (group) {
        group.classList.toggle('has-error', !!msg);
        if (errorEl) errorEl.textContent = msg;
    }
    return msg;
}

function initFieldValidation(form) {
    form.querySelectorAll('[data-validate]').forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            const group = input.closest('.form-group');
            if (group) {
                group.classList.remove('has-error');
                const errorEl = group.querySelector('.form-error');
                if (errorEl) errorEl.textContent = '';
            }
        });
        input.addEventListener('change', () => {
            if (input.value) validateField(input);
        });
    });
}

function validateForm(form) {
    let valid = true;
    form.querySelectorAll('[data-validate]').forEach(input => {
        const msg = validateField(input);
        if (msg) valid = false;
    });
    return valid;
}
