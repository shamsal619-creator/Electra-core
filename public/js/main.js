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

    // Initialize cart count and add to cart listeners
    setupHeaderAuth();
    updateCartCount();
    initAddToCartButtons();
});

function setupHeaderAuth() {
    const container = document.getElementById('headerUserActions') || document.querySelector('.user-actions');
    if (!container) return;

    const raw = localStorage.getItem('currentUser');
    
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
                <span class="cart-count" id="headerCartCount">0</span>
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
        
        updateCartCount();
    } else {
        container.innerHTML = `
            <a href="signin.html">Sign in</a>
            <a href="signup.html">Sign up</a>
        `;
    }
}

// --- Cart Functionality ---

function getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const countElement = document.getElementById('headerCartCount');
    if (countElement) {
        const cart = getCart();
        const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        countElement.textContent = totalCount;
    }
}

function initAddToCartButtons() {
    // Select all cart icons in product cards
    const cartButtons = document.querySelectorAll('.action-icon');
    
    cartButtons.forEach(btn => {
        // We only want the ones with the cart emoji 🛒
        if (btn.textContent.trim() === '🛒') {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const card = btn.closest('.product-card');
                if (!card) return;

                const name = card.querySelector('h3').textContent;
                const priceText = card.querySelector('.new-price').textContent;
                const price = parseInt(priceText.replace(/[^0-9]/g, ''));
                const image = card.querySelector('img').src;

                addToCart({ name, price, image });
                
                // Visual feedback
                const originalText = btn.textContent;
                btn.textContent = '✅';
                setTimeout(() => {
                    btn.textContent = originalText;
                }, 1000);
            });
        }
    });
}

function addToCart(product) {
    const cart = getCart();
    const existingItem = cart.find(item => item.name === product.name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart(cart);
}
