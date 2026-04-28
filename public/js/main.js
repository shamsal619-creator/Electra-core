document.addEventListener('DOMContentLoaded', async () => {
    if (window.productsReadyPromise) {
        await window.productsReadyPromise;
    }
    // Hamburger menu toggle
    const hamburger = document.querySelector('.hamburger');
    const userActions = document.querySelector('.user-actions');
    const userMenuDropdown = document.getElementById('userMenuDropdown');

    if (hamburger && userMenuDropdown) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            hamburger.classList.toggle('active');
            userMenuDropdown.classList.toggle('active');
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (userMenuDropdown && userMenuDropdown.classList.contains('active') &&
            !userMenuDropdown.contains(e.target) &&
            !hamburger.contains(e.target)) {
            userMenuDropdown.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });

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
        const fullName = [user.first, user.last].filter(Boolean).join(' ').trim() || 'User';
        const firstName = user.first || user.email.split('@')[0];

        container.innerHTML = `
            <span class="user-welcome">Hi, ${firstName}</span>
            ${user.isAdmin ? '<a href="/admin-dashboard.html" class="auth-pill-link">⚙️ Admin</a>' : ''}
            
            <div class="user-dropdown" id="userDropdown" style="position: relative;">
                <button type="button" class="avatar-pill" id="headerProfileAvatar" aria-label="Open menu" style="position: relative;">
                    <svg viewBox="0 0 24 24" aria-hidden="true" style="width: 24px; height: 24px;">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
                    </svg>
                </button>
                <div class="dropdown-menu" id="headerDropdownMenu" style="
                    position: absolute; top: calc(100% + 8px); right: 0; background: white; 
                    border: 1px solid var(--border); border-radius: 12px; 
                    box-shadow: 0 10px 40px rgba(0,0,0,0.15); min-width: 200px;
                    opacity: 0; visibility: hidden; transform: translateY(-10px); 
                    transition: all 0.3s; z-index: 1000;
                ">
                    <div style="padding: 12px 16px; border-bottom: 1px solid var(--border); font-weight: 800; font-size: 13px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px;">My Account</div>
                    <a href="my-orders.html" style="display: block; padding: 12px 16px; text-decoration: none; color: var(--dark); font-weight: 600; font-size: 14px; transition: all 0.2s;" onmouseover="this.style.background='var(--light)'; this.style.color='var(--teal)'" onmouseout="this.style.background='white'; this.style.color='var(--dark)'">
                        My Orders
                    </a>
                    <a href="profile.html" style="display: block; padding: 12px 16px; text-decoration: none; color: var(--dark); font-weight: 600; font-size: 14px; transition: all 0.2s;" onmouseover="this.style.background='var(--light)'; this.style.color='var(--teal)'" onmouseout="this.style.background='white'; this.style.color='var(--dark)'">
                        Profile
                    </a>
                    <div style="height: 1px; background: var(--border); margin: 4px 0;"></div>
                    <button id="logoutBtn" style="display: block; padding: 12px 16px; width: 100%; border: none; background: none; color: #dc2626; font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.2s; text-align: left;" onmouseover="this.style.background='#fef2f2'" onmouseout="this.style.background='white'">
                        Log Out
                    </button>
                </div>
            </div>
            
            <a href="cart.html" class="cart-icon-link">
                <span class="cart-icon">🛒</span>
                <span class="cart-count" id="headerCartCount">0</span>
            </a>
        `;

        // Dropdown toggle
        const avatarBtn = document.getElementById('headerProfileAvatar');
        const dropdownMenu = document.getElementById('headerDropdownMenu');
        
        if (avatarBtn && dropdownMenu) {
            avatarBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isVisible = dropdownMenu.style.visibility === 'visible';
                dropdownMenu.style.opacity = isVisible ? '0' : '1';
                dropdownMenu.style.visibility = isVisible ? 'hidden' : 'visible';
                dropdownMenu.style.transform = isVisible ? 'translateY(-10px)' : 'translateY(0)';
            });

            document.addEventListener('click', (e) => {
                if (!avatarBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
                    dropdownMenu.style.opacity = '0';
                    dropdownMenu.style.visibility = 'hidden';
                    dropdownMenu.style.transform = 'translateY(-10px)';
                }
            });
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
