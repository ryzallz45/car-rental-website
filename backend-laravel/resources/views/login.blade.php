<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Admin - Rental Mobil</title>
    <link rel="stylesheet" href="{{ asset('css/reset.css') }}">
    <link rel="stylesheet" href="{{ asset('css/components.css') }}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
        body {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, var(--secondary) 0%, #1e3a5f 100%);
            padding: 20px;
        }
        .auth-card {
            background: var(--bg);
            border-radius: var(--radius);
            padding: 40px;
            max-width: 420px;
            width: 100%;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            text-align: center;
        }
        .auth-card .logo {
            font-size: 2.5rem;
            color: var(--primary);
            margin-bottom: 8px;
        }
        .auth-card h1 {
            font-size: 1.5rem;
            margin-bottom: 4px;
        }
        .auth-card .subtitle {
            color: var(--text-light);
            margin-bottom: 28px;
            font-size: 0.9rem;
        }
        .auth-card .form-group {
            text-align: left;
        }
        .auth-card .form-group input {
            background: var(--bg-alt);
        }
        .auth-card .btn {
            width: 100%;
            justify-content: center;
            margin-top: 8px;
        }
        .auth-card .auth-footer {
            margin-top: 20px;
            font-size: 0.9rem;
            color: var(--text-light);
        }
        .auth-card .auth-footer a {
            color: var(--primary);
            text-decoration: none;
            font-weight: 600;
        }
        .auth-card .auth-footer a:hover {
            text-decoration: underline;
        }
        .auth-card .alert {
            display: none;
            padding: 12px 16px;
            border-radius: var(--radius-sm);
            font-size: 0.85rem;
            margin-bottom: 20px;
            text-align: left;
        }
        .auth-card .alert.error {
            display: block;
            background: #fce4ec;
            color: #c62828;
        }
        .auth-card .alert.success {
            display: block;
            background: #dcfce7;
            color: #15803d;
        }
        .auth-card .back-link {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            color: var(--text-light);
            text-decoration: none;
            font-size: 0.85rem;
            margin-bottom: 20px;
        }
        .auth-card .back-link:hover {
            color: var(--primary);
        }
    </style>
</head>
<body>
    <div class="auth-card">
        <a href="/" class="back-link"><i class="fas fa-arrow-left"></i> Kembali ke Beranda</a>
        <div class="logo"><i class="fas fa-car"></i></div>
        <h1>Login Admin</h1>
        <p class="subtitle">Masuk untuk mengelola data mobil dan booking</p>

        <div id="alertMessage" class="alert"></div>

        <form id="loginForm">
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" value="admin@rentalmobil.com" placeholder="admin@example.com" required>
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" placeholder="Masukkan password" required>
            </div>
            <button type="submit" class="btn btn-primary" id="loginBtn">
                <i class="fas fa-sign-in-alt"></i> <span class="btn-text">Login</span>
            </button>
        </form>

        <div class="auth-footer">
            Belum punya akun? <a href="/register">Daftar di sini</a>
        </div>
        <div class="auth-footer" style="margin-top:8px;font-size:0.8rem;">
            Demo: <strong>admin@rentalmobil.com</strong> / <strong>admin123</strong>
        </div>
    </div>

    <script>
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const alert = document.getElementById('alertMessage');
            const btn = document.getElementById('loginBtn');
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;

            alert.className = 'alert';
            btn.disabled = true;
            btn.classList.add('btn-loading');
            const spinner = document.createElement('span');
            spinner.className = 'spinner';
            btn.prepend(spinner);

            try {
                const res = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });
                const json = await res.json();

                if (!res.ok) {
                    throw new Error(json.message || 'Login gagal');
                }

                localStorage.setItem('apiToken', json.data.token);
                window.location.href = '/';
            } catch (err) {
                alert.textContent = err.message;
                alert.className = 'alert error';
                btn.disabled = false;
                btn.classList.remove('btn-loading');
                const s = btn.querySelector('.spinner');
                if (s) s.remove();
            }
        });
    </script>
</body>
</html>
