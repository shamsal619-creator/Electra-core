const fs = require('fs');
const path = require('path');

const productsJsContent = fs.readFileSync('public/js/products.js', 'utf8');
const productMap = {};
const productRegex = /id:\s*"([^"]+)",\s*category:\s*"[^"]+",\s*name:\s*"([^"]+)",\s*price:\s*([0-9]+),\s*oldPrice:\s*([0-9]+),\s*image:\s*"([^"]+)"/g;
let match;
while ((match = productRegex.exec(productsJsContent)) !== null) {
    productMap[match[1]] = { id: match[1], name: match[2], price: match[3], oldPrice: match[4], image: match[5] };
}

function generateCard(id) {
    const p = productMap[id];
    if (!p) return `<!-- Product ${id} not found -->`;
    return `
        <div class="product-card">
            <button class="quick-view-btn">Quick View</button>
            <button class="fav-btn">♡</button>
            <a href="product.html?id=${p.id}">
                <img src="${p.image}" alt="${p.name}">
            </a>
            <h3><a href="product.html?id=${p.id}">${p.name}</a></h3>
            <div class="price-container">
                <span class="new-price">${p.price} EGP</span>
            </div>
            <div class="add-to-cart-container">
                <button class="add-to-cart-btn">Add to Cart</button>
                <div class="qty-selector">
                    <button class="qty-minus">-</button>
                    <span class="qty-value">1</span>
                    <button class="qty-plus">+</button>
                </div>
            </div>
        </div>`;
}

// Fix index.html
let indexContent = fs.readFileSync('public/index.html', 'utf8');

// Replace New Arrivals
const newArrivals = ['laptop-1', 'phone-1', 'watch-1', 'acc-1', 'headphone-1'];
const newArrivalsHtml = newArrivals.map(id => generateCard(id)).join('\n');
indexContent = indexContent.replace(/<div class="products-grid fade-in-up" id="new-arrivals">[\s\S]*?<\/div>\s*<\/div>/, `<div class="products-grid fade-in-up" id="new-arrivals">${newArrivalsHtml}\n    </div>`);

// Replace Best Sellers
const bestSellers = ['laptop-2', 'phone-2', 'watch-2', 'acc-2'];
const bestSellersHtml = bestSellers.map(id => generateCard(id)).join('\n');
indexContent = indexContent.replace(/<div class="products-grid fade-in-up" id="best-sellers">[\s\S]*?<\/div>\s*<\/div>/, `<div class="products-grid fade-in-up" id="best-sellers">${bestSellersHtml}\n    </div>`);

fs.writeFileSync('public/index.html', indexContent);
console.log('Fixed index.html sections with correct products and images');
