// Sort state management
let sortState = {
    sortBy: 'default'
};

// Initialize sort dropdown
function initSort() {
    renderSortUI();
    setupSortListeners();
}

function renderSortUI() {
    // Find the products-content wrapper or create a sort container
    const productsContent = document.querySelector('.products-content');
    const pageTitle = document.querySelector('.page-title');
    
    if (!productsContent && !pageTitle) return;
    
    const sortContainer = document.createElement('div');
    sortContainer.className = 'sort-container';
    sortContainer.innerHTML = `
        <select class="sort-dropdown" id="sort-select">
            <option value="default">Sort By</option>
            <option value="price-low-high">Price: Low to High</option>
            <option value="price-high-low">Price: High to Low</option>
            <option value="name-a-z">Name: A to Z</option>
            <option value="name-z-a">Name: Z to A</option>
            <option value="stock-first">In Stock First</option>
        </select>
    `;
    
    if (productsContent) {
        productsContent.insertBefore(sortContainer, productsContent.firstChild);
    } else if (pageTitle) {
        pageTitle.parentNode.insertBefore(sortContainer, pageTitle.nextSibling);
    }
}

function setupSortListeners() {
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            sortState.sortBy = e.target.value;
            applySorting();
        });
    }
}

function applySorting() {
    const grid = document.querySelector('.products-grid');
    if (!grid) return;
    
    const cards = Array.from(grid.querySelectorAll('.product-card'));
    
    if (cards.length === 0) return;
    
    // Extract product data from cards
    const products = cards.map(card => {
        const name = card.querySelector('h3 a')?.textContent || '';
        const priceText = card.querySelector('.new-price')?.textContent || '0';
        const price = parseInt(priceText.replace(/\D/g, ''));
        const isOutOfStock = card.querySelector('.stock-badge') !== null;
        
        return {
            card: card,
            name: name,
            price: price,
            isOutOfStock: isOutOfStock
        };
    });
    
    // Sort products based on current sort state
    if (sortState.sortBy !== 'default') {
        switch(sortState.sortBy) {
            case 'price-low-high':
                products.sort((a, b) => a.price - b.price);
                break;
            case 'price-high-low':
                products.sort((a, b) => b.price - a.price);
                break;
            case 'name-a-z':
                products.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-z-a':
                products.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'stock-first':
                products.sort((a, b) => {
                    // In stock items first (false = in stock)
                    if (a.isOutOfStock === b.isOutOfStock) return 0;
                    return a.isOutOfStock ? 1 : -1;
                });
                break;
            default:
                // Keep original order
                break;
        }
    }
    
    // Re-render cards in sorted order
    const fragment = document.createDocumentFragment();
    products.forEach(item => {
        fragment.appendChild(item.card);
    });
    
    // Clear and repopulate grid
    grid.innerHTML = '';
    grid.appendChild(fragment);
    
    // Add animation with staggered delays
    products.forEach((item, index) => {
        item.card.style.animation = 'none';
        setTimeout(() => {
            item.card.style.animation = 'fadeInUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
        }, index * 20);
    });
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.initSort = initSort;
    window.applySorting = applySorting;
}
