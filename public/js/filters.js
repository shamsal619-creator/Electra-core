// Filter state management
let filtersState = {
    priceRange: { min: 0, max: 20000 },
    brands: [],
    colors: [],
    inStockOnly: false
};

// Initialize filters
function initFilters(category) {
    const filteredProducts = products.filter(p => p.category === category);
    
    // Generate filter options
    const brands = [...new Set(filteredProducts.map(p => p.brand))].sort();
    const colors = [...new Set(filteredProducts.map(p => p.color))].sort();
    const prices = filteredProducts.map(p => p.price).sort((a, b) => a - b);
    
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    // Set initial state
    filtersState.priceRange = { min: minPrice, max: maxPrice };
    
    // Render filter UI
    renderFiltersUI(brands, colors, minPrice, maxPrice);
    
    // Set up event listeners
    setupFilterListeners();
}

function renderFiltersUI(brands, colors, minPrice, maxPrice) {
    const filterSidebar = document.querySelector('.filter-sidebar');
    if (!filterSidebar) return;
    
    let colorsHTML = colors.map(color => {
        const colorCode = getColorCode(color);
        return `
            <label class="color-checkbox">
                <input type="checkbox" value="${color}" class="color-filter-checkbox">
                <span class="color-swatch" title="${color}" style="background-color: ${colorCode};" data-color="${color}"></span>
                <span class="color-label">${color}</span>
            </label>
        `;
    }).join('');
    
    let brandsHTML = brands.map(brand => `
        <label class="checkbox-label">
            <input type="checkbox" value="${brand}" class="brand-filter-checkbox">
            <span>${brand}</span>
        </label>
    `).join('');
    
    filterSidebar.innerHTML = `
        <div class="filter-container">
            <!-- Price Filter Section -->
            <div class="filter-section">
                <button class="filter-section-toggle">
                    <h3>Price Range</h3>
                    <span class="toggle-icon">▼</span>
                </button>
                <div class="filter-section-content">
                    <div class="price-inputs">
                        <div class="price-input-group">
                            <label>Min</label>
                            <input type="number" class="price-min-input" value="${minPrice}" min="${minPrice}" max="${maxPrice}">
                        </div>
                        <div class="price-input-group">
                            <label>Max</label>
                            <input type="number" class="price-max-input" value="${maxPrice}" min="${minPrice}" max="${maxPrice}">
                        </div>
                    </div>
                    <div class="price-slider">
                        <input type="range" class="price-range-slider" min="${minPrice}" max="${maxPrice}" value="${minPrice}" data-type="min">
                        <input type="range" class="price-range-slider" min="${minPrice}" max="${maxPrice}" value="${maxPrice}" data-type="max">
                    </div>
                    <div class="price-display">
                        <span class="price-min-display">${minPrice}</span> - <span class="price-max-display">${maxPrice}</span> EGP
                    </div>
                </div>
            </div>

            <!-- Brand Filter Section -->
            <div class="filter-section">
                <button class="filter-section-toggle">
                    <h3>Brand</h3>
                    <span class="toggle-icon">▼</span>
                </button>
                <div class="filter-section-content">
                    ${brandsHTML}
                </div>
            </div>

            <!-- Color Filter Section -->
            <div class="filter-section">
                <button class="filter-section-toggle">
                    <h3>Color</h3>
                    <span class="toggle-icon">▼</span>
                </button>
                <div class="filter-section-content">
                    <div class="color-grid">
                        ${colorsHTML}
                    </div>
                </div>
            </div>

            <!-- Availability Filter Section -->
            <div class="filter-section">
                <button class="filter-section-toggle">
                    <h3>Availability</h3>
                    <span class="toggle-icon">▼</span>
                </button>
                <div class="filter-section-content">
                    <label class="checkbox-label">
                        <input type="checkbox" class="stock-filter-checkbox" id="in-stock-check">
                        <span>In Stock Only</span>
                    </label>
                </div>
            </div>

            <!-- Apply & Reset Buttons -->
            <div class="filter-actions">
                <button class="btn-apply-filters">Apply Filters</button>
                <button class="btn-reset-filters">Reset</button>
            </div>
        </div>
    `;
}

