document.addEventListener('DOMContentLoaded', async () => {
    if (window.productsReadyPromise) {
        await window.productsReadyPromise;
    }
    // Hamburger menu toggle
    const hamburger = document.getElementById('hamburger');
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const hamburgerBackdrop = document.getElementById('hamburgerBackdrop');

    if (hamburger && hamburgerMenu) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            hamburger.classList.toggle('active');
            hamburgerMenu.classList.toggle('active');
            if (hamburgerBackdrop) {
                hamburgerBackdrop.classList.toggle('active');
            }
        });
    }

    // Close menu when clicking outside or on backdrop
    document.addEventListener('click', (e) => {
        if (hamburgerMenu && hamburgerMenu.classList.contains('active') &&
            !hamburgerMenu.contains(e.target) &&
            !hamburger.contains(e.target)) {
            hamburgerMenu.classList.remove('active');
            hamburger.classList.remove('active');
            if (hamburgerBackdrop) {
                hamburgerBackdrop.classList.remove('active');
            }
        }
    });

    if (hamburgerBackdrop) {
        hamburgerBackdrop.addEventListener('click', () => {
            hamburgerMenu.classList.remove('active');
            hamburger.classList.remove('active');
            hamburgerBackdrop.classList.remove('active');
        });
    }

    // Initialize page transitions
    initPageTransitions();

    // Initialize search functionality
    initSearch();
    
    // Initialize Quick View
    initQuickView();

    // Initialize Sticky Header
    initStickyHeader();

    // Initialize Mobile Enhancements
    initMobileEnhancements();

    // Initialize cart count and add to cart listeners
    setupHeaderAuth();
    updateCartCount();
    initAddToCartButtons();
});

// Handle back/forward cache (bfcache) to ensure cart count is updated
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        updateCartCount();
        setupHeaderAuth();
    } else {
        // Even if not persisted, sometimes it's good to refresh just in case
        updateCartCount();
    }
});

function initMobileEnhancements() {
    if (window.innerWidth > 768) return;

    // Add Floating Action Button (FAB)
    let fab = document.querySelector('.mobile-fab-cart');
    if (!fab) {
        fab = document.createElement('a');
        fab.href = 'cart.html';
        fab.className = 'mobile-fab-cart';
        fab.innerHTML = `
            🛒
            <span class="fab-count" id="mobileFabCount">0</span>
        `;
        document.body.appendChild(fab);

        // Update FAB count immediately
        const updateFab = () => {
            const count = getCart().reduce((sum, item) => sum + item.quantity, 0);
            const fabCount = document.getElementById('mobileFabCount');
            if (fabCount) fabCount.textContent = count;
        };
        updateFab();

        // Hook into saveCart to update FAB
        const originalSaveCart = window.saveCart;
        window.saveCart = (cart) => {
            originalSaveCart(cart);
            updateFab();
        };
    }
}

function initStickyHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Check on initial load (for page refreshes halfway down)
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    }
}

function initPageTransitions() {
    // Create transition overlay if it doesn't exist
    let overlay = document.querySelector('.page-transition-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'page-transition-overlay';
        overlay.innerHTML = `
            <div class="loader"></div>
            <div style="margin-top: 20px; color: var(--accent-blue); font-weight: 800; letter-spacing: 2px; text-transform: uppercase; font-size: 12px;">
                Electra Core
            </div>
        `;
        document.body.appendChild(overlay);
    }
    // Safety: ensure overlay never remains active after load.
    overlay.classList.remove('active');

    // Handle all internal links
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && 
            link.href && 
            link.href.includes(window.location.origin) && 
            !link.href.includes('#') && 
            !link.getAttribute('target') &&
            !e.ctrlKey && !e.shiftKey && !e.metaKey && !e.altKey) {
            
            e.preventDefault();
            const targetUrl = link.href;
            
            overlay.classList.add('active');
            
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 400); // Match CSS transition duration
        }
    });

    // Handle initial page load
    window.addEventListener('pageshow', (event) => {
        overlay.classList.remove('active');
    });
}

