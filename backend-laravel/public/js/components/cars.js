function renderCars(filteredCars) {
    const grid = document.getElementById('carsGrid');
    let data = filteredCars || getFilteredCars();

    if (!USE_API) {
        const total = data.length;
        const perPage = carsPagination.perPage;
        const lastPage = Math.max(1, Math.ceil(total / perPage));
        carsPagination.lastPage = lastPage;
        carsPagination.total = total;
        if (carsPagination.currentPage > lastPage) carsPagination.currentPage = lastPage;
        const start = (carsPagination.currentPage - 1) * perPage;
        data = data.slice(start, start + perPage);
        renderCarsPagination();
    }

    if (!data.length) {
        grid.innerHTML = '<div class="no-data"><i class="fas fa-car"></i><p>Tidak ada mobil yang tersedia.</p></div>';
        return;
    }

    grid.innerHTML = data.map(car => `
        <div class="car-card">
            <div class="car-card-image">
                <img src="${car.image}" alt="${car.name}" loading="lazy" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22250%22 fill=%22%23e2e8f0%22><rect width=%22400%22 height=%22250%22/><text x=%22200%22 y=%22130%22 text-anchor=%22middle%22 fill=%22%2394a3b8%22 font-size=%2218%22>${car.name}</text></svg>'">
                <span class="car-card-badge ${car.available ? 'available' : 'unavailable'}">
                    ${car.available ? 'Tersedia' : 'Tidak Tersedia'}
                </span>
            </div>
            <div class="car-card-body">
                <h3>${car.name}</h3>
                <div class="car-card-specs">
                    <span><i class="fas fa-users"></i> ${car.seats} Kursi</span>
                    <span><i class="fas fa-cog"></i> ${car.transmission}</span>
                    <span><i class="fas fa-gas-pump"></i> ${car.fuel}</span>
                    <span><i class="fas fa-tag"></i> ${car.category}</span>
                </div>
                <div class="car-card-rating" style="margin-top:4px;">
                    ${renderCardRating(car.rating_avg, car.rating_count)}
                </div>
                <div class="car-card-price">
                    ${formatPrice(car.price)} <small>/ hari</small>
                </div>
                <div class="car-card-actions">
                    <a href="#booking" class="btn btn-primary" onclick="selectCarForBooking(${car.id})">
                        <i class="fas fa-calendar-check"></i> Sewa
                    </a>
                    <button class="btn btn-outline" onclick="showCarDetail(${car.id})" style="color:var(--text);border-color:var(--border);">
                        <i class="fas fa-info-circle"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

async function fetchAndRenderCars(page) {
    showCarsLoading();
    try {
        page = page || carsPagination.currentPage;
        const category = document.getElementById('filterCategory').value;
        const transmission = document.getElementById('filterTransmission').value;
        const sort = document.getElementById('filterSort').value;
        const params = new URLSearchParams();
        params.set('per_page', carsPagination.perPage);
        params.set('page', page);
        if (category !== 'all') params.set('category', category);
        if (transmission !== 'all') params.set('transmission', transmission);
        if (sort !== 'default') params.set('sort', sort);
        const res = await apiGetRaw('/cars?' + params.toString());
        cars = res.data || [];
        carsPagination.currentPage = res.current_page || 1;
        carsPagination.lastPage = res.last_page || 1;
        carsPagination.total = res.total || 0;
        renderCars(cars);
        renderCarsPagination();
    } catch {
        renderCars([]);
    }
    hideCarsLoading();
}

function renderCarsPagination() {
    const container = document.getElementById('carsPagination');
    if (!container) return;
    const { currentPage, lastPage, total } = carsPagination;
    if (lastPage <= 1) { container.innerHTML = ''; return; }
    let html = '<div class="pagination-info">' + total + ' mobil - Halaman ' + currentPage + '/' + lastPage + '</div><div class="pagination-btns">';
    html += `<button class="page-btn" onclick="goToCarsPage(1)" ${currentPage === 1 ? 'disabled' : ''}><i class="fas fa-angle-double-left"></i></button>`;
    html += `<button class="page-btn" onclick="goToCarsPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}><i class="fas fa-angle-left"></i></button>`;
    for (let i = Math.max(1, currentPage - 2); i <= Math.min(lastPage, currentPage + 2); i++) {
        html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goToCarsPage(${i})">${i}</button>`;
    }
    html += `<button class="page-btn" onclick="goToCarsPage(${currentPage + 1})" ${currentPage === lastPage ? 'disabled' : ''}><i class="fas fa-angle-right"></i></button>`;
    html += `<button class="page-btn" onclick="goToCarsPage(${lastPage})" ${currentPage === lastPage ? 'disabled' : ''}><i class="fas fa-angle-double-right"></i></button>`;
    html += '</div>';
    container.innerHTML = html;
}

function goToCarsPage(page) {
    if (page < 1 || page > carsPagination.lastPage || page === carsPagination.currentPage) return;
    if (USE_API) {
        fetchAndRenderCars(page);
    } else {
        carsPagination.currentPage = page;
        renderCars();
        renderCarsPagination();
    }
}

function getFilteredCars() {
    const category = document.getElementById('filterCategory').value;
    const transmission = document.getElementById('filterTransmission').value;
    const sort = document.getElementById('filterSort').value;

    let filtered = [...cars];

    if (category !== 'all') {
        filtered = filtered.filter(c => c.category === category);
    }
    if (transmission !== 'all') {
        filtered = filtered.filter(c => c.transmission === transmission);
    }

    switch (sort) {
        case 'price-asc': filtered.sort((a, b) => a.price - b.price); break;
        case 'price-desc': filtered.sort((a, b) => b.price - a.price); break;
        case 'name': filtered.sort((a, b) => a.name.localeCompare(b.name)); break;
    }

    return filtered;
}

function selectCarForBooking(carId) {
    const select = document.getElementById('bookCar');
    select.value = carId;
    updateBookingTotal();
    document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
}

function showCarDetail(carId) {
    const car = cars.find(c => c.id === carId);
    if (!car) return;

    const body = document.getElementById('carDetailBody');
    body.innerHTML = `
        <div class="car-detail-image">
            <img src="${car.image}" alt="${car.name}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22800%22 height=%22400%22 fill=%22%23e2e8f0%22><rect width=%22800%22 height=%22400%22/><text x=%22400%22 y=%22215%22 text-anchor=%22middle%22 fill=%22%2394a3b8%22 font-size=%2224%22>${car.name}</text></svg>'">
            <span class="car-detail-badge ${car.available ? 'available' : 'unavailable'}">
                ${car.available ? 'Tersedia' : 'Tidak Tersedia'}
            </span>
        </div>
        <div class="car-detail-info">
            <div class="car-detail-header">
                <h2>${car.name}</h2>
                <span class="car-detail-price">${formatPrice(car.price)} <small>/ hari</small></span>
            </div>
            <div class="car-detail-rating">
                ${renderStarRating(car.rating_avg, car.rating_count)}
            </div>
            <div class="car-detail-specs">
                <div class="car-detail-spec">
                    <i class="fas fa-tag"></i>
                    <div><strong>Kategori</strong><span>${car.category}</span></div>
                </div>
                <div class="car-detail-spec">
                    <i class="fas fa-users"></i>
                    <div><strong>Kursi</strong><span>${car.seats} Kursi</span></div>
                </div>
                <div class="car-detail-spec">
                    <i class="fas fa-cog"></i>
                    <div><strong>Transmisi</strong><span>${car.transmission}</span></div>
                </div>
                <div class="car-detail-spec">
                    <i class="fas fa-gas-pump"></i>
                    <div><strong>Bahan Bakar</strong><span>${car.fuel || 'Bensin'}</span></div>
                </div>
            </div>
            <div class="car-detail-desc">
                <h4>Deskripsi</h4>
                <p>${car.description || 'Tidak ada deskripsi.'}</p>
            </div>
            <div class="car-detail-reviews" id="carReviews_${car.id}">
                <h4><i class="fas fa-star" style="color:var(--warning);"></i> Ulasan</h4>
                <div id="reviewsList_${car.id}">
                    <div style="text-align:center;padding:20px;color:var(--text-light);">
                        <i class="fas fa-spinner fa-spin"></i> Memuat ulasan...
                    </div>
                </div>
                <div class="review-form" style="margin-top:20px;padding-top:20px;border-top:1px solid var(--border);">
                    <h5 style="margin-bottom:12px;">Tambah Ulasan</h5>
                    <div class="star-rating-input" id="starRatingInput_${car.id}">
                        ${[1,2,3,4,5].map(i => `<i class="far fa-star" data-value="${i}" style="cursor:pointer;font-size:1.4rem;color:var(--warning);padding:0 2px;"></i>`).join('')}
                    </div>
                    <input type="hidden" id="reviewRating_${car.id}" value="0">
                    <div class="form-group" style="margin-top:8px;">
                        <input type="text" id="reviewName_${car.id}" placeholder="Nama Anda" class="${apiToken ? 'hidden' : ''}" style="${apiToken ? 'display:none;' : ''}">
                    </div>
                    <div class="form-group">
                        <textarea id="reviewComment_${car.id}" rows="2" placeholder="Tulis ulasan Anda..." style="resize:none;"></textarea>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="submitReview(${car.id})">
                        <i class="fas fa-paper-plane"></i> Kirim Ulasan
                    </button>
                </div>
            </div>
            <a href="#booking" class="btn btn-primary btn-block" onclick="selectCarForBooking(${car.id}); document.getElementById('carDetailModal').classList.remove('active');" style="margin-top:16px;">
                <i class="fas fa-calendar-check"></i> Sewa Sekarang
            </a>
        </div>
    `;
    document.getElementById('carDetailModal').classList.add('active');

    initStarRating(car.id);
    if (USE_API) {
        loadReviews(car.id);
    } else {
        const list = document.getElementById(`reviewsList_${car.id}`);
        if (list) list.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text-light);">Fitur ulasan tersedia saat menggunakan backend API.</div>';
    }
}

