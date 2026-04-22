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
        return products;
    } catch (_err) {
        return products;
    }
}

window.productsReadyPromise = hydrateProductsFromApi();
