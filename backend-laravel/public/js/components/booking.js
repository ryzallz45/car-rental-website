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

    initFieldValidation(form);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearFieldErrors();
        if (!validateForm(form)) {
            showToast('Periksa kembali input Anda.', 'warning', 'Validasi Gagal');
            return;
        }

        const carId = parseInt(document.getElementById('bookCar').value);
        const name = document.getElementById('bookName').value.trim();
        const phone = document.getElementById('bookPhone').value.trim();
        const email = document.getElementById('bookEmail').value.trim();
        const address = document.getElementById('bookAddress').value.trim();
        const start = document.getElementById('bookStart').value;
        const end = document.getElementById('bookEnd').value;
        const notes = document.getElementById('bookNotes').value.trim();

        if (!carId) {
            showToast('Silakan pilih mobil terlebih dahulu.', 'warning');
            return;
        }

        const car = cars.find(c => c.id === carId);
        if (!car) {
            showToast('Mobil tidak ditemukan. Silakan pilih mobil lain.', 'error');
            return;
        }

        const startDate = new Date(start);
        const endDate = new Date(end);
        const diffDays = Math.ceil(Math.abs(endDate - startDate) / (1000 * 60 * 60 * 24));

        if (diffDays <= 0) {
            showToast('Tanggal selesai harus setelah tanggal mulai.', 'warning');
            return;
        }

        const total = car.price * diffDays;
        const submitBtn = form.querySelector('button[type="submit"]');
        setLoading(submitBtn, true);

        if (USE_API) {
            try {
                await apiPost('/bookings', {
                    car_id: car.id,
                    customer_name: name,
                    phone, email, address,
                    start_date: start, end_date: end,
                    days: diffDays, total_price: total,
                    status: 'confirmed', notes,
                });
                if (localStorage.getItem('userRole') === 'admin') {
                    bookings = await apiGet('/bookings');
                    renderAdminBookings();
                }
            } catch (err) {
                setLoading(submitBtn, false);
                showToast(err.message, 'error', 'Booking Gagal');
                return;
            }
        } else {
            const booking = {
                id: getNextId(bookings),
                carId: car.id, carName: car.name,
                customerName: name, phone, email, address,
                startDate: start, endDate: end, days: diffDays,
                totalPrice: total, status: 'confirmed', notes,
                createdAt: new Date().toISOString(),
            };
            bookings.push(booking);
            saveBookings();
            renderAdminBookings();
        }
        setLoading(submitBtn, false);

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

async function renderMyBookings() {
    const container = document.getElementById('myBookingsContent');
    if (!container) return;

    try {
        container.innerHTML = `
            <div style="text-align:center;padding:40px;color:var(--text-light);">
                <i class="fas fa-spinner fa-spin" style="font-size:2rem;"></i>
                <p style="margin-top:12px;">Memuat riwayat booking...</p>
            </div>
        `;

        const data = await apiGet('/my-bookings');
        const bookings = Array.isArray(data) ? data : [];

        if (bookings.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="text-align:center;padding:60px 20px;">
                    <i class="fas fa-calendar-times" style="font-size:3rem;color:var(--text-light);margin-bottom:16px;"></i>
                    <h3 style="margin-bottom:8px;">Belum Ada Riwayat</h3>
                    <p style="color:var(--text-light);margin-bottom:20px;">Anda belum melakukan booking mobil. Silakan booking mobil terlebih dahulu.</p>
                    <a href="#booking" class="btn btn-primary"><i class="fas fa-car"></i> Booking Sekarang</a>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="table-wrapper">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Mobil</th>
                            <th>Tanggal Sewa</th>
                            <th>Durasi</th>
                            <th>Total</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${bookings.map(b => `
                            <tr>
                                <td><strong>${b.car?.name || '—'}</strong></td>
                                <td>${formatDate(b.start_date)} — ${formatDate(b.end_date)}</td>
                                <td>${b.days} hari</td>
                                <td>${formatPrice(b.total_price)}</td>
                                <td><span class="booking-status status-${b.status}">${b.status.charAt(0).toUpperCase() + b.status.slice(1)}</span></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } catch (err) {
        container.innerHTML = `
            <div style="text-align:center;padding:40px;color:var(--text-light);">
                <i class="fas fa-exclamation-circle" style="font-size:2rem;color:var(--danger);margin-bottom:12px;"></i>
                <p>Gagal memuat riwayat booking. Silakan coba lagi.</p>
            </div>
        `;
    }
}
