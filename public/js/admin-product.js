const form = document.getElementById('productForm');
const imagesInput = document.getElementById('images');
const existingPreviewList = document.getElementById('existingPreviewList');
const newPreviewList = document.getElementById('newPreviewList');
const statusBox = document.getElementById('status');
const submitBtn = document.getElementById('submitBtn');
const formTitle = document.getElementById('formTitle');
const editingIdInput = document.getElementById('editingId');
const productsTableBody = document.getElementById('productsTableBody');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const migrateBtn = document.getElementById('migrateBtn');
const authStatus = document.getElementById('authStatus');
const systemChips = document.getElementById('systemChips');
const modeChip = document.getElementById('modeChip');
const countChip = document.getElementById('countChip');
const searchInput = document.getElementById('searchInput');
const refreshBtn = document.getElementById('refreshBtn');
let editingProduct = null;
let isAdminAuthenticated = false;
let allProducts = [];
let debounceTimer = null;

function showStatus(message, ok = false) {
    statusBox.textContent = message;
    statusBox.style.color = ok ? '#0a8' : '#c0392b';
}

function setControlsEnabled(enabled) {
    const controls = form.querySelectorAll('input, textarea, select, button');
    controls.forEach((el) => {
        if (el.id === 'cancelEditBtn') return;
        el.disabled = !enabled;
    });
    if (migrateBtn) migrateBtn.disabled = !enabled;
    if (refreshBtn) refreshBtn.disabled = !enabled;
}

async function checkAdminAuth() {
    try {
        const response = await fetch('/api/session', { credentials: 'include' });
        const payload = await response.json();
        if (!response.ok || !payload.ok || !payload.user?.email) {
            isAdminAuthenticated = false;
            authStatus.textContent = 'Not signed in. Please sign in first.';
            setControlsEnabled(false);
            return;
        }

        if (!payload.user.isAdmin) {
            isAdminAuthenticated = false;
            authStatus.textContent = `Signed in as: ${payload.user.email} — Admin access required.`;
            setControlsEnabled(false);
            return;
        }

        isAdminAuthenticated = true;
        authStatus.textContent = `Signed in as: ${payload.user.email} (Admin)`;
        setControlsEnabled(true);
    } catch (_err) {
        isAdminAuthenticated = false;
        authStatus.textContent = 'Could not verify login. Please sign in again.';
        setControlsEnabled(false);
    }
}

function setMode(isEdit) {
    if (!modeChip) return;
    if (isEdit) {
        modeChip.textContent = 'Edit mode';
        modeChip.className = 'chip bad';
    } else {
        modeChip.textContent = 'Create mode';
        modeChip.className = 'chip ok';
    }
}

function resetToCreateMode() {
    editingProduct = null;
    editingIdInput.value = '';
    formTitle.textContent = 'Create Product';
    submitBtn.textContent = 'Create Product';
    cancelEditBtn.style.display = 'none';
    if (existingPreviewList) existingPreviewList.innerHTML = '';
    if (newPreviewList) newPreviewList.innerHTML = '';
    if (imagesInput) imagesInput.value = '';
    setMode(false);
}

function escapeHtml(value) {
    return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

function renderExistingImages(images) {
    const safeImages = Array.isArray(images) ? images : [];
    existingPreviewList.innerHTML = safeImages.map((img, idx) => `
        <div class="preview-item">
            <img src="${img}" alt="existing image ${idx + 1}">
            <button type="button" class="remove-image-btn" data-remove-index="${idx}" title="Remove image">×</button>
        </div>
    `).join('');

    existingPreviewList.querySelectorAll('[data-remove-index]').forEach((btn) => {
        btn.addEventListener('click', () => {
            if (!editingProduct || !Array.isArray(editingProduct.images)) return;
            const index = Number(btn.dataset.removeIndex);
            if (!Number.isInteger(index) || index < 0 || index >= editingProduct.images.length) return;
            editingProduct.images.splice(index, 1);
            renderExistingImages(editingProduct.images);
            showStatus('Image removed from edit list. Click Update Product to save.', true);
        });
    });
}

function renderNewImages(files) {
    if (!newPreviewList) return;
    const list = Array.from(files || []).slice(0, 5);
    newPreviewList.innerHTML = '';
    list.forEach((file) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'preview-item';
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.alt = file.name;
        wrapper.appendChild(img);
        newPreviewList.appendChild(wrapper);
    });
}