function renderStarRating(avg, count) {
    const rating = parseFloat(avg) || 0;
    const total = parseInt(count) || 0;
    if (total === 0) return '';
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    let stars = '';
    for (let i = 0; i < 5; i++) {
        if (i < full) stars += '<i class="fas fa-star" style="color:var(--warning);"></i>';
        else if (i === full && half) stars += '<i class="fas fa-star-half-alt" style="color:var(--warning);"></i>';
        else stars += '<i class="far fa-star" style="color:var(--warning);"></i>';
    }
    return `<div class="rating-display">${stars} <span style="font-size:0.85rem;color:var(--text-light);margin-left:6px;">${rating.toFixed(1)} (${total} ulasan)</span></div>`;
}

function initStarRating(carId) {
    const container = document.getElementById(`starRatingInput_${carId}`);
    if (!container) return;
    const stars = container.querySelectorAll('i');
    const hidden = document.getElementById(`reviewRating_${carId}`);
    stars.forEach(star => {
        star.addEventListener('mouseenter', () => {
            const val = parseInt(star.dataset.value);
            stars.forEach((s, idx) => {
                s.className = idx < val ? 'fas fa-star' : 'far fa-star';
            });
        });
        star.addEventListener('mouseleave', () => {
            const val = parseInt(hidden.value);
            stars.forEach((s, idx) => {
                s.className = idx < val ? 'fas fa-star' : 'far fa-star';
            });
        });
        star.addEventListener('click', () => {
            const val = parseInt(star.dataset.value);
            hidden.value = val;
            stars.forEach((s, idx) => {
                s.className = idx < val ? 'fas fa-star' : 'far fa-star';
            });
        });
    });
}