function initQuickView() {
    const qvButtons = document.querySelectorAll('.quick-view-btn');
    if (qvButtons.length === 0) return;

    // Create modal element if not exists
    let modal = document.getElementById('quickViewModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'quickViewModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content fade-in-up">
                <span class="close-modal">&times;</span>
                <div class="modal-body">
                    <div class="modal-image">
                        <img src="" alt="" id="qvImage">
                    </div>
                    <div class="modal-info">
                        <h2 id="qvName">Product Name</h2>
                        <div class="modal-price" id="qvPrice">0 EGP</div>
                        <p id="qvDescription" class="qv-description">Product description goes here...</p>
                        <div class="qv-full-btn">
                            <a href="#" id="qvViewFull" class="btn">View Full Details</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Close modal events
        modal.querySelector('.close-modal').onclick = () => modal.style.display = 'none';
        window.onclick = (event) => { if (event.target == modal) modal.style.display = 'none'; };
    }

    qvButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = btn.closest('.product-card');
            const link = card.querySelector('a').href;
            const url = new URL(link);
            const id = url.searchParams.get('id');

            if (typeof products !== 'undefined') {
                const p = products.find(prod => prod.id === id);
                if (p) {
                    document.getElementById('qvImage').src = getPrimaryProductImage(p);
                    document.getElementById('qvName').textContent = p.name;
                    document.getElementById('qvPrice').textContent = `${p.price} EGP`;
                    document.getElementById('qvDescription').textContent = p.description || "No description available.";
                    document.getElementById('qvViewFull').href = `product.html?id=${p.id}`;
                    modal.style.display = 'block';
                }
            }
        });
    });
}

function initSearch() {
    const searchBar = document.querySelector('.search-bar');
    if (!searchBar) return;

    const input = searchBar.querySelector('input');
    
    // Create results dropdown if it doesn't exist
    let dropdown = searchBar.querySelector('.search-results-dropdown');
    if (!dropdown) {
        dropdown = document.createElement('div');
        dropdown.className = 'search-results-dropdown';
        searchBar.appendChild(dropdown);
    }

    input.addEventListener('input', (e) => {
        const query = e.target.value.trim().toLowerCase();
        
        if (query.length < 2) {
            dropdown.classList.remove('active');
            dropdown.innerHTML = '';
            return;
        }

        // Search products (assuming products is globally available from products.js)
        if (typeof products !== 'undefined') {
            const filtered = products.filter(p => 
                p.name.toLowerCase().includes(query) || 
                p.category.toLowerCase().includes(query)
            ).slice(0, 8); // Limit results

            if (filtered.length > 0) {
                dropdown.innerHTML = filtered.map(p => `
                    <div class="search-result-item" onclick="window.location.href='product.html?id=${p.id}'">
                        <img src="${getPrimaryProductImage(p)}" alt="${p.name}">
                        <div class="search-result-info">
                            <span class="search-result-name">${p.name}</span>
                            <span class="search-result-price">${p.price} EGP</span>
                        </div>
                    </div>
                `).join('');
                dropdown.classList.add('active');
            } else {
                dropdown.innerHTML = '<div class="no-results">No products found</div>';
                dropdown.classList.add('active');
            }
        }
    });

    // Close search on click outside
    document.addEventListener('click', (e) => {
        if (!searchBar.contains(e.target)) {
            dropdown.classList.remove('active');
        }
    });

    // Show again on focus if query exists
    input.addEventListener('focus', () => {
        if (input.value.trim().length >= 2) {
            dropdown.classList.add('active');
        }
    });
}

