/**
 * Main Application Logic
 * Handles authentication, routing, and global UI state.
 */

document.addEventListener('alpine:init', () => {
    // Global Store
    Alpine.store('auth', {
        user: JSON.parse(localStorage.getItem('kodace_user') || 'null'),

        login(email, password) {
            // Mock login - accept anything
            const user = {
                name: email.split('@')[0],
                email: email,
                token: 'mock-token-' + Date.now(),
                avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=random`
            };
            this.user = user;
            localStorage.setItem('kodace_user', JSON.stringify(user));
            window.location.href = 'dashboard.html';
        },

        logout() {
            this.user = null;
            localStorage.removeItem('kodace_user');
            window.location.href = 'login.html';
        },

        checkSession() {
            const path = window.location.pathname;
            const isLoginPage = path.includes('login.html');

            if (!this.user && !isLoginPage) {
                window.location.href = 'login.html';
            } else if (this.user && isLoginPage) {
                window.location.href = 'dashboard.html';
            }
        }
    });

    // Initialize Mock API
    if (typeof MockApi !== 'undefined') {
        MockApi.init();
    }
});

// Run session check immediately
const user = JSON.parse(localStorage.getItem('kodace_user') || 'null');
const path = window.location.pathname;
const isLoginPage = path.includes('login.html');

if (!user && !isLoginPage && !path.endsWith('/') && !path.includes('index.html')) {
    // Redirect to login if trying to access protected page
    window.location.href = 'login.html';
}

// Toast Notification Helper
window.showToast = (message, type = 'success') => {
    const container = document.getElementById('toast-container') || createToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
}
