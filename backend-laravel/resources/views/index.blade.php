<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rental Mobil - Sewa Mobil Terpercaya</title>
    <link rel="stylesheet" href="{{ asset('css/reset.css') }}">
    <link rel="stylesheet" href="{{ asset('css/layout.css') }}">
    <link rel="stylesheet" href="{{ asset('css/components.css') }}">
    <link rel="stylesheet" href="{{ asset('css/admin.css') }}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</head>
<body>
    <nav class="navbar">
        <div class="container">
            <a href="#" class="nav-brand">
                <i class="fas fa-car"></i> Rental Mobil
            </a>
            <div class="nav-toggle" id="navToggle">
                <i class="fas fa-bars"></i>
            </div>
            <ul class="nav-menu" id="navMenu">
                <li><a href="#home" class="active">Beranda</a></li>
                <li><a href="#cars">Mobil</a></li>
                <li><a href="#booking">Booking</a></li>
                <li><a href="#contact">Kontak</a></li>
                <li><a href="/login" class="btn-admin-nav">Admin</a></li>
            </ul>
        </div>
    </nav>

    <section id="home" class="hero">
        <div class="hero-overlay"></div>
        <div class="container hero-content">
            <h1>Sewa Mobil <span>Mudah & Cepat</span></h1>
            <p>Nikmati perjalanan Anda dengan layanan rental mobil terpercaya. Harga bersaing, mobil berkualitas, dan pelayanan terbaik.</p>
            <div class="hero-buttons">
                <a href="#cars" class="btn btn-primary">Lihat Mobil <i class="fas fa-arrow-right"></i></a>
                <a href="#booking" class="btn btn-outline">Booking Sekarang</a>
            </div>
            <div class="hero-stats">
                <div class="stat">
                    <span class="stat-number" data-target="50">0</span>
                    <span class="stat-label">Mobil</span>
                </div>
                <div class="stat">
                    <span class="stat-number" data-target="500">0</span>
                    <span class="stat-label">Pelanggan</span>
                </div>
                <div class="stat">
                    <span class="stat-number" data-target="5">0</span>
                    <span class="stat-label">Tahun</span>
                </div>
            </div>
        </div>
    </section>

    <section id="cars" class="section cars-section">
        <div class="container">
            <div class="section-header">
                <h2>Daftar Mobil</h2>
                <p>Pilih mobil yang sesuai dengan kebutuhan Anda</p>
            </div>
            <div class="car-filters">
                <div class="filter-group">
                    <select id="filterCategory">
                        <option value="all">Semua Kategori</option>
                        <option value="MPV">MPV</option>
                        <option value="SUV">SUV</option>
                        <option value="Sedan">Sedan</option>
                        <option value="Hatchback">Hatchback</option>
                        <option value="Luxury">Luxury</option>
                    </select>
                    <select id="filterTransmission">
                        <option value="all">Semua Transmisi</option>
                        <option value="Manual">Manual</option>
                        <option value="Automatic">Matic</option>
                    </select>
                    <select id="filterSort">
                        <option value="default">Urutkan</option>
                        <option value="price-asc">Harga Terendah</option>
                        <option value="price-desc">Harga Tertinggi</option>
                        <option value="name">Nama A-Z</option>
                    </select>
                </div>
            </div>
            <div class="cars-grid" id="carsGrid"></div>
            <div class="pagination" id="carsPagination"></div>
        </div>
    </section>

    <section id="booking" class="section booking-section">
        <div class="container">
            <div class="section-header">
                <h2>Booking Mobil</h2>
                <p>Isi form di bawah untuk menyewa mobil</p>
            </div>
            <div class="booking-wrapper" id="bookingWrapper">
                <div class="booking-info">
                    <i class="fas fa-info-circle"></i>
                    <p>Silakan pilih mobil terlebih dahulu dari halaman <a href="#cars">Daftar Mobil</a> atau pilih langsung di form.</p>
                </div>
                    <form class="booking-form" id="bookingForm" novalidate>
                        <div class="form-group">
                            <label for="bookCar">Pilih Mobil</label>
                            <select id="bookCar" name="car_id" data-validate="required"></select>
                            <div class="form-error"></div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="bookName">Nama Lengkap</label>
                                <input type="text" id="bookName" name="customer_name" placeholder="Masukkan nama Anda" data-validate="required,minLength:3">
                                <div class="form-error"></div>
                            </div>
                            <div class="form-group">
                                <label for="bookPhone">No. Telepon</label>
                                <input type="tel" id="bookPhone" name="phone" placeholder="08xxxxxxxxxx" data-validate="required,phone">
                                <div class="form-error"></div>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="bookEmail">Email</label>
                                <input type="email" id="bookEmail" name="email" placeholder="email@example.com" data-validate="required,email">
                                <div class="form-error"></div>
                            </div>
                            <div class="form-group">
                                <label for="bookAddress">Alamat</label>
                                <input type="text" id="bookAddress" name="address" placeholder="Alamat lengkap" data-validate="required,minLength:5">
                                <div class="form-error"></div>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="bookStart">Tanggal Mulai</label>
                                <input type="date" id="bookStart" name="start_date" data-validate="required">
                                <div class="form-error"></div>
                            </div>
                            <div class="form-group">
                                <label for="bookEnd">Tanggal Selesai</label>
                                <input type="date" id="bookEnd" name="end_date" data-validate="required,dateAfter:bookStart">
                                <div class="form-error"></div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="bookNotes">Catatan Tambahan</label>
                            <textarea id="bookNotes" name="notes" placeholder="Catatan (opsional)"></textarea>
                            <div class="form-error"></div>
                        </div>
                    <div class="booking-total" id="bookingTotal">
                        <span>Total: </span>
                        <strong>Rp 0</strong>
                    </div>
                    <button type="submit" class="btn btn-primary btn-block">
                        <i class="fas fa-check"></i> Booking Sekarang
                    </button>
                </form>
            </div>
        </div>
    </section>

    <section id="contact" class="section contact-section">
        <div class="container">
            <div class="section-header">
                <h2>Kontak Kami</h2>
                <p>Hubungi kami untuk informasi lebih lanjut</p>
            </div>
            <div class="contact-wrapper">
                <div class="contact-info">
                    <div class="contact-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <div>
                            <h4>Alamat</h4>
                            <p>Jl. Merdeka No. 123, Jakarta Pusat</p>
                        </div>
                    </div>
                    <div class="contact-item">
                        <i class="fas fa-phone"></i>
                        <div>
                            <h4>Telepon</h4>
                            <p>+62 812-3456-7890</p>
                        </div>
                    </div>
                    <div class="contact-item">
                        <i class="fas fa-envelope"></i>
                        <div>
                            <h4>Email</h4>
                            <p>info@rentalmobil.com</p>
                        </div>
                    </div>
                    <div class="contact-item">
                        <i class="fas fa-clock"></i>
                        <div>
                            <h4>Jam Operasional</h4>
                            <p>Senin - Sabtu: 08:00 - 20:00</p>
                        </div>
                    </div>
                </div>
                <form class="contact-form" id="contactForm">
                    <div class="form-group">
                        <input type="text" placeholder="Nama Anda" required>
                    </div>
                    <div class="form-group">
                        <input type="email" placeholder="Email Anda" required>
                    </div>
                    <div class="form-group">
                        <textarea placeholder="Pesan Anda" rows="4" required></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Kirim Pesan</button>
                </form>
            </div>
        </div>
    </section>

    <section id="admin" class="section admin-section">
        <div class="container">
            <div class="section-header">
                <h2>Panel Admin</h2>
                <p>Kelola data mobil dan booking</p>
            </div>

            <div id="adminLoginPrompt" class="admin-login" style="display:none;">
                <div class="admin-login-box">
                    <i class="fas fa-lock"></i>
                    <h3>Login Diperlukan</h3>
                    <p style="color:var(--text-light);margin-bottom:20px;">Silakan login terlebih dahulu untuk mengakses panel admin.</p>
                    <a href="/login" class="btn btn-primary" style="text-decoration:none;">
                        <i class="fas fa-sign-in-alt"></i> Login Admin
                    </a>
                    <small style="display:block;margin-top:16px;color:var(--text-light);">
                        Belum punya akun? <a href="/register" style="color:var(--primary);font-weight:600;">Daftar di sini</a>
                    </small>
                </div>
            </div>

            <div class="admin-panel" id="adminPanel" style="display:none;">
                <div class="admin-tabs">
                    <button class="admin-tab active" data-tab="dashboard">
                        <i class="fas fa-chart-bar"></i> Dashboard
                    </button>
                    <button class="admin-tab" data-tab="bookings">
                        <i class="fas fa-calendar-check"></i> Booking
                    </button>
                    <button class="admin-tab" data-tab="cars-manage">
                        <i class="fas fa-car"></i> Kelola Mobil
                    </button>
                    <button class="admin-tab" data-tab="add-car">
                        <i class="fas fa-plus-circle"></i> Tambah Mobil
                    </button>
                    <button class="admin-tab" data-tab="api-config">
                        <i class="fas fa-plug"></i> API
                    </button>
                    <button class="admin-tab btn-logout" id="adminLogout">
                        <i class="fas fa-sign-out-alt"></i> Logout
                    </button>
                </div>

                <div class="admin-content">
                    <div class="admin-tab-content active" id="tab-dashboard">
                        <h3>Dashboard</h3>
                        <div class="stats-grid" id="statsGrid"></div>
                        <div class="stats-charts">
                            <div class="stats-card">
                                <h4>Booking per Status</h4>
                                <div id="statsStatusChart"></div>
                            </div>
                            <div class="stats-card">
                                <h4>Pendapatan Bulanan</h4>
                                <div id="statsRevenueChart"></div>
                            </div>
                        </div>
                        <div class="stats-card" style="margin-top:24px;">
                            <h4>Booking Terbaru</h4>
                            <div id="statsRecentBookings"></div>
                        </div>
                    </div>
                    <div class="admin-tab-content" id="tab-bookings">
                        <h3>Daftar Booking</h3>
                        <div class="search-bar" id="bookingSearchBar">
                            <input type="text" id="bookingSearchInput" placeholder="Cari nama, email, atau telepon..." />
                            <button class="btn btn-primary" onclick="searchBookings()" style="padding:10px 20px;white-space:nowrap;">
                                <i class="fas fa-search"></i> Cari
                            </button>
                        </div>
                        <div class="table-wrapper">
                            <table class="admin-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Mobil</th>
                                        <th>Penyewa</th>
                                        <th>Telepon</th>
                                        <th>Tanggal</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                        <th>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody id="bookingsTableBody"></tbody>
                            </table>
                        </div>
                    </div>

                    <div class="admin-tab-content" id="tab-cars-manage">
                        <h3>Daftar Mobil</h3>
                        <div class="table-wrapper">
                            <table class="admin-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nama</th>
                                        <th>Kategori</th>
                                        <th>Harga/Hari</th>
                                        <th>Transmisi</th>
                                        <th>Kursi</th>
                                        <th>Status</th>
                                        <th>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody id="carsTableBody"></tbody>
                            </table>
                        </div>
                    </div>

                    <div class="admin-tab-content" id="tab-add-car">
                        <h3>Tambah / Edit Mobil</h3>
                         <form class="car-form" id="carForm" novalidate>
                            <input type="hidden" id="carFormId">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="carName">Nama Mobil</label>
                                    <input type="text" id="carName" name="name" data-validate="required,minLength:2">
                                    <div class="form-error"></div>
                                </div>
                                <div class="form-group">
                                    <label for="carCategory">Kategori</label>
                                    <select id="carCategory" name="category" data-validate="required">
                                        <option value="">-- Pilih --</option>
                                        <option value="MPV">MPV</option>
                                        <option value="SUV">SUV</option>
                                        <option value="Sedan">Sedan</option>
                                        <option value="Hatchback">Hatchback</option>
                                        <option value="Luxury">Luxury</option>
                                    </select>
                                    <div class="form-error"></div>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="carPrice">Harga per Hari (Rp)</label>
                                    <input type="number" id="carPrice" name="price" data-validate="required,positive">
                                    <div class="form-error"></div>
                                </div>
                                <div class="form-group">
                                    <label for="carImage">Gambar Mobil</label>
                                    <input type="file" id="carImage" name="image" accept="image/jpeg,image/png,image/jpg,image/webp">
                                    <div class="form-error"></div>
                                    <div id="carImagePreview" class="image-preview" style="display:none;margin-top:8px;"></div>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="carSeats">Jumlah Kursi</label>
                                    <input type="number" id="carSeats" name="seats" data-validate="required,min:1">
                                    <div class="form-error"></div>
                                </div>
                                <div class="form-group">
                                    <label for="carTransmission">Transmisi</label>
                                    <select id="carTransmission" name="transmission" data-validate="required">
                                        <option value="">-- Pilih --</option>
                                        <option value="Manual">Manual</option>
                                        <option value="Automatic">Matic</option>
                                    </select>
                                    <div class="form-error"></div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="carDescription">Deskripsi</label>
                                <textarea id="carDescription" name="description" rows="3"></textarea>
                                <div class="form-error"></div>
                            </div>
                            <div class="form-actions">
                                <button type="submit" class="btn btn-primary">
                                    <i class="fas fa-save"></i> Simpan Mobil
                                </button>
                                <button type="button" class="btn btn-outline" id="carFormCancel" style="display:none;">
                                    Batal
                                </button>
                            </div>
                        </form>
                    </div>

                    <div class="admin-tab-content" id="tab-api-config">
                        <h3>Konfigurasi API Backend</h3>
                        <p style="margin-bottom:20px;color:var(--text-light);">Frontend dapat menggunakan localStorage (tanpa backend) atau terhubung ke Laravel API.</p>
                        <form class="car-form" id="apiConfigForm">
                            <div class="form-group">
                                <label for="apiBaseUrl">Base URL Backend</label>
                                <div class="form-row" style="grid-template-columns:1fr auto;gap:8px;">
                                    <input type="text" id="apiBaseUrl" placeholder="http://localhost:8000" style="font-family:monospace;">
                                    <button type="submit" class="btn btn-primary" style="white-space:nowrap;">
                                        <i class="fas fa-link"></i> Hubungkan
                                    </button>
                                </div>
                                <small style="color:var(--text-light);">
                                    Kosongkan untuk mode localStorage. Isi URL backend Laravel: http://localhost:8000
                                </small>
                            </div>
                        </form>
                        <div style="margin-top:24px;padding:16px;background:var(--primary-light);border-radius:8px;">
                            <h4 style="margin-bottom:8px;">Cara Menjalankan Backend Laravel</h4>
                            <div style="font-size:0.9rem;line-height:1.8;">
                                <pre style="background:#1e293b;color:#e2e8f0;padding:12px;border-radius:6px;margin:8px 0 0;overflow-x:auto;">
