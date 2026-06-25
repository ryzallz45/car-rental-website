async function initAdminLogin() {
    const promptDiv = document.getElementById('adminLoginPrompt');
    const panelDiv = document.getElementById('adminPanel');
    let userRole = localStorage.getItem('userRole') || '';

    if (apiToken && !userRole && USE_API) {
        try {
            const userData = await apiGet('/user');
            userRole = userData.role || '';
            if (userRole) localStorage.setItem('userRole', userRole);
        } catch {}
    }

    const showAdmin = apiToken && userRole === 'admin';

    if (showAdmin) {
        promptDiv.style.display = 'none';
        panelDiv.style.display = 'block';
    } else if (apiToken && userRole === 'customer') {
        promptDiv.style.display = 'block';
        panelDiv.style.display = 'none';
        promptDiv.querySelector('.admin-login-box').innerHTML = `
            <i class="fas fa-user" style="font-size:3rem;color:var(--text-light);margin-bottom:16px;"></i>
            <h3>Akun Customer</h3>
            <p style="color:var(--text-light);margin-bottom:20px;">Anda login sebagai customer. Hanya admin yang dapat mengakses panel ini.</p>
            <button class="btn btn-outline" id="customerBackBtn" style="color:var(--text);border-color:var(--border);margin-bottom:12px;">
                <i class="fas fa-arrow-left"></i> Kembali ke Beranda
            </button>
            <button class="btn btn-danger" id="customerLogoutBtn">
                <i class="fas fa-sign-out-alt"></i> Logout
            </button>
        `;
        document.getElementById('customerBackBtn').addEventListener('click', () => {
            window.location.href = '/';
        });
        document.getElementById('customerLogoutBtn').addEventListener('click', async () => {
            if (USE_API && apiToken) {
                try { await apiPost('/logout'); } catch {}
            }
            apiToken = '';
            localStorage.removeItem('apiToken');
            localStorage.removeItem('userRole');
            window.location.href = '/';
        });
    } else {
        promptDiv.style.display = 'block';
        panelDiv.style.display = 'none';
    }

    document.getElementById('adminLogout').addEventListener('click', async () => {
        if (USE_API && apiToken) {
            try { await apiPost('/logout'); } catch {}
            apiToken = '';
            localStorage.removeItem('apiToken');
            localStorage.removeItem('userRole');
        }
        promptDiv.style.display = 'block';
        panelDiv.style.display = 'none';
    });
}

function initAdminTab() {
    const tabs = document.querySelectorAll('.admin-tab:not(.btn-logout)');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
            const target = document.getElementById(`tab-${tab.dataset.tab}`);
            if (target) target.classList.add('active');
        });
    });
}