async function setupHeaderAuth() {
    const container = document.getElementById('headerUserActions') || document.querySelector('.user-actions');
    if (!container) return;

    let user = null;
    const raw = localStorage.getItem('currentUser');
    if (raw) {
        try {
            user = JSON.parse(raw);
        } catch {
            localStorage.removeItem('currentUser');
        }
    }

    try {
        const res = await fetch('/api/session', { credentials: 'include' });
        if (res.ok) {
            const data = await res.json();
            if (data.ok && data.user) {
                user = data.user;
                localStorage.setItem('currentUser', JSON.stringify(user));
            }
        }
    } catch (err) {
        // Ignore session fetch failures and show cached login links
    }

    if (user) {
        const firstName = user.first || user.email.split('@')[0];

        container.innerHTML = `
            <a href="cart.html" class="cart-icon-link desktop-only">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 24px; height: 24px;">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                <span class="cart-count" id="headerCartCount">0</span>
            </a>
        `;

        // Add menu items to hamburger dropdown
        const hamburgerMenu = document.getElementById('hamburgerMenu');
        if (hamburgerMenu) {
            hamburgerMenu.innerHTML = `
                <div style="padding: 24px 20px; border-bottom: 1px solid rgba(255,255,255,0.2);">
                    <div style="font-weight: 700; color: var(--teal); font-size: 18px; letter-spacing: 0.5px;">Welcome, ${firstName}</div>
                    ${user.isAdmin ? '<a href="admin-dashboard.html" style="display: block; margin-top: 12px; color: var(--dark); font-size: 14px; text-decoration: none; font-weight: 600;">Admin Panel</a>' : ''}
                </div>
                <a href="my-orders.html" class="hamburger-menu-item">My Orders</a>
                <a href="profile.html" class="hamburger-menu-item">Profile</a>
                <div style="border-top: 1px solid rgba(255,255,255,0.2); margin: 8px 0;"></div>
                <button id="logoutBtn" class="hamburger-menu-item" style="color: #dc2626; text-align: left;">Log Out</button>
            `;
        }

        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async () => {
                localStorage.removeItem('currentUser');
                try {
                    await fetch('/auth/logout', { method: 'POST', credentials: 'include' });
                } catch (err) {}
                window.location.href = 'signin.html';
            });
        }
        
        updateCartCount();
    } else {
        container.innerHTML = `
            <a href="cart.html" class="cart-icon-link desktop-only">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 24px; height: 24px;">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                <span class="cart-count" id="headerCartCount">0</span>
            </a>
        `;

        // Add login/signup to hamburger menu for non-logged users
        const hamburgerMenu = document.getElementById('hamburgerMenu');
        if (hamburgerMenu) {
            hamburgerMenu.innerHTML = `
                <a href="signin.html" class="hamburger-menu-item">Sign In</a>
                <a href="signup.html" class="hamburger-menu-item">Sign Up</a>
            `;
        }
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

// Export for other scripts
window.updateCartCount = updateCartCount;
window.getCart = getCart;
window.saveCart = saveCart;

function initAddToCartButtons() {
    const cartButtons = document.querySelectorAll('.add-to-cart-btn');
    
    // Initial check to show/hide selectors based on existing cart
    const cart = getCart();
    
    cartButtons.forEach((btn) => {
        // Prevent multiple listeners
        if (btn.dataset.initialized) return;
        btn.dataset.initialized = "true";

        const card = btn.closest('.product-card');
        const name = card.querySelector('h3').innerText;
        // Also try to get ID from data-id if available
        const id = card.dataset.id;
        
        const existingItem = cart.find(item => (id && item.id === id) || item.name === name);
        const selector = card.querySelector('.qty-selector');
        const qtyValue = selector.querySelector('.qty-value');

        if (existingItem) {
            btn.style.display = 'none';
            selector.style.display = 'flex';
            qtyValue.textContent = existingItem.quantity;
        }

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const priceText = card.querySelector('.new-price').textContent;
            const price = parseInt(priceText.replace(/[^0-9]/g, ''));
            const image = card.querySelector('img').src;

            addToCart({ id, name, price, image });
            
            // UI Switch
            btn.style.display = 'none';
            selector.style.display = 'flex';
            qtyValue.textContent = 1;
        });

        // Qty Plus
        selector.querySelector('.qty-plus').addEventListener('click', () => {
            let currentQty = parseInt(qtyValue.textContent);
            currentQty++;
            qtyValue.textContent = currentQty;
            updateCartItemQty(id || name, currentQty);
        });

        // Qty Minus
        selector.querySelector('.qty-minus').addEventListener('click', () => {
            let currentQty = parseInt(qtyValue.textContent);
            currentQty--;
            if (currentQty < 1) {
                // Remove from cart and switch back to button
                removeFromCart(id || name);
                btn.style.display = 'flex';
                selector.style.display = 'none';
                btn.dataset.initialized = ""; // Reset to allow re-init if needed, though usually not
                delete btn.dataset.initialized;
                initAddToCartButtons(); // Re-init to attach listener again since we might have removed it? 
                // Actually, the listener is still there. Just need to show button.
            } else {
                qtyValue.textContent = currentQty;
                updateCartItemQty(id || name, currentQty);
            }
        });
    });
}

function showCartToast(message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? '✓' : '✕';
    toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-message">${message}</div>
    `;

    container.appendChild(toast);

    // Force reflow for animation
    toast.offsetHeight;

    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
            if (container.children.length === 0) {
                container.remove();
            }
        }, 500);
    }, 4000);
}

function addToCart(product, quantity = 1) {
    const cart = getCart();
    const existingItem = cart.find(item => (product.id && item.id === product.id) || item.name === product.name);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ ...product, quantity: quantity });
    }

    saveCart(cart);
    
    // English toast message
    const message = `${product.name} added to cart!`;
    showCartToast(message);
}

function updateCartItemQty(idOrName, qty) {
    const cart = getCart();
    const item = cart.find(item => item.id === idOrName || item.name === idOrName);
    if (item) {
        item.quantity = qty;
        saveCart(cart);
    }
}

function removeFromCart(idOrName) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== idOrName && item.name !== idOrName);
    saveCart(cart);
}
