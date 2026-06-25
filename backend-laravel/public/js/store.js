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

let carsPagination = { currentPage: 1, lastPage: 1, total: 0, perPage: 8 };
let bookingsPagination = { currentPage: 1, lastPage: 1, total: 0, perPage: 100 };

async function loadFromApi() {
    try {
        showCarsLoading();
        const res = await apiGetRaw(`/cars?per_page=${carsPagination.perPage}&page=1`);
        cars = res.data || [];
        carsPagination.currentPage = res.current_page || 1;
        carsPagination.lastPage = res.last_page || 1;
        carsPagination.total = res.total || 0;
        if (apiToken) {
            const bRes = await apiGetRaw(`/bookings?per_page=${bookingsPagination.perPage}&page=1`).catch(() => ({}));
            bookings = bRes.data || [];
            bookingsPagination.currentPage = bRes.current_page || 1;
            bookingsPagination.lastPage = bRes.last_page || 1;
            bookingsPagination.total = bRes.total || 0;
        }
        hideCarsLoading();
        return true;
    } catch (err) {
        hideCarsLoading();
        const grid = document.getElementById('carsGrid');
        grid.innerHTML = `
            <div class="no-data" style="grid-column:1/-1;">
                <i class="fas fa-plug"></i>
                <h3 style="margin-bottom:8px;">Gagal Terhubung ke Server</h3>
                <p>Tidak dapat terhubung ke backend di <strong>${API_BASE}</strong></p>
                <p style="margin-top:8px;font-size:0.85rem;">${err.message}</p>
                <button class="btn btn-outline" style="margin-top:16px;color:var(--text);border-color:var(--border);" onclick="location.reload()">
                    <i class="fas fa-sync"></i> Coba Lagi
                </button>
            </div>`;
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
