document.addEventListener('DOMContentLoaded', () => {
    renderCategoryProducts();
});

function renderCategoryProducts() {
    const grid = document.querySelector('.products-grid');
    if (!grid) return;

    // Determine category from page title or URL
    const pageTitle = document.title.toLowerCase();
    let category = '';
    if (pageTitle.includes('laptop')) category = 'laptops';
    else if (pageTitle.includes('headphone')) category = 'headphones';
    else if (pageTitle.includes('phone')) category = 'phones';
    else if (pageTitle.includes('watch')) category = 'watches';
    else if (pageTitle.includes('accessory') || pageTitle.includes('accessories')) category = 'accessories';

    if (!category || typeof products === 'undefined') return;

    const categoryProducts = products.filter(p => p.category === category);
    
    if (categoryProducts.length === 0) {
        grid.innerHTML = '<p class="no-products">No products found in this category.</p>';
        return;
    }

    // Get current cart to show correct state (Add to Cart vs Qty Selector)
    const cart = typeof getCart === 'function' ? getCart() : [];

    grid.innerHTML = categoryProducts.map(p => {
        const cartItem = cart.find(item => item.id === p.id || item.name === p.name);
        const inCart = !!cartItem;
        const quantity = inCart ? cartItem.quantity : 1;

        return `
            <div class="product-card fade-in-up" data-id="${p.id}">
                <button class="quick-view-btn">Quick View</button>
                <button class="fav-btn">♡</button>
                <a href="product.html?id=${p.id}">
                    ${typeof ImageLoader !== 'undefined' ? 
                        ImageLoader.generateImgTag(p.image, p.name) : 
                        `<img src="${p.image}" alt="${p.name}" loading="lazy">`
                    }
                </a>
                <h3><a href="product.html?id=${p.id}">${p.name}</a></h3>
                <div class="price-container">
                    ${p.oldPrice ? `<span class="old-price">${p.oldPrice} EGP</span>` : ''}
                    <span class="new-price">${p.price} EGP</span>
                </div>
                <div class="add-to-cart-container">
                    <button class="add-to-cart-btn" style="${inCart ? 'display: none;' : 'display: flex;'}">Add to Cart</button>
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
