function getProductImages(product) {
    if (!product || typeof product !== 'object') return [];
    if (Array.isArray(product.images) && product.images.length > 0) {
        return product.images.filter(Boolean);
    }
    if (product.image) return [product.image];
    return [];
}

function getPrimaryProductImage(product) {
    const images = getProductImages(product);
    return images[0] || '';
}