function getColorCode(colorName) {
    const colorMap = {
        'Black': '#000000',
        'White': '#FFFFFF',
        'Silver': '#C0C0C0',
        'Gold': '#FFD700',
        'Blue': '#0066FF',
        'Green': '#00AA00',
        'Red': '#FF0000',
        'Pink': '#FF69B4',
        'Purple': '#8B00FF',
        'Gray': '#808080',
        'Space Gray': '#414145',
        'Teal': '#05A391',
        'Space Gray': '#414145'
    };
    return colorMap[colorName] || '#CCCCCC';
}

function setupFilterListeners() {
    // Price range inputs
    const priceMinInput = document.querySelector('.price-min-input');
    const priceMaxInput = document.querySelector('.price-max-input');
    const priceRangeSliders = document.querySelectorAll('.price-range-slider');
    
    if (priceMinInput) {
        priceMinInput.addEventListener('change', (e) => {
            filtersState.priceRange.min = parseInt(e.target.value);
            updatePriceDisplay();
        });
    }
    
    if (priceMaxInput) {
        priceMaxInput.addEventListener('change', (e) => {
            filtersState.priceRange.max = parseInt(e.target.value);
            updatePriceDisplay();
        });
    }
    
    priceRangeSliders.forEach(slider => {
        slider.addEventListener('input', (e) => {
            if (e.target.dataset.type === 'min') {
                filtersState.priceRange.min = parseInt(e.target.value);
                const minInput = document.querySelector('.price-min-input');
                if (minInput) minInput.value = filtersState.priceRange.min;
            } else {
                filtersState.priceRange.max = parseInt(e.target.value);
                const maxInput = document.querySelector('.price-max-input');
                if (maxInput) maxInput.value = filtersState.priceRange.max;
            }
            updatePriceDisplay();
        });
    });
    
    // Brand checkboxes
    document.querySelectorAll('.brand-filter-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                if (!filtersState.brands.includes(e.target.value)) {
                    filtersState.brands.push(e.target.value);
                }
            } else {
                filtersState.brands = filtersState.brands.filter(b => b !== e.target.value);
            }
        });
    });
    
    // Color checkboxes
    document.querySelectorAll('.color-filter-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                if (!filtersState.colors.includes(e.target.value)) {
                    filtersState.colors.push(e.target.value);
                }
            } else {
                filtersState.colors = filtersState.colors.filter(c => c !== e.target.value);
            }
        });
    });
    
    // Stock checkbox
    const stockCheckbox = document.querySelector('#in-stock-check');
    if (stockCheckbox) {
        stockCheckbox.addEventListener('change', (e) => {
            filtersState.inStockOnly = e.target.checked;
        });
    }
    
    // Filter section toggles
    document.querySelectorAll('.filter-section-toggle').forEach(toggle => {
        const handler = (e) => {
            e.preventDefault();
            const section = e.currentTarget.closest('.filter-section');
            const content = section.querySelector('.filter-section-content');
            const icon = section.querySelector('.toggle-icon');
            
            section.classList.toggle('collapsed');
            if (section.classList.contains('collapsed')) {
                content.style.display = 'none';
                icon.textContent = '▶';
            } else {
                content.style.display = 'block';
                icon.textContent = '▼';
            }
        };
        toggle.addEventListener('click', handler);
        toggle.addEventListener('touchstart', handler);
    });
    
    // Apply filters button
    const applyBtn = document.querySelector('.btn-apply-filters');
    if (applyBtn) {
        applyBtn.addEventListener('click', applyFilters);
    }
    
    // Reset filters button
    const resetBtn = document.querySelector('.btn-reset-filters');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetFilters);
    }
}

function updatePriceDisplay() {
    const minDisplay = document.querySelector('.price-min-display');
    const maxDisplay = document.querySelector('.price-max-display');
    if (minDisplay) minDisplay.textContent = filtersState.priceRange.min;
    if (maxDisplay) maxDisplay.textContent = filtersState.priceRange.max;
}

