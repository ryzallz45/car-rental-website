function initAdminLogin() {
    const form = document.getElementById('adminLoginForm');
    const loginDiv = document.getElementById('adminLogin');
    const panelDiv = document.getElementById('adminPanel');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('adminEmail').value.trim();
        const pass = document.getElementById('adminPass').value;
        const loginBtn = form.querySelector('button[type="submit"]');
        setLoading(loginBtn, true);

        if (USE_API) {
            try {
                const data = await apiLogin(email, pass);
                apiToken = data.token;
                localStorage.setItem('apiToken', apiToken);
                await loadFromApi();
            } catch (err) {
                setLoading(loginBtn, false);
                showToast(err.message, 'error', 'Login Gagal');
                return;
            }
        } else if (pass !== 'admin123') {
            showToast('Password salah! Coba lagi.', 'error');
            setLoading(loginBtn, false);
            form.reset();
            return;
        }

        setLoading(loginBtn, false);
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
                bookings = await apiGet('/bookings');
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

    initFieldValidation(form);

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
        const image = document.getElementById('carImage').value.trim();
        const seats = parseInt(document.getElementById('carSeats').value);
        const transmission = document.getElementById('carTransmission').value;
        const description = document.getElementById('carDescription').value.trim();
        const submitBtn = form.querySelector('button[type="submit"]');
        setLoading(submitBtn, true);

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
                setLoading(submitBtn, false);
                showToast(err.message, 'error', 'Gagal Simpan');
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
        setLoading(submitBtn, false);
        form.reset();
        document.getElementById('carFormId').value = '';
        cancelBtn.style.display = 'none';
        showToast('Mobil berhasil disimpan!', 'success');
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
                showToast(err.message, 'error', 'Gagal Hapus');
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
        showToast('Mobil berhasil dihapus.', 'success');
    };
    document.getElementById('deleteModal').classList.add('active');
}