async function loadReviews(carId) {
    const list = document.getElementById(`reviewsList_${carId}`);
    if (!list) return;
    try {
        const data = await apiGet(`/cars/${carId}/reviews`);
        const reviews = Array.isArray(data) ? data : [];
        if (reviews.length === 0) {
            list.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text-light);"><i class="far fa-star"></i> Belum ada ulasan. Jadilah yang pertama!</div>';
            return;
        }
        list.innerHTML = reviews.map(r => `
            <div class="review-item" style="padding:12px 0;border-bottom:1px solid var(--border);">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                    <strong>${escapeHtml(r.customer_name)}</strong>
                    <span>${'<i class="fas fa-star" style="color:var(--warning);font-size:0.8rem;"></i>'.repeat(r.rating)}</span>
                </div>
                ${r.comment ? `<p style="margin-top:4px;color:var(--text-light);font-size:0.9rem;">${escapeHtml(r.comment)}</p>` : ''}
                <small style="color:var(--text-light);font-size:0.75rem;">${formatDate(r.created_at)}</small>
            </div>
        `).join('');
    } catch {
        list.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text-light);">Gagal memuat ulasan.</div>';
    }
}

async function submitReview(carId) {
    const rating = parseInt(document.getElementById(`reviewRating_${carId}`).value);
    const nameInput = document.getElementById(`reviewName_${carId}`);
    const comment = document.getElementById(`reviewComment_${carId}`).value.trim();

    if (!rating) {
        showToast('Silakan pilih rating terlebih dahulu.', 'warning');
        return;
    }

    let customerName = '';
    if (apiToken) {
        try {
            const userData = await apiGet('/user');
            customerName = userData.name || '';
        } catch {}
    }
    if (!customerName) {
        customerName = nameInput ? nameInput.value.trim() : '';
        if (!customerName) {
            showToast('Silakan masukkan nama Anda.', 'warning');
            nameInput.focus();
            return;
        }
    }

    try {
        await apiPost('/reviews', {
            car_id: carId,
            customer_name: customerName,
            rating,
            comment: comment || null,
        });
        showToast('Ulasan berhasil dikirim!', 'success');
        document.getElementById(`reviewComment_${carId}`).value = '';
        document.getElementById(`reviewRating_${carId}`).value = 0;
        const stars = document.querySelectorAll(`#starRatingInput_${carId} i`);
        stars.forEach(s => s.className = 'far fa-star');
        if (nameInput) nameInput.value = '';
        loadReviews(carId);
    } catch (err) {
        showToast(err.message, 'error', 'Gagal mengirim ulasan');
    }
}