function renderAdminBookings() {
    const tbody = document.getElementById('bookingsTableBody');

    if (!bookings.length) {
        tbody.innerHTML = '<tr><td colspan="8" class="no-data">Belum ada booking.</td></tr>';
        return;
    }

    tbody.innerHTML = bookings.slice().reverse().map(b => `
        <tr>
            <td>#${b.id}</td>
            <td>${b.carName}</td>
            <td>${b.customerName}</td>
            <td>${b.phone}</td>
            <td>${b.startDate} s/d ${b.endDate}</td>
            <td>${formatPrice(b.totalPrice)}</td>
            <td><span class="status-badge ${b.status}">${b.status}</span></td>
            <td>
                <div class="action-btns">
                    ${b.status === 'confirmed' ? `
                        <button class="action-btn complete" onclick="updateBookingStatus(${b.id}, 'completed')" title="Selesai">
                            <i class="fas fa-check"></i>
                        </button>
                        <button class="action-btn cancel" onclick="updateBookingStatus(${b.id}, 'cancelled')" title="Batal">
                            <i class="fas fa-times"></i>
                        </button>
                    ` : ''}
                    ${b.status === 'pending' ? `
                        <button class="action-btn confirm" onclick="updateBookingStatus(${b.id}, 'confirmed')" title="Konfirmasi">
                            <i class="fas fa-check"></i>
                        </button>
                        <button class="action-btn cancel" onclick="updateBookingStatus(${b.id}, 'cancelled')" title="Batal">
                            <i class="fas fa-times"></i>
                        </button>
                    ` : ''}
                    <button class="action-btn edit" onclick="editBooking(${b.id})" title="Edit">
                        <i class="fas fa-pen"></i>
                    </button>
                    <button class="action-btn delete" onclick="confirmDeleteBooking(${b.id})" title="Hapus">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

async function searchBookings() {
    const input = document.getElementById('bookingSearchInput');
    const query = input.value.trim();

    if (USE_API) {
        const params = new URLSearchParams();
        params.set('per_page', bookingsPagination.perPage);
        params.set('page', 1);
        if (query) params.set('search', query);
        try {
            const bRes = await apiGetRaw('/bookings?' + params.toString());
            bookings = bRes.data || [];
            bookingsPagination.currentPage = bRes.current_page || 1;
            bookingsPagination.lastPage = bRes.last_page || 1;
            bookingsPagination.total = bRes.total || 0;
        } catch {
            showToast('Gagal mencari booking.', 'error');
            return;
        }
    } else {
        bookings = allBookings.filter(b =>
            !query ||
            (b.customerName || b.customer_name || '').toLowerCase().includes(query.toLowerCase()) ||
            (b.email || '').toLowerCase().includes(query.toLowerCase()) ||
            (b.phone || '').includes(query)
        );
    }
    renderAdminBookings();
}

let allBookings = [];

async function updateBookingStatus(id, status) {
    if (USE_API) {
        try {
            await apiPut(`/bookings/${id}/status`, { status });
            await refreshBookings();
        } catch (err) {
            showToast(err.message, 'error', 'Gagal Update Status');
            return;
        }
    } else {
        const booking = bookings.find(b => b.id === id);
        if (booking) booking.status = status;
        saveBookings();
    }
    renderAdminBookings();
    showToast('Status booking berhasil diperbarui.', 'success');
}

function confirmDeleteBooking(id) {
    document.getElementById('deleteModalMessage').textContent =
        'Apakah Anda yakin ingin menghapus booking #' + id + '?';
    document.getElementById('confirmDelete').onclick = async () => {
        if (USE_API) {
            try {
                await apiDelete(`/bookings/${id}`);
                await refreshBookings();
            } catch (err) {
                showToast(err.message, 'error', 'Gagal Hapus');
                return;
            }
        } else {
            bookings = bookings.filter(b => b.id !== id);
            saveBookings();
        }
        renderAdminBookings();
        document.getElementById('deleteModal').classList.remove('active');
        showToast('Booking berhasil dihapus.', 'success');
    };
    document.getElementById('deleteModal').classList.add('active');
}

function renderAdminCars() {
    const tbody = document.getElementById('carsTableBody');

    tbody.innerHTML = cars.map(c => `
        <tr>
            <td>${c.id}</td>
            <td>${c.name}</td>
            <td>${c.category}</td>
            <td>${formatPrice(c.price)}</td>
            <td>${c.transmission}</td>
            <td>${c.seats}</td>
            <td>
                <label class="toggle-switch" title="${c.available ? 'Klik untuk nonaktifkan' : 'Klik untuk aktifkan'}">
                    <input type="checkbox" ${c.available ? 'checked' : ''} onchange="toggleCarAvailable(${c.id}, this.checked)">
                    <span class="toggle-slider"></span>
                </label>
            </td>
            <td>
                <div class="action-btns">
                    <button class="action-btn edit" onclick="editCar(${c.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="confirmDeleteCar(${c.id})" title="Hapus">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

async function toggleCarAvailable(id, available) {
    if (USE_API) {
        try {
            await apiPut(`/cars/${id}`, { available });
            const pRes = await apiGetRaw(`/cars?per_page=${carsPagination.perPage}&page=${carsPagination.currentPage}`).catch(() => ({}));
            if (pRes.data) {
                cars = pRes.data;
                carsPagination.currentPage = pRes.current_page || 1;
                carsPagination.lastPage = pRes.last_page || 1;
                carsPagination.total = pRes.total || 0;
            }
        } catch (err) {
            showToast(err.message, 'error', 'Gagal Update');
            renderAdminCars();
            return;
        }
    } else {
        const car = cars.find(c => c.id === id);
        if (car) car.available = available;
        saveCars();
    }
    renderCars();
    renderAdminCars();
    populateBookingCarSelect();
    showToast(available ? 'Mobil tersedia' : 'Mobil tidak tersedia', 'success');
}

function renderDashboard() {
    const grid = document.getElementById('statsGrid');
    const statusChart = document.getElementById('statsStatusChart');
    const revenueChart = document.getElementById('statsRevenueChart');
    const recentEl = document.getElementById('statsRecentBookings');
    if (!grid) return;

    if (USE_API && apiToken) {
        apiGetRaw('/stats').then(statsRes => {
            const stats = statsRes.data || statsRes;
            renderStatsCards(grid, stats);
            renderStatusChart(statusChart, stats.bookings_by_status || {});
            renderRevenueChart(revenueChart, stats.monthly_revenue || []);
            renderRecentBookings(recentEl, stats.recent_bookings || []);
        }).catch(() => {
            grid.innerHTML = '<div class="no-data">Gagal memuat statistik.</div>';
        });
    } else {
        const totalCars = cars.length;
        const totalBookings = bookings.length;
        const totalRevenue = bookings
            .filter(b => b.status === 'confirmed' || b.status === 'completed')
            .reduce((sum, b) => sum + (b.totalPrice || b.total_price || 0), 0);
        const byStatus = {};
        bookings.forEach(b => { byStatus[b.status] = (byStatus[b.status] || 0) + 1; });
        const recent = [...bookings].reverse().slice(0, 5);

        renderStatsCards(grid, { total_cars: totalCars, total_bookings: totalBookings, total_revenue: totalRevenue });
        renderStatusChart(statusChart, byStatus);
        renderRevenueChart(revenueChart, []);
        renderRecentBookings(recentEl, recent.map(b => ({
            id: b.id, customer_name: b.customerName || b.customer_name,
            car_name: b.carName || '-', total_price: b.totalPrice || b.total_price || 0,
            status: b.status, created_at: b.createdAt || b.created_at || '',
        })));
    }
}

function renderStatsCards(grid, stats) {
    grid.innerHTML = `
        <div class="stats-card"><div class="stat-icon" style="background:var(--primary-light);color:var(--primary);"><i class="fas fa-car"></i></div><div class="stat-value">${stats.total_cars || 0}</div><div class="stat-label">Total Mobil</div></div>
        <div class="stats-card"><div class="stat-icon" style="background:#dcfce7;color:#15803d;"><i class="fas fa-calendar-check"></i></div><div class="stat-value">${stats.total_bookings || 0}</div><div class="stat-label">Total Booking</div></div>
        <div class="stats-card"><div class="stat-icon" style="background:#dbeafe;color:#1d4ed8;"><i class="fas fa-money-bill-wave"></i></div><div class="stat-value">${formatPrice(stats.total_revenue || 0)}</div><div class="stat-label">Total Pendapatan</div></div>
    `;
}

function renderStatusChart(el, byStatus) {
    const statuses = { pending: 'Pending', confirmed: 'Confirmed', completed: 'Completed', cancelled: 'Cancelled' };
    const colors = { pending: '#f59e0b', confirmed: '#10b981', completed: '#3b82f6', cancelled: '#ef4444' };
    const total = Object.values(byStatus).reduce((a, b) => a + b, 0);
    if (!total) { el.innerHTML = '<div class="no-data" style="padding:30px 0;">Belum ada data.</div>'; return; }

    let html = '';
    for (const [key, label] of Object.entries(statuses)) {
        const count = byStatus[key] || 0;
        const pct = (count / total) * 100;
        html += `
            <div class="chart-bar-row">
                <span class="chart-label">${label}</span>
                <div class="chart-bar-track"><div class="chart-bar-fill" style="width:${pct}%;background:${colors[key]};"></div></div>
                <span class="chart-value">${count}</span>
            </div>
        `;
    }
    el.innerHTML = html;
}

function renderRevenueChart(el, monthly) {
    if (!monthly || !monthly.length) {
        el.innerHTML = '<div class="no-data" style="padding:30px 0;">Data pendapatan bulanan belum tersedia.</div>';
        return;
    }
    const maxRev = Math.max(...monthly.map(m => m.revenue), 1);
    let html = '';
    monthly.forEach(m => {
        const pct = (m.revenue / maxRev) * 100;
        html += `
            <div class="chart-bar-row">
                <span class="chart-label">${m.month}</span>
                <div class="chart-bar-track"><div class="chart-bar-fill" style="width:${pct}%;background:var(--primary);"></div></div>
                <span class="chart-value">${formatPrice(m.revenue)}</span>
            </div>
        `;
    });
    el.innerHTML = html;
}

function renderRecentBookings(el, recent) {
    if (!recent.length) { el.innerHTML = '<div class="no-data" style="padding:20px 0;">Belum ada booking.</div>'; return; }
    el.innerHTML = '<div class="table-wrapper"><table class="admin-table"><thead><tr><th>ID</th><th>Penyewa</th><th>Mobil</th><th>Total</th><th>Status</th><th>Tanggal</th></tr></thead><tbody>' +
        recent.map(b => `
            <tr>
                <td>#${b.id}</td>
                <td>${b.customer_name}</td>
                <td>${b.car_name}</td>
                <td>${formatPrice(b.total_price)}</td>
                <td><span class="status-badge ${b.status}">${b.status}</span></td>
                <td>${b.created_at}</td>
            </tr>
        `).join('') +
    '</tbody></table></div>';
}

function initCarForm() {
    const form = document.getElementById('carForm');
    const cancelBtn = document.getElementById('carFormCancel');
    const imageInput = document.getElementById('carImage');
    const imagePreview = document.getElementById('carImagePreview');

    initFieldValidation(form);

    imageInput.addEventListener('change', () => {
        const file = imageInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview" style="max-width:200px;max-height:150px;border-radius:6px;object-fit:cover;">`;
                imagePreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            imagePreview.style.display = 'none';
            imagePreview.innerHTML = '';
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearFieldErrors();
        if (!validateForm(form)) {
            showToast('Periksa kembali input Anda.', 'warning', 'Validasi Gagal');
            return;
        }

        const id = document.getElementById('carFormId').value;
        const name = document.getElementById('carName').value.trim();
        const category = document.getElementById('carCategory').value;
        const price = parseInt(document.getElementById('carPrice').value);
        const seats = parseInt(document.getElementById('carSeats').value);
        const transmission = document.getElementById('carTransmission').value;
        const description = document.getElementById('carDescription').value.trim();
        const submitBtn = form.querySelector('button[type="submit"]');
        setLoading(submitBtn, true);

        if (USE_API) {
            try {
                const formData = new FormData();
                formData.append('name', name);
                formData.append('category', category);
                formData.append('price', price);
                formData.append('seats', seats);
                formData.append('transmission', transmission);
                formData.append('description', description);
                formData.append('available', '1');
                formData.append('fuel', 'Bensin');

                const file = imageInput.files[0];
                if (file) {
                    formData.append('image', file);
                }

                if (id) {
                    await apiPutMultipart(`/cars/${id}`, formData);
                } else {
                    await apiPostMultipart('/cars', formData);
                }
                cars = await apiGet('/cars');
                const pRes = await apiGetRaw(`/cars?per_page=${carsPagination.perPage}&page=1`).catch(() => ({}));
                carsPagination.currentPage = pRes.current_page || 1;
                carsPagination.lastPage = pRes.last_page || 1;
                carsPagination.total = pRes.total || 0;
            } catch (err) {
                setLoading(submitBtn, false);
                showToast(err.message, 'error', 'Gagal Simpan');
                return;
            }
        } else {
            let image = '';
            const file = imageInput.files[0];
            if (file) {
                image = await new Promise(resolve => {
                    const reader = new FileReader();
                    reader.onload = e => resolve(e.target.result);
                    reader.readAsDataURL(file);
                });
            }

            if (id) {
                const car = cars.find(c => c.id === parseInt(id));
                if (car) {
                    Object.assign(car, { name, category, price, image: image || car.image, seats, transmission, description });
                }
            } else {
                cars.push({
                    id: getNextId(cars),
                    name, category, price, image, seats, transmission,
                    fuel: 'Bensin', available: true, description,
                });
            }
            saveCars();
        }

        renderCars();
        renderCarsPagination();
        renderAdminCars();
        populateBookingCarSelect();
        setLoading(submitBtn, false);
        form.reset();
        imagePreview.style.display = 'none';
        imagePreview.innerHTML = '';
        document.getElementById('carFormId').value = '';
        cancelBtn.style.display = 'none';
        showToast('Mobil berhasil disimpan!', 'success');
    });

    cancelBtn.addEventListener('click', () => {
        form.reset();
        imagePreview.style.display = 'none';
        imagePreview.innerHTML = '';
        document.getElementById('carFormId').value = '';
        cancelBtn.style.display = 'none';
    });
}

function editCar(id) {
    const car = cars.find(c => c.id === id);
    if (!car) return;

    document.getElementById('carFormId').value = car.id;
    document.getElementById('carName').value = car.name;
    document.getElementById('carCategory').value = car.category;
    document.getElementById('carPrice').value = car.price;
    document.getElementById('carSeats').value = car.seats;
    document.getElementById('carTransmission').value = car.transmission;
    document.getElementById('carDescription').value = car.description || '';

    const imagePreview = document.getElementById('carImagePreview');
    if (car.image) {
        imagePreview.innerHTML = `<img src="${car.image}" alt="Preview" style="max-width:200px;max-height:150px;border-radius:6px;object-fit:cover;">`;
        imagePreview.style.display = 'block';
    } else {
        imagePreview.style.display = 'none';
    }
    document.getElementById('carImage').value = '';

    document.getElementById('carFormCancel').style.display = 'inline-flex';
    document.querySelector('.admin-tab[data-tab="add-car"]').click();
    window.scrollTo({ top: document.getElementById('admin').offsetTop - 100, behavior: 'smooth' });
}

function renderBookingEditCarSelect() {
    const select = document.getElementById('editBookCar');
    if (!select) return;
    select.innerHTML = '<option value="">-- Pilih Mobil --</option>' +
        cars.map(c =>
            `<option value="${c.id}">${c.name} - ${formatPrice(c.price)}/hari</option>`
        ).join('');
}

function editBooking(id) {
    const booking = bookings.find(b => b.id === id);
    if (!booking) return;

    renderBookingEditCarSelect();

    document.getElementById('editBookingId').value = booking.id;
    document.getElementById('editBookCar').value = booking.carId || booking.car_id || '';
    document.getElementById('editBookName').value = booking.customerName || booking.customer_name || '';
    document.getElementById('editBookPhone').value = booking.phone || '';
    document.getElementById('editBookEmail').value = booking.email || '';
    document.getElementById('editBookAddress').value = booking.address || '';
    document.getElementById('editBookStart').value = booking.startDate || booking.start_date || '';
    document.getElementById('editBookEnd').value = booking.endDate || booking.end_date || '';
    document.getElementById('editBookNotes').value = booking.notes || '';

    document.getElementById('editBookingModal').classList.add('active');
}

function initBookingEdit() {
    const form = document.getElementById('editBookingForm');
    if (!form) return;

    initFieldValidation(form);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearFieldErrors();
        if (!validateForm(form)) {
            showToast('Periksa kembali input Anda.', 'warning', 'Validasi Gagal');
            return;
        }

        const id = document.getElementById('editBookingId').value;
        const payload = {
            car_id: parseInt(document.getElementById('editBookCar').value),
            customer_name: document.getElementById('editBookName').value.trim(),
            phone: document.getElementById('editBookPhone').value.trim(),
            email: document.getElementById('editBookEmail').value.trim(),
            address: document.getElementById('editBookAddress').value.trim(),
            start_date: document.getElementById('editBookStart').value,
            end_date: document.getElementById('editBookEnd').value,
            notes: document.getElementById('editBookNotes').value.trim(),
        };

        const submitBtn = form.querySelector('button[type="submit"]');
        setLoading(submitBtn, true);

        if (USE_API) {
            try {
                await apiPut(`/bookings/${id}`, payload);
                await refreshBookings();
            } catch (err) {
                setLoading(submitBtn, false);
                showToast(err.message, 'error', 'Gagal Update');
                return;
            }
        } else {
            const booking = bookings.find(b => b.id === parseInt(id));
            if (booking) {
                Object.assign(booking, {
                    carId: payload.car_id,
                    customerName: payload.customer_name,
                    phone: payload.phone,
                    email: payload.email,
                    address: payload.address,
                    startDate: payload.start_date,
                    endDate: payload.end_date,
                    notes: payload.notes,
                });
            }
            saveBookings();
        }

        setLoading(submitBtn, false);
        renderAdminBookings();
        document.getElementById('editBookingModal').classList.remove('active');
        showToast('Booking berhasil diperbarui!', 'success');
    });
}

