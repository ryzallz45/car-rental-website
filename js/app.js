document.addEventListener('DOMContentLoaded', async () => {
    initNavigation();
    initModals();
    initApiConfig();
    observeStats();

    if (USE_API) {
        showCarsLoading();
        const loaded = await loadFromApi();
        if (!loaded) {
            await loadFromStorage();
            renderCars();
        }
        hideCarsLoading();
    } else {
        await loadFromStorage();
        renderCars();
    }

    populateBookingCarSelect();
    initBookingForm();
    initAdminTab();
    initAdminLogin();
    initCarForm();
    initContactForm();
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

function initContactForm() {
    document.getElementById('contactForm').addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Pesan Anda telah kami terima. Kami akan menghubungi Anda segera.', 'success');
        e.target.reset();
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
