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
                bookings = await apiGet('/bookings');
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
        }

        renderAdminBookings();
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
