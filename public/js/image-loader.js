/**
 * Robust Image Loader for ElectraCore
 * Handles broken images and provides professional placeholders.
 */

const ImageLoader = {
    // Professional tech-themed placeholder (Green/Dark theme)
    getPlaceholder(title) {
        return `data:image/svg+xml;charset=UTF-8,%3Csvg width='800' height='600' viewBox='0 0 800 600' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%231a202c'/%3E%3Cpath d='M400 220 L440 300 L360 300 Z' fill='%2305a391'/%3E%3Ctext x='50%25' y='60%25' font-family='Inter, sans-serif' font-size='24' font-weight='700' fill='%23ffffff' text-anchor='middle'%3ECOMING SOON%3C/text%3E%3Ctext x='50%25' y='68%25' font-family='Inter, sans-serif' font-size='16' fill='%2394a3b8' text-anchor='middle'%3E${encodeURIComponent(title)}%3C/text%3E%3C/svg%3E`;
    },

    // Fallback logic for broken images
    handleImageError(imgElement, title) {
        // Prevent infinite loops
        if (imgElement.dataset.triedFallback === '2') {
            imgElement.src = this.getPlaceholder(title);
            return;
        }

        // First fallback: Try a fresh high-res Unsplash search URL
        if (!imgElement.dataset.triedFallback) {
            imgElement.dataset.triedFallback = '1';
            const keyword = encodeURIComponent(title + " electronics product");
            // Using a more stable Unsplash source URL pattern
            imgElement.src = `https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop`; // Stable tech generic fallback first
            return;
        }

        // Second fallback: Use the branding placeholder
        imgElement.dataset.triedFallback = '2';
        imgElement.src = this.getPlaceholder(title);
    },

    // Helper to generate image tag with error handling
    generateImgTag(src, title, className = "") {
        const safeSrc = src || this.getPlaceholder(title);
        return `
            <img 
                src="${safeSrc}" 
                alt="${title}" 
                class="${className}" 
                loading="lazy" 
                onerror="ImageLoader.handleImageError(this, '${title.replace(/'/g, "\\'")}')"
                style="object-fit: cover; min-height: 200px; width: 100%;"
            >
        `;
    }
};

// Global export
window.ImageLoader = ImageLoader;