function confirmDeleteCar(id) {
    const carName = cars.find(c => c.id === id)?.name;
    document.getElementById('deleteModalMessage').textContent =
        'Apakah Anda yakin ingin menghapus mobil ' + carName + '?';
    document.getElementById('confirmDelete').onclick = async () => {
        if (USE_API) {
            try {
                await apiDelete(`/cars/${id}`);
                await fetchAndRenderCars(1);
            } catch (err) {
                showToast(err.message, 'error', 'Gagal Hapus');
                return;
            }
        } else {
            cars = cars.filter(c => c.id !== id);
            saveCars();
        }
        renderCarsPagination();
        renderAdminCars();
        populateBookingCarSelect();
        document.getElementById('deleteModal').classList.remove('active');
        showToast('Mobil berhasil dihapus.', 'success');
    };
    document.getElementById('deleteModal').classList.add('active');
}

/* ───── Promo Admin ───── */

let promos = [];

async function renderAdminPromos() {
    if (!USE_API) return;
    try {
        const res = await apiGetRaw('/promos');
        promos = res.data || [];
    } catch {
        promos = [];
    }

    const tbody = document.getElementById('promosTableBody');
    if (!tbody) return;

    if (promos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--text-light);padding:24px;">Belum ada kode promo.</td></tr>';
        return;
    }

    tbody.innerHTML = promos.map(p => {
        const discountLabel = p.discount_type === 'percentage' ? p.discount_value + '%' : formatPrice(p.discount_value);
        const now = new Date();
        const validFrom = new Date(p.valid_from + 'T00:00:00');
        const validUntil = new Date(p.valid_until + 'T00:00:00');
        const expired = now > validUntil;
        const active = p.is_active && !expired;
        return `
            <tr>
                <td><strong>${p.code}</strong></td>
                <td>${discountLabel}${p.max_discount ? ' (max ' + formatPrice(p.max_discount) + ')' : ''}</td>
                <td>${p.min_rental_days || '—'}</td>
                <td>${formatDate(p.valid_from)} — ${formatDate(p.valid_until)}</td>
                <td>${p.used_count}${p.usage_limit ? '/' + p.usage_limit : ''}</td>
                <td><span class="booking-status ${active ? 'status-confirmed' : 'status-cancelled'}">${active ? 'Aktif' : expired ? 'Kadaluarsa' : 'Nonaktif'}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline" onclick="editPromo(${p.id})" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-danger" onclick="confirmDeletePromo(${p.id})" title="Hapus"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    }).join('');
}

async function initPromoForm() {
    const form = document.getElementById('promoForm');
    if (!form) return;

    initFieldValidation(form);

    document.getElementById('promoFormCancel').addEventListener('click', () => {
        resetPromoForm();
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearFieldErrors();
        if (!validateForm(form)) return;

        const id = document.getElementById('promoFormId').value;
        const payload = {
            code: document.getElementById('promoCode').value.trim(),
            discount_type: document.getElementById('promoDiscountType').value,
            discount_value: parseInt(document.getElementById('promoDiscountValue').value),
            max_discount: document.getElementById('promoMaxDiscount').value ? parseInt(document.getElementById('promoMaxDiscount').value) : null,
            min_rental_days: document.getElementById('promoMinDays').value ? parseInt(document.getElementById('promoMinDays').value) : null,
            usage_limit: document.getElementById('promoUsageLimit').value ? parseInt(document.getElementById('promoUsageLimit').value) : null,
            valid_from: document.getElementById('promoValidFrom').value,
            valid_until: document.getElementById('promoValidUntil').value,
            is_active: document.getElementById('promoIsActive').checked,
        };

        try {
            if (id) {
                await apiPut('/promos/' + id, payload);
                showToast('Promo berhasil diperbarui.', 'success');
            } else {
                await apiPost('/promos', payload);
                showToast('Promo berhasil ditambahkan.', 'success');
            }
            resetPromoForm();
            await renderAdminPromos();
        } catch (err) {
            showToast(err.message, 'error', 'Gagal');
        }
    });
}

function resetPromoForm() {
    document.getElementById('promoFormId').value = '';
    document.getElementById('promoForm').reset();
    document.getElementById('promoIsActive').checked = true;
    document.getElementById('promoFormTitle').textContent = 'Tambah Promo Baru';
    document.getElementById('promoFormCancel').style.display = 'none';
}

async function editPromo(id) {
    const promo = promos.find(p => p.id === id);
    if (!promo) return;

    document.getElementById('promoFormId').value = promo.id;
    document.getElementById('promoCode').value = promo.code;
    document.getElementById('promoDiscountType').value = promo.discount_type;
    document.getElementById('promoDiscountValue').value = promo.discount_value;
    document.getElementById('promoMaxDiscount').value = promo.max_discount || '';
    document.getElementById('promoMinDays').value = promo.min_rental_days || '';
    document.getElementById('promoUsageLimit').value = promo.usage_limit || '';
    document.getElementById('promoValidFrom').value = promo.valid_from;
    document.getElementById('promoValidUntil').value = promo.valid_until;
    document.getElementById('promoIsActive').checked = promo.is_active;
    document.getElementById('promoFormTitle').textContent = 'Edit Promo';
    document.getElementById('promoFormCancel').style.display = '';
    document.getElementById('tab-promos').scrollIntoView({ behavior: 'smooth' });
}

function confirmDeletePromo(id) {
    const promo = promos.find(p => p.id === id);
    if (!promo) return;
    document.getElementById('deleteModalMessage').textContent = `Hapus kode promo "${promo.code}"?`;
    document.getElementById('confirmDelete').onclick = async () => {
        try {
            await apiDelete('/promos/' + id);
            showToast('Promo berhasil dihapus.', 'success');
            document.getElementById('deleteModal').classList.remove('active');
            await renderAdminPromos();
        } catch (err) {
            showToast(err.message, 'error', 'Gagal Hapus');
        }
    };
    document.getElementById('deleteModal').classList.add('active');
}

/* ───── Calendar ───── */

let calYear, calMonth;

function initCalendar() {
    const now = new Date();
    calYear = now.getFullYear();
    calMonth = now.getMonth() + 1;
    renderCalendar();
    document.getElementById('calPrevMonth').addEventListener('click', () => {
        calMonth--;
        if (calMonth < 1) { calMonth = 12; calYear--; }
        renderCalendar();
    });
    document.getElementById('calNextMonth').addEventListener('click', () => {
        calMonth++;
        if (calMonth > 12) { calMonth = 1; calYear++; }
        renderCalendar();
    });
}

async function renderCalendar() {
    const title = document.getElementById('calMonthTitle');
    const grid = document.getElementById('calendarGrid');
    if (!title || !grid) return;

    const months = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
    title.textContent = months[calMonth - 1] + ' ' + calYear;

    grid.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-light);grid-column:1/-1;"><i class="fas fa-spinner fa-spin"></i><p style="margin-top:12px;">Memuat kalendar...</p></div>';

    if (!USE_API) {
        grid.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-light);grid-column:1/-1;">Kalendar tersedia saat menggunakan backend API.</div>';
        return;
    }

    try {
        const res = await apiGetRaw(`/calendar?year=${calYear}&month=${calMonth}`);
        const bookings = res.data || [];
        buildCalendarGrid(grid, bookings);
    } catch {
        grid.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-light);grid-column:1/-1;">Gagal memuat kalendar.</div>';
    }
}

function buildCalendarGrid(grid, bookings) {
    const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const firstDay = new Date(calYear, calMonth - 1, 1).getDay();
    const daysInMonth = new Date(calYear, calMonth, 0).getDate();
    const daysInPrevMonth = new Date(calYear, calMonth - 1, 0).getDate();
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

    const bookingsByDate = {};
    bookings.forEach(b => {
        const start = new Date(b.start_date + 'T00:00:00');
        const end = new Date(b.end_date + 'T00:00:00');
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
            if (!bookingsByDate[key]) bookingsByDate[key] = [];
            if (bookingsByDate[key].length < 4) {
                bookingsByDate[key].push(b);
            }
        }
    });

    let html = dayNames.map(d => `<div class="calendar-header">${d}</div>`).join('');

    const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

    for (let i = 0; i < totalCells; i++) {
        let dayNum, isOther = false;
        if (i < firstDay) {
            dayNum = daysInPrevMonth - firstDay + i + 1;
            isOther = true;
        } else if (i >= firstDay + daysInMonth) {
            dayNum = i - firstDay - daysInMonth + 1;
            isOther = true;
        } else {
            dayNum = i - firstDay + 1;
        }

        const m = isOther && i < firstDay ? calMonth - 1 : isOther ? calMonth + 1 : calMonth;
        const y = m < 1 ? calYear - 1 : m > 12 ? calYear + 1 : calYear;
        const adjM = m < 1 ? 12 : m > 12 ? 1 : m;
        const dateStr = `${y}-${String(adjM).padStart(2,'0')}-${String(dayNum).padStart(2,'0')}`;
        const isToday = !isOther && dateStr === todayStr;
        const dayBookings = bookingsByDate[dateStr] || [];
        const dayAllBookings = bookingsByDate[dateStr] || [];
        const hasMore = dayAllBookings.length > 3;

        html += `<div class="calendar-day${isOther ? ' other-month' : ''}${isToday ? ' today' : ''}">`;
        html += `<div class="calendar-day-number">${dayNum}</div>`;
        dayBookings.slice(0, 3).forEach(b => {
            const status = b.status || 'confirmed';
            const label = b.car?.name?.substring(0, 12) || 'Mobil';
            html += `<div class="calendar-event event-${status}" onclick="showBookingDetail(${b.id})" title="${b.customer_name} - ${b.car?.name || ''}">${label}</div>`;
        });
        if (hasMore) {
            html += `<div class="calendar-more" onclick="showDateBookings('${dateStr}')">+${dayAllBookings.length - 3} lagi</div>`;
        }
        html += `</div>`;
    }

    grid.innerHTML = html;
}