cd backend-laravel
copy .env.example .env   # lalu atur DB_DATABASE=car_rental
php artisan migrate --seed
php artisan serve</pre>
                            </div>
                        </div>
                        <div style="margin-top:24px;padding:16px;background:var(--bg-alt);border-radius:8px;border:1px solid var(--border);">
                            <h4 style="margin-bottom:8px;">Endpoint API</h4>
                            <div style="font-size:0.85rem;line-height:1.8;color:var(--text-light);">
                                <code>GET /api/cars</code> - Daftar semua mobil<br>
                                <code>GET /api/cars/{id}</code> - Detail mobil<br>
                                <code>POST /api/cars</code> - Tambah mobil (admin)<br>
                                <code>PUT /api/cars/{id}</code> - Edit mobil (admin)<br>
                                <code>DELETE /api/cars/{id}</code> - Hapus mobil (admin)<br>
                                <code>GET /api/bookings</code> - Daftar booking (admin)<br>
                                <code>POST /api/bookings</code> - Buat booking<br>
                                <code>PUT /api/bookings/{id}/status</code> - Update status booking (admin)<br>
                                <code>DELETE /api/bookings/{id}</code> - Hapus booking (admin)
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-brand">
                    <i class="fas fa-car"></i> Rental Mobil
                    <p>Solusi sewa mobil terpercaya untuk perjalanan Anda.</p>
                </div>
                <div class="footer-links">
                    <h4>Menu</h4>
                    <ul>
                        <li><a href="#home">Beranda</a></li>
                        <li><a href="#cars">Mobil</a></li>
                        <li><a href="#booking">Booking</a></li>
                        <li><a href="#contact">Kontak</a></li>
                    </ul>
                </div>
                <div class="footer-links">
                    <h4>Kontak</h4>
                    <ul>
                        <li><i class="fas fa-phone"></i> +62 812-3456-7890</li>
                        <li><i class="fas fa-envelope"></i> info@rentalmobil.com</li>
                        <li><i class="fas fa-map-marker-alt"></i> Jakarta Pusat</li>
                    </ul>
                </div>
                <div class="footer-social">
                    <h4>Ikuti Kami</h4>
                    <div class="social-icons">
                        <a href="#"><i class="fab fa-instagram"></i></a>
                        <a href="#"><i class="fab fa-facebook"></i></a>
                        <a href="#"><i class="fab fa-whatsapp"></i></a>
                        <a href="#"><i class="fab fa-youtube"></i></a>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2026 Rental Mobil. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <div class="modal" id="carDetailModal">
        <div class="modal-content modal-lg">
            <span class="modal-close">&times;</span>
            <div class="modal-body" id="carDetailBody" style="text-align:left;padding:0;"></div>
        </div>
    </div>

    <div class="modal" id="bookingModal">
        <div class="modal-content">
            <span class="modal-close">&times;</span>
            <div class="modal-body">
                <i class="fas fa-check-circle modal-icon"></i>
                <h3>Booking Berhasil!</h3>
                <p>Terima kasih, <span id="modalCustomerName"></span>!</p>
                <p>Booking mobil <strong id="modalCarName"></strong> Anda telah dikonfirmasi.</p>
                <div class="modal-details" id="modalDetails"></div>
                <p class="modal-note">Tim kami akan menghubungi Anda untuk detail lebih lanjut.</p>
            </div>
        </div>
    </div>

    <div class="modal" id="editBookingModal">
        <div class="modal-content">
            <span class="modal-close">&times;</span>
            <div class="modal-body" style="text-align:left;">
                <h3 style="margin-bottom:20px;">Edit Booking</h3>
                <form id="editBookingForm" novalidate>
                    <input type="hidden" id="editBookingId">
                    <div class="form-group">
                        <label for="editBookCar">Mobil</label>
                        <select id="editBookCar" name="car_id" data-validate="required"></select>
                        <div class="form-error"></div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="editBookName">Nama Penyewa</label>
                            <input type="text" id="editBookName" name="customer_name" data-validate="required,minLength:3">
                            <div class="form-error"></div>
                        </div>
                        <div class="form-group">
                            <label for="editBookPhone">No. Telepon</label>
                            <input type="tel" id="editBookPhone" name="phone" data-validate="required,phone">
                            <div class="form-error"></div>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="editBookEmail">Email</label>
                            <input type="email" id="editBookEmail" name="email" data-validate="required,email">
                            <div class="form-error"></div>
                        </div>
                        <div class="form-group">
                            <label for="editBookAddress">Alamat</label>
                            <input type="text" id="editBookAddress" name="address" data-validate="required,minLength:5">
                            <div class="form-error"></div>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="editBookStart">Tanggal Mulai</label>
                            <input type="date" id="editBookStart" name="start_date" data-validate="required">
                            <div class="form-error"></div>
                        </div>
                        <div class="form-group">
                            <label for="editBookEnd">Tanggal Selesai</label>
                            <input type="date" id="editBookEnd" name="end_date" data-validate="required">
                            <div class="form-error"></div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="editBookNotes">Catatan</label>
                        <textarea id="editBookNotes" name="notes" rows="2"></textarea>
                        <div class="form-error"></div>
                    </div>
                    <div style="display:flex;gap:12px;margin-top:16px;">
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> Simpan
                        </button>
                        <button type="button" class="btn btn-outline modal-close-btn" style="color:var(--text);border-color:var(--border);">Batal</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <div class="modal" id="deleteModal">
        <div class="modal-content modal-sm">
            <span class="modal-close">&times;</span>
            <div class="modal-body">
                <i class="fas fa-exclamation-triangle modal-icon" style="color:var(--danger);"></i>
                <h3>Konfirmasi Hapus</h3>
                <p id="deleteModalMessage">Apakah Anda yakin ingin menghapus data ini?</p>
                <div class="modal-actions">
                    <button class="btn btn-danger" id="confirmDelete">Hapus</button>
                    <button class="btn btn-outline modal-close-btn">Batal</button>
                </div>
            </div>
        </div>
    </div>

    <a href="https://wa.me/6281234567890" class="wa-float" target="_blank">
        <i class="fab fa-whatsapp"></i>
    </a>

    <div class="toast-container" id="toastContainer"></div>
    <script src="{{ asset('js/utils.js') }}"></script>
    <script src="{{ asset('js/validators.js') }}"></script>
    <script src="{{ asset('js/api.js') }}"></script>
    <script src="{{ asset('js/store.js') }}"></script>
    <script src="{{ asset('js/components/cars.js') }}"></script>
    <script src="{{ asset('js/components/booking.js') }}"></script>
    <script src="{{ asset('js/components/admin.js') }}"></script>
    <script src="{{ asset('js/app.js') }}"></script>
</body>
</html>
