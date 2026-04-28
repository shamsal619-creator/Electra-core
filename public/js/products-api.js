function normalizeDbProduct(item) {
    const id = item._id || item.id;
    const images = Array.isArray(item.images) ? item.images.filter(Boolean) : [];
    const primaryImage = images[0] || item.image || '';

    return {
        id,
        _id: id,
        category: String(item.category || '').toLowerCase().trim(),
        name: item.name || '',
        price: Number(item.price || 0),
        oldPrice: item.oldPrice !== undefined && item.oldPrice !== null ? Number(item.oldPrice) : undefined,
        image: primaryImage,
        images,
        description: item.description || '',
        brand: item.brand || 'Unknown',
        color: item.color || 'Unknown',
        inStock: item.inStock !== false
    };
}

async function hydrateProductsFromApi() {
    if (window.__productsHydrated) return products;
    if (typeof products === 'undefined' || !Array.isArray(products)) return [];

    try {
        const res = await fetch('/api/products', { credentials: 'include' });
        if (!res.ok) return products;
        const payload = await res.json();
        if (!payload.ok || !Array.isArray(payload.products)) return products;

        const mapped = payload.products.map(normalizeDbProduct).filter((p) => p.id && p.name);
        if (mapped.length === 0) return products;

        products.splice(0, products.length, ...mapped);
        window.__productsHydrated = true;
        document.dispatchEvent(new CustomEvent('products:hydrated', { detail: { count: mapped.length } }));

        // Re-initialize filters if on a category page to include new brands
        if (typeof initFilters === 'function') {
            const pageTitle = document.title.toLowerCase();
            let category = '';
            if (pageTitle.includes('laptop')) category = 'laptops';
            else if (pageTitle.includes('headphone')) category = 'headphones';
            else if (pageTitle.includes('phone')) category = 'phones';
            else if (pageTitle.includes('watch')) category = 'watches';
            else if (pageTitle.includes('kitchen')) category = 'kitchen';
            else if (pageTitle.includes('accessory') || pageTitle.includes('accessories')) category = 'accessories';

            if (category) {
                initFilters(category);
            }
        }

        return products;
    } catch (_err) {
        return products;
    }
}

window.productsReadyPromise = hydrateProductsFromApi();
