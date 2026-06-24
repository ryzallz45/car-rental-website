const API_BASE = localStorage.getItem('apiBase') || '';
const USE_API = !!API_BASE;

const DEFAULT_CARS = [
    { id: 1, name: 'Toyota Avanza', category: 'MPV', price: 350000, image: 'https://images.unsplash.com/photo-1623869675781-51aa7ad5fec8?w=400&h=250&fit=crop', seats: 7, transmission: 'Manual', fuel: 'Bensin', available: true, description: 'Mobil keluarga 7 seater yang nyaman dan irit bahan bakar.' },
    { id: 2, name: 'Honda Civic', category: 'Sedan', price: 500000, image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=400&h=250&fit=crop', seats: 5, transmission: 'Automatic', fuel: 'Bensin', available: true, description: 'Sedan sporty dengan desain elegan dan performa tangguh.' },
    { id: 3, name: 'Daihatsu Xenia', category: 'MPV', price: 300000, image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=250&fit=crop', seats: 7, transmission: 'Manual', fuel: 'Bensin', available: true, description: 'MPV irit dengan kabin luas, cocok untuk perjalanan keluarga.' },
    { id: 4, name: 'Toyota Innova', category: 'MPV', price: 600000, image: 'https://images.unsplash.com/photo-1600472024671-c916878b4884?w=400&h=250&fit=crop', seats: 7, transmission: 'Manual', fuel: 'Diesel', available: true, description: 'MPV premium dengan kenyamanan maksimal untuk perjalanan jauh.' },
    { id: 5, name: 'Honda Brio', category: 'Hatchback', price: 250000, image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&h=250&fit=crop', seats: 5, transmission: 'Manual', fuel: 'Bensin', available: true, description: 'Mobil mungil lincah dan irit, ideal untuk perkotaan.' },
    { id: 6, name: 'Toyota Fortuner', category: 'SUV', price: 800000, image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&h=250&fit=crop', seats: 7, transmission: 'Automatic', fuel: 'Diesel', available: true, description: 'SUV tangguh yang siap menjelajahi berbagai medan.' },
    { id: 7, name: 'Mitsubishi Pajero', category: 'SUV', price: 900000, image: 'https://images.unsplash.com/photo-1581540619870-3e2daf0cbe2b?w=400&h=250&fit=crop', seats: 7, transmission: 'Automatic', fuel: 'Diesel', available: true, description: 'SUV mewah dengan performa off-road yang handal.' },
    { id: 8, name: 'Suzuki Ertiga', category: 'MPV', price: 350000, image: 'https://images.unsplash.com/photo-1581540619870-3e2daf0cbe2b?w=400&h=250&fit=crop', seats: 7, transmission: 'Manual', fuel: 'Bensin', available: true, description: 'MPV modern dengan desain stylish dan harga terjangkau.' },
    { id: 9, name: 'Toyota Camry', category: 'Sedan', price: 700000, image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=400&h=250&fit=crop', seats: 5, transmission: 'Automatic', fuel: 'Bensin', available: true, description: 'Sedan eksekutif dengan kabin mewah dan fitur lengkap.' },
    { id: 10, name: 'Daihatsu Terios', category: 'SUV', price: 400000, image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&h=250&fit=crop', seats: 5, transmission: 'Manual', fuel: 'Bensin', available: true, description: 'SUV kompak yang cocok untuk petualangan akhir pekan.' },
    { id: 11, name: 'Honda CR-V', category: 'SUV', price: 650000, image: 'https://images.unsplash.com/photo-1568844293986-8d0400bd4745?w=400&h=250&fit=crop', seats: 5, transmission: 'Automatic', fuel: 'Bensin', available: true, description: 'SUV premium dengan kenyamanan dan teknologi terkini.' },
    { id: 12, name: 'Toyota Alphard', category: 'Luxury', price: 1500000, image: 'https://images.unsplash.com/photo-1600472024671-c916878b4884?w=400&h=250&fit=crop', seats: 7, transmission: 'Automatic', fuel: 'Bensin', available: true, description: 'MPV mewah dengan kenyamanan kelas dunia untuk perjalanan istimewa.' },
];

const STORAGE_KEYS = {
    cars: 'rentalCars',
    bookings: 'rentalBookings',
};

let cars = [];
let bookings = [];

let apiToken = localStorage.getItem('apiToken') || '';

function apiHeaders(extra = {}) {
    const headers = { 'Content-Type': 'application/json', ...extra };
    if (apiToken) headers['Authorization'] = `Bearer ${apiToken}`;
    return headers;
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
        const msg = await res.json().catch(() => ({}));
        throw new Error(msg.message || `HTTP ${res.status}`);
    }
    return await res.json();
}

async function apiPut(endpoint, body) {
    const res = await fetch(`${API_BASE}/api${endpoint}`, {
        method: 'PUT', headers: apiHeaders(), body: JSON.stringify(body),
    });
    if (!res.ok) {
        const msg = await res.json().catch(() => ({}));
        throw new Error(msg.message || `HTTP ${res.status}`);
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

async function loadFromApi() {
    try {
        cars = await apiGet('/cars');
        if (apiToken) {
            bookings = await apiGet('/bookings').catch(() => []);
        }
        return true;
    } catch {
        return false;
    }
}

async function loadFromStorage() {
    try {
        const c = localStorage.getItem(STORAGE_KEYS.cars);
        cars = c ? JSON.parse(c) : [...DEFAULT_CARS];
        const b = localStorage.getItem(STORAGE_KEYS.bookings);
        bookings = b ? JSON.parse(b) : [];
        return true;
    } catch {
        cars = [...DEFAULT_CARS];
        bookings = [];
        return true;
    }
}

function saveCars() {
    if (!USE_API) {
        localStorage.setItem(STORAGE_KEYS.cars, JSON.stringify(cars));
    }
}

function saveBookings() {
    if (!USE_API) {
        localStorage.setItem(STORAGE_KEYS.bookings, JSON.stringify(bookings));
    }
}

function formatPrice(num) {
    return 'Rp ' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function getNextId(arr) {
    return arr.length ? Math.max(...arr.map(i => i.id)) + 1 : 1;
}

document.addEventListener('DOMContentLoaded', async () => {
    initNavigation();
    initModals();
    initApiConfig();

    const loaded = USE_API ? await loadFromApi() : await loadFromStorage();
    if (!loaded) await loadFromStorage();

    renderCars();
    populateBookingCarSelect();
    initBookingForm();
    initAdminTab();
    initAdminLogin();
    initCarForm();
    initContactForm();
    observeStats();
    renderAdminBookings();
    renderAdminCars();

    if (!USE_API) {
        document.getElementById('filterCategory').addEventListener('change', () => renderCars());
        document.getElementById('filterTransmission').addEventListener('change', () => renderCars());
        document.getElementById('filterSort').addEventListener('change', () => renderCars());
    } else {
        document.getElementById('filterCategory').addEventListener('change', () => fetchAndRenderCars());
        document.getElementById('filterTransmission').addEventListener('change', () => fetchAndRenderCars());
        document.getElementById('filterSort').addEventListener('change', () => fetchAndRenderCars());
    }

    document.getElementById('bookCar').addEventListener('change', updateBookingTotal);
    document.getElementById('bookStart').addEventListener('change', updateBookingTotal);
    document.getElementById('bookEnd').addEventListener('change', updateBookingTotal);
});

function initNavigation() {
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('navMenu');
    const links = menu.querySelectorAll('a');

    toggle.addEventListener('click', () => {
        menu.classList.toggle('active');
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('active');
            links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 150;

        sections.forEach(section => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            const id = section.getAttribute('id');
            const link = menu.querySelector(`a[href="#${id}"]`);
            if (link && scrollPos >= top && scrollPos < bottom) {
                links.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });
}

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
    alert(
        `${car.name}\n\n` +
        `Kategori: ${car.category}\n` +
        `Harga: ${formatPrice(car.price)} / hari\n` +
        `Kursi: ${car.seats}\n` +
        `Transmisi: ${car.transmission}\n` +
        `Bahan Bakar: ${car.fuel}\n` +
        `Status: ${car.available ? 'Tersedia' : 'Tidak Tersedia'}\n\n` +
        `${car.description}`
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

function initBookingForm() {
    const form = document.getElementById('bookingForm');

    const today = new Date().toISOString().split('T')[0];
    document.getElementById('bookStart').setAttribute('min', today);

    document.getElementById('bookStart').addEventListener('change', function() {
        document.getElementById('bookEnd').setAttribute('min', this.value);
        if (document.getElementById('bookEnd').value && document.getElementById('bookEnd').value < this.value) {
            document.getElementById('bookEnd').value = this.value;
        }
        updateBookingTotal();
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const carId = parseInt(document.getElementById('bookCar').value);
        const name = document.getElementById('bookName').value.trim();
        const phone = document.getElementById('bookPhone').value.trim();
        const email = document.getElementById('bookEmail').value.trim();
        const address = document.getElementById('bookAddress').value.trim();
        const start = document.getElementById('bookStart').value;
        const end = document.getElementById('bookEnd').value;
        const notes = document.getElementById('bookNotes').value.trim();

        if (!carId) {
            alert('Silakan pilih mobil terlebih dahulu.');
            return;
        }

        const car = cars.find(c => c.id === carId);
        if (!car) {
            alert('Mobil tidak ditemukan. Silakan pilih mobil lain.');
            return;
        }

        const startDate = new Date(start);
        const endDate = new Date(end);
        const diffDays = Math.ceil(Math.abs(endDate - startDate) / (1000 * 60 * 60 * 24));

        if (diffDays <= 0) {
            alert('Tanggal selesai harus setelah tanggal mulai.');
            return;
        }

        const total = car.price * diffDays;

        if (USE_API) {
            try {
                await apiPost('/bookings', {
                    car_id: car.id,
                    customer_name: name,
                    phone,
                    email,
                    address,
                    start_date: start,
                    end_date: end,
                    days: diffDays,
                    total_price: total,
                    status: 'confirmed',
                    notes,
                });
                bookings = await apiGet('/bookings');
            } catch (err) {
                alert('Gagal booking melalui server: ' + err.message);
                return;
            }
        } else {
            const booking = {
                id: getNextId(bookings),
                carId: car.id,
                carName: car.name,
                customerName: name,
                phone,
                email,
                address,
                startDate: start,
                endDate: end,
                days: diffDays,
                totalPrice: total,
                status: 'confirmed',
                notes,
                createdAt: new Date().toISOString(),
            };
            bookings.push(booking);
            saveBookings();
        }

        renderAdminBookings();

        document.getElementById('modalCustomerName').textContent = name;
        document.getElementById('modalCarName').textContent = car.name;
        document.getElementById('modalDetails').innerHTML = `
            <p><strong>Mobil:</strong> ${car.name}</p>
            <p><strong>Nama:</strong> ${name}</p>
            <p><strong>Telepon:</strong> ${phone}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Alamat:</strong> ${address}</p>
            <p><strong>Tanggal:</strong> ${start} s/d ${end} (${diffDays} hari)</p>
            <p><strong>Total:</strong> ${formatPrice(total)}</p>
        `;

        document.getElementById('bookingModal').classList.add('active');
        form.reset();
        document.querySelector('#bookingTotal strong').textContent = 'Rp 0';
        populateBookingCarSelect();
    });
}

function initAdminLogin() {
    const form = document.getElementById('adminLoginForm');
    const loginDiv = document.getElementById('adminLogin');
    const panelDiv = document.getElementById('adminPanel');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('adminEmail').value.trim();
        const pass = document.getElementById('adminPass').value;

        if (USE_API) {
            try {
                const data = await apiLogin(email, pass);
                apiToken = data.token;
                localStorage.setItem('apiToken', apiToken);
                await loadFromApi();
            } catch (err) {
                alert('Login gagal: ' + err.message);
                return;
            }
        } else if (pass !== 'admin123') {
            alert('Password salah! Coba lagi.');
            form.reset();
            return;
        }

        loginDiv.style.display = 'none';
        panelDiv.style.display = 'block';
        renderAdminBookings();
        renderAdminCars();
        form.reset();
    });

    document.getElementById('adminLogout').addEventListener('click', async () => {
        if (USE_API && apiToken) {
            try { await apiPost('/logout'); } catch {}
            apiToken = '';
            localStorage.removeItem('apiToken');
        }
        loginDiv.style.display = 'block';
        panelDiv.style.display = 'none';
        document.getElementById('adminPass').value = '';
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
                    <button class="action-btn delete" onclick="confirmDeleteBooking(${b.id})" title="Hapus">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

async function updateBookingStatus(id, status) {
    if (USE_API) {
        try {
            await apiPut(`/bookings/${id}/status`, { status });
            bookings = await apiGet('/bookings');
        } catch (err) {
            alert('Gagal update status: ' + err.message);
            return;
        }
    } else {
        const booking = bookings.find(b => b.id === id);
        if (booking) booking.status = status;
        saveBookings();
    }
    renderAdminBookings();
}

function confirmDeleteBooking(id) {
    document.getElementById('deleteModalMessage').textContent =
        'Apakah Anda yakin ingin menghapus booking #' + id + '?';
    document.getElementById('confirmDelete').onclick = async () => {
        if (USE_API) {
            try {
                await apiDelete(`/bookings/${id}`);
                bookings = await apiGet('/bookings');
            } catch (err) {
                alert('Gagal hapus booking: ' + err.message);
                return;
            }
        } else {
            bookings = bookings.filter(b => b.id !== id);
            saveBookings();
        }
        renderAdminBookings();
        document.getElementById('deleteModal').classList.remove('active');
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
                <span class="status-badge ${c.available ? 'confirmed' : 'cancelled'}">
                    ${c.available ? 'Tersedia' : 'Tidak'}
                </span>
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

function initCarForm() {
    const form = document.getElementById('carForm');
    const cancelBtn = document.getElementById('carFormCancel');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = document.getElementById('carFormId').value;
        const name = document.getElementById('carName').value.trim();
        const category = document.getElementById('carCategory').value;
        const price = parseInt(document.getElementById('carPrice').value);
        const image = document.getElementById('carImage').value.trim();
        const seats = parseInt(document.getElementById('carSeats').value);
        const transmission = document.getElementById('carTransmission').value;
        const description = document.getElementById('carDescription').value.trim();

        if (USE_API) {
            try {
                const payload = { name, category, price, image, seats, transmission, description, available: true, fuel: 'Bensin' };
                if (id) {
                    await apiPut(`/cars/${id}`, payload);
                } else {
                    await apiPost('/cars', payload);
                }
                cars = await apiGet('/cars');
            } catch (err) {
                alert('Gagal simpan mobil: ' + err.message);
                return;
            }
        } else {
            if (id) {
                const car = cars.find(c => c.id === parseInt(id));
                if (car) {
                    Object.assign(car, { name, category, price, image, seats, transmission, description });
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
        renderAdminCars();
        populateBookingCarSelect();
        form.reset();
        document.getElementById('carFormId').value = '';
        cancelBtn.style.display = 'none';
        alert('Mobil berhasil disimpan!');
    });

    cancelBtn.addEventListener('click', () => {
        form.reset();
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
    document.getElementById('carImage').value = car.image;
    document.getElementById('carSeats').value = car.seats;
    document.getElementById('carTransmission').value = car.transmission;
    document.getElementById('carDescription').value = car.description || '';

    document.getElementById('carFormCancel').style.display = 'inline-flex';

    document.querySelector('.admin-tab[data-tab="add-car"]').click();
    window.scrollTo({ top: document.getElementById('admin').offsetTop - 100, behavior: 'smooth' });
}

function confirmDeleteCar(id) {
    const carName = cars.find(c => c.id === id)?.name;
    document.getElementById('deleteModalMessage').textContent =
        'Apakah Anda yakin ingin menghapus mobil ' + carName + '?';
    document.getElementById('confirmDelete').onclick = async () => {
        if (USE_API) {
            try {
                await apiDelete(`/cars/${id}`);
                cars = await apiGet('/cars');
            } catch (err) {
                alert('Gagal hapus mobil: ' + err.message);
                return;
            }
        } else {
            cars = cars.filter(c => c.id !== id);
            saveCars();
        }
        renderCars();
        renderAdminCars();
        populateBookingCarSelect();
        document.getElementById('deleteModal').classList.remove('active');
    };
    document.getElementById('deleteModal').classList.add('active');
}

function initContactForm() {
    document.getElementById('contactForm').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Terima kasih! Pesan Anda telah kami terima. Kami akan menghubungi Anda segera.');
        e.target.reset();
    });
}

function initModals() {
    document.querySelectorAll('.modal-close, .modal-close-btn').forEach(el => {
        el.addEventListener('click', () => {
            document.querySelectorAll('.modal.active').forEach(m => m.classList.remove('active'));
        });
    });

    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
}

function observeStats() {
    const stats = document.querySelectorAll('.stat-number');
    if (!stats.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => observer.observe(stat));
}

function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    if (isNaN(target) || target <= 0) { el.textContent = '0'; return; }
    const duration = 1500;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);

        el.textContent = current.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            el.textContent = target.toLocaleString() + '+';
        }
    }

    requestAnimationFrame(update);
}

function initApiConfig() {
    const input = document.getElementById('apiBaseUrl');
    const form = document.getElementById('apiConfigForm');
    if (!input || !form) return;

    input.value = API_BASE;

    const statusEl = document.createElement('p');
    statusEl.style.cssText = 'margin-top:12px;font-size:0.9rem;';
    if (USE_API) {
        statusEl.innerHTML = apiToken
            ? '<span style="color:var(--success);">Terhubung ke API &#10003;</span>'
            : '<span style="color:var(--warning);">Mode API aktif, tapi belum login ke admin</span>';
    }
    form.after(statusEl);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const url = input.value.trim().replace(/\/+$/, '');
        if (url) {
            localStorage.setItem('apiBase', url);
            if (apiToken) localStorage.setItem('apiToken', apiToken);
            alert('API Base URL disimpan. Refresh halaman untuk menggunakan backend.');
        } else {
            localStorage.removeItem('apiBase');
            localStorage.removeItem('apiToken');
            apiToken = '';
            alert('Mode localStorage diaktifkan. Refresh halaman untuk menggunakan data lokal.');
        }
    });
}
