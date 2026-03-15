document.addEventListener('DOMContentLoaded', () => {
    // Hamburger menu toggle
    const hamburger = document.querySelector('.hamburger');
    const userActions = document.querySelector('.user-actions');

    if (hamburger && userActions) {
        hamburger.addEventListener('click', () => {
            userActions.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (userActions && userActions.classList.contains('active') && 
            !userActions.contains(e.target) && 
            !hamburger.contains(e.target)) {
            userActions.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });

    // Auth state management in header (shared logic)
    setupHeaderAuth();
});

function setupHeaderAuth() {
    const container = document.getElementById('headerUserActions') || document.querySelector('.user-actions');
    if (!container) return;

    const raw = localStorage.getItem('currentUser');
    
    // We want to keep the current structure but fill it based on auth state
    // If it's the mobile menu, we might need different formatting, 
    // but the CSS handles the layout.

    if (raw) {
        let user;
        try {
            user = JSON.parse(raw);
        } catch {
            localStorage.removeItem('currentUser');
            return;
        }
        const fullName = [user.first, user.last].filter(Boolean).join(' ').trim() || 'User';
        const initial = (user.first && user.first[0]) || (user.last && user.last[0]) || (user.email && user.email[0]) || 'U';

        container.innerHTML = `
            <span class="user-welcome">Hi, ${fullName}</span>
            <button type="button" class="avatar-pill" id="headerProfileAvatar">${initial.toUpperCase()}</button>
            <a href="cart.html" class="cart-icon-link">
                <span class="cart-icon">🛒</span>
                <span class="cart-count">0</span>
            </a>
            <button type="button" class="logout-btn" id="logoutBtn">Logout</button>
        `;

        const avatarBtn = document.getElementById('headerProfileAvatar');
        if (avatarBtn) {
            avatarBtn.addEventListener('click', () => {
                window.location.href = 'profile.html';
            });
        }

        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                localStorage.removeItem('currentUser');
                window.location.href = 'signin.html';
            });
        }
    } else {
        container.innerHTML = `
            <a href="signin.html">Sign in</a>
            <a href="signup.html">Sign up</a>
        `;
    }
}
