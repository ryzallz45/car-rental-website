function renderCars(filteredCars) {
    const grid = document.getElementById('carsGrid');
    const data = filteredCars || getFilteredCars();

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

async function fetchAndRenderCars() {
    showCarsLoading();
    try {
        const category = document.getElementById('filterCategory').value;
        const transmission = document.getElementById('filterTransmission').value;
        const sort = document.getElementById('filterSort').value;
        const params = new URLSearchParams();
        if (category !== 'all') params.set('category', category);
        if (transmission !== 'all') params.set('transmission', transmission);
        if (sort !== 'default') params.set('sort', sort);
        const qs = params.toString();
        cars = await apiGet('/cars' + (qs ? '?' + qs : ''));
        renderCars(cars);
    } catch {
        renderCars([]);
    }
    hideCarsLoading();
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
    showToast(
        `Kategori: ${car.category} | ${car.seats} Kursi | ${car.transmission} | ${car.fuel}\n${car.description}`,
        'info', `${car.name} - ${formatPrice(car.price)}/hari`
    );
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
    totalEl.textContent = formatPrice(total);
}