function renderCardRating(avg, count) {
    const rating = parseFloat(avg) || 0;
    const total = parseInt(count) || 0;
    if (total === 0) return '';
    const full = Math.floor(rating);
    let stars = '';
    for (let i = 0; i < 5; i++) {
        stars += i < full
            ? '<i class="fas fa-star" style="color:var(--warning);font-size:0.75rem;"></i>'
            : '<i class="far fa-star" style="color:var(--warning);font-size:0.75rem;"></i>';
    }
    return `<span style="font-size:0.75rem;color:var(--text-light);">${stars} ${rating.toFixed(1)}</span>`;
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function populateBookingCarSelect() {
    const select = document.getElementById('bookCar');
    select.innerHTML = '<option value="">-- Pilih Mobil --</option>' +
        cars.filter(c => c.available).map(c =>
            `<option value="${c.id}">${c.name} - ${formatPrice(c.price)}/hari</option>`
        ).join('');
}

function updateBookingTotal() {
    const carId = parseInt(document.getElementById('bookCar').value);
    const start = document.getElementById('bookStart').value;
    const end = document.getElementById('bookEnd').value;
    const totalEl = document.querySelector('#bookingTotal strong');

    if (!carId || !start || !end) {
        totalEl.textContent = 'Rp 0';
        return;
    }

    const car = cars.find(c => c.id === carId);
    if (!car) return;

    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
        totalEl.textContent = 'Rp 0';
        return;
    }

    const total = car.price * diffDays;
    const finalTotal = Math.max(0, total - (appliedDiscount || 0));
    totalEl.textContent = formatPrice(finalTotal);
}