function applyFilters() {
    const pageTitle = document.title.toLowerCase();
    let category = '';
    if (pageTitle.includes('laptop')) category = 'laptops';
    else if (pageTitle.includes('headphone')) category = 'headphones';
    else if (pageTitle.includes('phone')) category = 'phones';
    else if (pageTitle.includes('watch')) category = 'watches';
    else if (pageTitle.includes('accessory') || pageTitle.includes('accessories')) category = 'accessories';
    
    if (!category) return;
    
    const cart = typeof getCart === 'function' ? getCart() : [];
    const grid = document.querySelector('.products-grid');
    
    let filtered = products.filter(p => {
        // Category filter
        if (p.category !== category) return false;
        
        // Price range filter
        if (p.price < filtersState.priceRange.min || p.price > filtersState.priceRange.max) return false;
        
        // Brand filter
        if (filtersState.brands.length > 0 && !filtersState.brands.includes(p.brand)) return false;
        
        // Color filter
        if (filtersState.colors.length > 0 && !filtersState.colors.includes(p.color)) return false;
        
        // Stock filter
        if (filtersState.inStockOnly && !p.inStock) return false;
        
        return true;
    });
    
    if (filtered.length === 0) {
        grid.innerHTML = '<p class="no-products">No products found matching your filters.</p>';
        return;
    }
    
    grid.innerHTML = filtered.map(p => {
        const cartItem = cart.find(item => item.id === p.id || item.name === p.name);
        const inCart = !!cartItem;
        const quantity = inCart ? cartItem.quantity : 1;
        const stockBadge = !p.inStock ? '<span class="stock-badge">Out of Stock</span>' : '';

        return `
            <div class="product-card fade-in-up" data-id="${p.id}">
                ${stockBadge}
                <button class="quick-view-btn">Quick View</button>
                <button class="fav-btn">♡</button>
                <a href="product.html?id=${p.id}">
                    ${typeof ImageLoader !== 'undefined' ? 
                        ImageLoader.generateImgTag(getPrimaryProductImage(p), p.name) : 
                        `<img src="${getPrimaryProductImage(p)}" alt="${p.name}" loading="lazy">`
                    }
                </a>
                <h3><a href="product.html?id=${p.id}">${p.name}</a></h3>
                <div class="price-container">
                    ${p.oldPrice ? `<span class="old-price">${p.oldPrice} EGP</span>` : ''}
                    <span class="new-price">${p.price} EGP</span>
                </div>
                <div class="add-to-cart-container">
                    <button class="add-to-cart-btn" style="${inCart ? 'display: none;' : 'display: flex;'}" ${!p.inStock ? 'disabled' : ''}>Add to Cart</button>
                    <div class="qty-selector" style="${inCart ? 'display: flex;' : 'display: none;'}">
                        <button class="qty-minus">-</button>
                        <span class="qty-value">${quantity}</span>
                        <button class="qty-plus">+</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    // Re-initialize cart buttons for the newly rendered elements
    if (typeof initAddToCartButtons === 'function') {
        initAddToCartButtons();
    }
    
    // Re-initialize Quick View for the newly rendered elements
    if (typeof initQuickView === 'function') {
        initQuickView();
    }
}

function resetFilters() {
    // Reset checkboxes
    document.querySelectorAll('.brand-filter-checkbox, .color-filter-checkbox').forEach(checkbox => {
        checkbox.checked = false;
    });
    document.querySelector('#in-stock-check').checked = false;
    
    // Reset state
    filtersState.brands = [];
    filtersState.colors = [];
    filtersState.inStockOnly = false;
    
    // Reset price sliders to original range
    const minInput = document.querySelector('.price-min-input');
    const maxInput = document.querySelector('.price-max-input');
    if (minInput && maxInput) {
        const initialMin = parseInt(minInput.min);
        const initialMax = parseInt(minInput.max);
        filtersState.priceRange = { min: initialMin, max: initialMax };
        minInput.value = initialMin;
        maxInput.value = initialMax;
        updatePriceDisplay();
    }
    
    // Re-render all products
    if (typeof renderCategoryProducts === 'function') {
        renderCategoryProducts();
    }
}

// Toggle mobile filter panel
function toggleFilterPanel() {
    const sidebar = document.querySelector('.filter-sidebar');
    const overlay = document.querySelector('.filter-panel-overlay');
    
    if (sidebar) {
        sidebar.classList.toggle('active');
    }
    
    if (overlay) {
        overlay.classList.toggle('active');
        if (overlay.classList.contains('active')) {
            // Add document click listener to close when clicking outside
            const closeHandler = (e) => {
                if (!sidebar.contains(e.target) && e.target !== document.querySelector('.filter-toggle-btn')) {
                    toggleFilterPanel();
                }
            };
            document.addEventListener('click', closeHandler);
            // Store the handler to remove later
            overlay._closeHandler = closeHandler;
        } else {
            // Remove the listener when deactivating
            if (overlay._closeHandler) {
                document.removeEventListener('click', overlay._closeHandler);
                delete overlay._closeHandler;
            }
        }
    }
}