function renderProductsTable(list) {
    if (!Array.isArray(list) || list.length === 0) {
        productsTableBody.innerHTML = '<tr><td colspan="5">No products found.</td></tr>';
        if (countChip) countChip.textContent = '0 products';
        return;
    }

    if (countChip) countChip.textContent = `${list.length} products`;

    productsTableBody.innerHTML = list.map((p) => {
        const imgs = Array.isArray(p.images) ? p.images : [];
        const thumbs = imgs.slice(0, 3).map((u) => `<img src="${u}" alt="thumb">`).join('');
        return `
            <tr>
                <td>${escapeHtml(p.name)}</td>
                <td>${escapeHtml(p.category)}</td>
                <td>${Number(p.price || 0).toLocaleString()} EGP</td>
                <td>
                    <div class="thumbs">
                        ${thumbs || '<span class="muted">No images</span>'}
                        ${imgs.length > 3 ? `<span class="muted">+${imgs.length - 3}</span>` : ''}
                    </div>
                </td>
                <td><button type="button" class="small-btn" data-edit-id="${p._id}">Edit</button></td>
            </tr>
        `;
    }).join('');

    productsTableBody.querySelectorAll('[data-edit-id]').forEach((btn) => {
        btn.addEventListener('click', () => {
            const product = allProducts.find((p) => p._id === btn.dataset.editId);
            if (!product) return;
            editingProduct = product;
            editingProduct.images = Array.isArray(product.images) ? [...product.images] : [];
            editingIdInput.value = product._id;
            formTitle.textContent = `Edit Product: ${product.name}`;
            submitBtn.textContent = 'Update Product';
            cancelEditBtn.style.display = 'inline-block';
            setMode(true);

            document.getElementById('name').value = product.name || '';
            document.getElementById('category').value = product.category || '';
            document.getElementById('price').value = product.price ?? '';
            document.getElementById('oldPrice').value = product.oldPrice ?? '';
            document.getElementById('brand').value = product.brand || '';
            document.getElementById('color').value = product.color || '';
            document.getElementById('description').value = product.description || '';
            document.getElementById('inStock').value = product.inStock === false ? 'false' : 'true';

            renderExistingImages(editingProduct.images);
            renderNewImages(imagesInput.files || []);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

function applySearchFilter() {
    const q = String(searchInput?.value || '').trim().toLowerCase();
    if (!q) {
        renderProductsTable(allProducts);
        return;
    }
    const filtered = allProducts.filter((p) => {
        const name = String(p?.name || '').toLowerCase();
        const cat = String(p?.category || '').toLowerCase();
        return name.includes(q) || cat.includes(q);
    });
    renderProductsTable(filtered);
}

async function loadProducts() {
    if (!isAdminAuthenticated) {
        productsTableBody.innerHTML = '<tr><td colspan="5">Please sign in first.</td></tr>';
        return;
    }
    try {
        const response = await fetch('/api/products');
        const payload = await response.json();
        if (!response.ok || !payload.ok) {
            productsTableBody.innerHTML = '<tr><td colspan="5">Failed to load products.</td></tr>';
            return;
        }
        const list = Array.isArray(payload.products) ? payload.products : [];
        allProducts = list;
        applySearchFilter();
    } catch (_err) {
        productsTableBody.innerHTML = '<tr><td colspan="5">Failed to load products.</td></tr>';
    }
}

imagesInput.addEventListener('change', () => {
    const files = Array.from(imagesInput.files || []);
    
    // Validate files
    const maxSize = 25 * 1024 * 1024; // 25MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    let hasErrors = false;
    
    files.slice(0, 5).forEach((file, index) => {
        // Check file type
        if (!allowedTypes.includes(file.type)) {
            showStatus(`File "${file.name}" is not a valid image type. Only JPEG, PNG, GIF, and WebP are allowed.`);
            hasErrors = true;
            return;
        }
        
        // Check file size
        if (file.size > maxSize) {
            showStatus(`File "${file.name}" is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum size is 25MB.`);
            hasErrors = true;
            return;
        }
        
        // Check if file is actually an image
        if (!file.type.startsWith('image/')) {
            showStatus(`File "${file.name}" is not a valid image.`);
            hasErrors = true;
            return;
        }
        
        // Preview
        renderNewImages(files);
    });

    if (files.length > 5) {
        showStatus('You selected more than 5 files. Only first 5 will be uploaded.');
        hasErrors = true;
    }
    
    if (!hasErrors && files.length > 0) {
        showStatus(`${files.length} image(s) selected successfully.`, true);
    }
});

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    showStatus('');
    submitBtn.disabled = true;

    try {
        if (!isAdminAuthenticated) {
            showStatus('Please sign in first.');
            submitBtn.disabled = false;
            return;
        }

        const files = Array.from(imagesInput.files || []);
        
        // Additional validation before sending
        if (files.length === 0 && !editingIdInput.value) {
            showStatus('Please select at least one image.');
            submitBtn.disabled = false;
            return;
        }
        
        // Validate files again before upload
        const maxSize = 25 * 1024 * 1024; // 25MB
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        for (const file of files.slice(0, 5)) {
            if (!allowedTypes.includes(file.type)) {
                showStatus(`Invalid file type for "${file.name}". Only JPEG, PNG, GIF, and WebP are allowed.`);
                submitBtn.disabled = false;
                return;
            }
            if (file.size > maxSize) {
                showStatus(`File "${file.name}" is too large. Maximum size is 25MB.`);
                submitBtn.disabled = false;
                return;
            }
        }

        const formData = new FormData();
        const textFields = ['name', 'category', 'price', 'oldPrice', 'brand', 'color', 'description', 'inStock'];
        textFields.forEach((field) => {
            const value = document.getElementById(field)?.value ?? '';
            if (value !== '') formData.append(field, value);
        });

        files.slice(0, 5).forEach((file) => formData.append('images', file));

        const editingId = editingIdInput.value;
        if (editingId && editingProduct?.images) {
            formData.append('existingImages', JSON.stringify(editingProduct.images));
        }

        const endpoint = editingId ? `/api/products/${editingId}` : '/api/products';
        const method = editingId ? 'PUT' : 'POST';
        
        console.log('🚀 Sending request to:', endpoint, 'Method:', method);
        console.log('📦 FormData contents:', [...formData.entries()].map(([k, v]) => `${k}: ${v instanceof File ? `File(${v.name}, ${v.size} bytes)` : v}`));
        
        const response = await fetch(endpoint, {
            method,
            body: formData,
            credentials: 'include'
        });
        
        console.log('📡 Response status:', response.status, response.statusText);
        
        let payload;
        try {
            payload = await response.json();
            console.log('📋 Response payload:', payload);
        } catch (parseError) {
            console.error('❌ Failed to parse response JSON:', parseError);
            showStatus('Server returned invalid response. Please try again.');
            submitBtn.disabled = false;
            return;
        }

        if (!response.ok || !payload.ok) {
            console.error('❌ Request failed:', payload.error || 'Unknown error');
            showStatus(payload.error || 'Failed to save product.');
            submitBtn.disabled = false;
            return;
        }

        console.log('✅ Product saved successfully');
        form.reset();
        if (existingPreviewList) existingPreviewList.innerHTML = '';
        if (newPreviewList) newPreviewList.innerHTML = '';
        if (editingId) {
            showStatus(`Product updated successfully. ID: ${payload.product._id}`, true);
        } else {
            showStatus(`Product created successfully. ID: ${payload.product._id}`, true);
        }
        resetToCreateMode();
        await loadProducts();
    } catch (error) {
        console.error('💥 Request error:', error);
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            showStatus('Network error. Please check your connection and try again.');
        } else {
            showStatus(`Request failed: ${error.message || 'Unknown error'}`);
        }
    } finally {
        submitBtn.disabled = false;
    }
});

cancelEditBtn.addEventListener('click', () => {
    form.reset();
    if (existingPreviewList) existingPreviewList.innerHTML = '';
    if (newPreviewList) newPreviewList.innerHTML = '';
    resetToCreateMode();
    showStatus('');
});

loadProducts();

if (migrateBtn) {
    migrateBtn.addEventListener('click', async () => {
        try {
            migrateBtn.disabled = true;
            showStatus('Migrating old static products...');
            const response = await fetch('/api/admin/migrate-static-products', { method: 'POST' });
            const payload = await response.json();
            if (!response.ok || !payload.ok) {
                showStatus(payload.error || 'Migration failed.');
                return;
            }
            showStatus(`Migration done. Created: ${payload.created}, Skipped: ${payload.skipped}`, true);
            await loadProducts();
        } catch (error) {
            showStatus(`Migration request failed: ${error.message || 'Unknown error'}`);
        } finally {
            migrateBtn.disabled = false;
        }
    });
}

const testUploadBtn = document.getElementById('testUploadBtn');
const testImageInput = document.getElementById('testImageInput');

if (testUploadBtn && testImageInput) {
    testUploadBtn.addEventListener('click', () => {
        testImageInput.click();
    });

    testImageInput.addEventListener('change', async () => {
        const file = testImageInput.files[0];
        if (!file) return;

        try {
            testUploadBtn.disabled = true;
            showStatus('Testing image upload...');

            const formData = new FormData();
            formData.append('testImage', file);

            const response = await fetch('/api/test-upload', {
                method: 'POST',
                body: formData
            });

            const payload = await response.json();

            if (!response.ok || !payload.ok) {
                showStatus(`Test upload failed: ${payload.error || 'Unknown error'}`);
                return;
            }

            showStatus(`Test upload successful! File: ${payload.originalname || 'image'}, Size: ${payload.size} bytes`, true);
            console.log('Test upload result:', payload);
        } catch (error) {
            showStatus(`Test upload error: ${error.message || 'Unknown error'}`);
        } finally {
            testUploadBtn.disabled = false;
            testImageInput.value = '';
        }
    });
}

async function loadSystemStatus() {
    if (!systemChips) return;
    try {
        const res = await fetch('/api/status', { credentials: 'include' });
        const payload = await res.json();
        const dbOk = !!payload.databaseConnected;
        const envOk = !!payload.envLoaded;
        const provider = payload.imageStorageProvider || 'unknown';
        systemChips.innerHTML = [
            `<span class="chip ${dbOk ? 'ok' : 'bad'}">DB: ${dbOk ? 'connected' : 'down'}</span>`,
            `<span class="chip ${envOk ? 'ok' : 'bad'}">ENV: ${envOk ? 'loaded' : 'missing'}</span>`,
            `<span class="chip">Images: ${escapeHtml(provider)}</span>`
        ].join('');
    } catch (_e) {
        systemChips.innerHTML = `<span class="chip bad">System status unavailable</span>`;
    }
}

if (searchInput) {
    searchInput.addEventListener('input', () => {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(applySearchFilter, 120);
    });
}

if (refreshBtn) {
    refreshBtn.addEventListener('click', () => loadProducts());
}

checkAdminAuth().then(async () => {
    await loadSystemStatus();
    await loadProducts();
});
