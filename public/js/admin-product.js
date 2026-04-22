const form = document.getElementById('productForm');
const imagesInput = document.getElementById('images');
const previewList = document.getElementById('previewList');
const statusBox = document.getElementById('status');
const submitBtn = document.getElementById('submitBtn');
const formTitle = document.getElementById('formTitle');
const editingIdInput = document.getElementById('editingId');
const productsTableBody = document.getElementById('productsTableBody');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const migrateBtn = document.getElementById('migrateBtn');
const authStatus = document.getElementById('authStatus');
let editingProduct = null;
let isAdminAuthenticated = false;

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

        isAdminAuthenticated = true;
        authStatus.textContent = `Signed in as: ${payload.user.email}`;
        setControlsEnabled(true);
    } catch (_err) {
        isAdminAuthenticated = false;
        authStatus.textContent = 'Could not verify login. Please sign in again.';
        setControlsEnabled(false);
    }
}

function resetToCreateMode() {
    editingProduct = null;
    editingIdInput.value = '';
    formTitle.textContent = 'Create Product (Multiple Images)';
    submitBtn.textContent = 'Create Product';
    cancelEditBtn.style.display = 'none';
}

function escapeHtml(value) {
    return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
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
        if (list.length === 0) {
            productsTableBody.innerHTML = '<tr><td colspan="5">No products in database yet.</td></tr>';
            return;
        }
        productsTableBody.innerHTML = list.map((p) => `
            <tr>
                <td>${escapeHtml(p.name)}</td>
                <td>${escapeHtml(p.category)}</td>
                <td>${Number(p.price || 0).toLocaleString()} EGP</td>
                <td>${Array.isArray(p.images) ? p.images.length : 0}</td>
                <td><button type="button" class="small-btn" data-edit-id="${p._id}">Edit</button></td>
            </tr>
        `).join('');

        productsTableBody.querySelectorAll('[data-edit-id]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const product = list.find((p) => p._id === btn.dataset.editId);
                if (!product) return;
                editingProduct = product;
                editingIdInput.value = product._id;
                formTitle.textContent = `Edit Product: ${product.name}`;
                submitBtn.textContent = 'Update Product';
                cancelEditBtn.style.display = 'inline-block';

                document.getElementById('name').value = product.name || '';
                document.getElementById('category').value = product.category || '';
                document.getElementById('price').value = product.price ?? '';
                document.getElementById('oldPrice').value = product.oldPrice ?? '';
                document.getElementById('brand').value = product.brand || '';
                document.getElementById('color').value = product.color || '';
                document.getElementById('description').value = product.description || '';
                document.getElementById('inStock').value = product.inStock === false ? 'false' : 'true';

                previewList.innerHTML = (Array.isArray(product.images) ? product.images : []).map((img) => `<img src="${img}" alt="existing image">`).join('');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });
    } catch (_err) {
        productsTableBody.innerHTML = '<tr><td colspan="5">Failed to load products.</td></tr>';
    }
}

imagesInput.addEventListener('change', () => {
    previewList.innerHTML = '';
    const files = Array.from(imagesInput.files || []);
    files.slice(0, 5).forEach((file) => {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.alt = file.name;
        previewList.appendChild(img);
    });

    if (files.length > 5) {
        showStatus('You selected more than 5 files. Only first 5 will be uploaded.');
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
        if (files.length === 0 && !editingIdInput.value) {
            showStatus('Please select at least one image.');
            submitBtn.disabled = false;
            return;
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
        const response = await fetch(endpoint, {
            method,
            body: formData
        });
        const payload = await response.json();

        if (!response.ok || !payload.ok) {
            showStatus(payload.error || 'Failed to create product.');
            submitBtn.disabled = false;
            return;
        }

        form.reset();
        previewList.innerHTML = '';
        if (editingId) {
            showStatus(`Product updated successfully. ID: ${payload.product._id}`, true);
        } else {
            showStatus(`Product created successfully. ID: ${payload.product._id}`, true);
        }
        resetToCreateMode();
        await loadProducts();
    } catch (error) {
        showStatus(`Request failed: ${error.message || 'Unknown error'}`);
    } finally {
        submitBtn.disabled = false;
    }
});

cancelEditBtn.addEventListener('click', () => {
    form.reset();
    previewList.innerHTML = '';
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

checkAdminAuth().then(loadProducts);
