/**
 * Admin Unified Logic - Orchestrates Dashboard, Orders, and Products
 */

import { 
    getFirestore,
    collection,
    query,
    onSnapshot,
    orderBy,
    limit,
    doc,
    setDoc,
    serverTimestamp,
    getDocs,
    where
} from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js';

import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js';
import { getApp } from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js';

// Initialize Firebase services
const db = getFirestore(getApp());
const auth = getAuth(getApp());

// State
let isAdminAuthenticated = false;
let allProducts = [];
let editingProduct = null;
let debounceTimer = null;

// DOM Elements - General
const adminEmail = document.getElementById('adminEmail');
const authStatusChip = document.getElementById('authStatusChip');
const logoutBtn = document.getElementById('logoutBtn');

// DOM Elements - Dashboard
const totalSalesEl = document.getElementById('totalSales');
const pendingCountEl = document.getElementById('pendingCount');
const todayOrdersEl = document.getElementById('todayOrders');
const totalProductsEl = document.getElementById('totalProducts');
const systemChips = document.getElementById('systemChips');

// DOM Elements - Orders
const ordersTableBody = document.getElementById('orders-table-body');
const orderModal = document.getElementById('orderModal');
const modalContent = document.getElementById('modal-content');

// DOM Elements - Products
const productForm = document.getElementById('productForm');
const productsTableBody = document.getElementById('productsTableBody');
const imagesInput = document.getElementById('images');
const existingPreviewList = document.getElementById('existingPreviewList');
const newPreviewList = document.getElementById('newPreviewList');
const statusBox = document.getElementById('status');
const submitBtn = document.getElementById('submitBtn');
const formTitle = document.getElementById('formTitle');
const editingIdInput = document.getElementById('editingId');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const modeChip = document.getElementById('modeChip');
const searchInput = document.getElementById('searchInput');
const refreshBtn = document.getElementById('refreshBtn');

// ===== AUTHENTICATION =====
async function checkAuth() {
    try {
        const response = await fetch('/api/session', { credentials: 'include' });
        const payload = await response.json();
        
        if (!response.ok || !payload.ok || !payload.user?.isAdmin) {
            window.location.href = '/login.html?redirect=admin.html';
            return;
        }

        isAdminAuthenticated = true;
        adminEmail.textContent = payload.user.email;
        authStatusChip.textContent = 'Authenticated';
        authStatusChip.className = 'chip ok';
        
        // Start listeners after auth
        // initializeDashboardAndOrders(); // DEPRECATED
        loadProducts();
        loadSystemStatus();
    } catch (error) {
        console.error('Auth check failed:', error);
        window.location.href = '/login.html';
    }
}

logoutBtn.addEventListener('click', async () => {
    try {
        await fetch('/api/logout', { method: 'POST' });
        await signOut(auth);
        window.location.href = '/login.html';
    } catch (error) {
        console.error('Logout failed:', error);
    }
});

// ===== DASHBOARD & ORDERS (Firestore Real-time) - DEPRECATED: Use admin-dashboard.html logic =====
/*
function initializeDashboardAndOrders() {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, orderBy('order_date', 'desc'), limit(100));

    onSnapshot(q, (snapshot) => {
        if (!ordersTableBody) return;

        ordersTableBody.innerHTML = '';
        let pendingCount = 0;
        let totalSales = 0;
        let todayCount = 0;
        const today = new Date().toDateString();

        snapshot.forEach((doc) => {
            const orderData = doc.data();
            const orderId = doc.id;

            // Stats
            if (orderData.order_status === 'pending') pendingCount++;
            totalSales += orderData.summary.total_amount || 0;
            
            const orderDate = orderData.order_date?.toDate?.() || new Date();
            if (orderDate.toDateString() === today) todayCount++;

            // Table row
            addOrderToTable(orderId, orderData);
        });

        // Update Dashboard Stats
        if (pendingCountEl) pendingCountEl.textContent = pendingCount;
        if (totalSalesEl) totalSalesEl.textContent = totalSales.toLocaleString() + ' EGP';
        if (todayOrdersEl) todayOrdersEl.textContent = todayCount;

        // Handle Notifications for new orders
        snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
                const orderData = change.doc.data();
                const now = new Date();
                const orderTime = orderData.order_date?.toDate?.() || now;
                if (now - orderTime < 60000 && orderData.order_status === 'pending') {
                    showNewOrderNotification(change.doc.id, orderData);
                    playNotificationSound();
                }
            }
        });
    });
}
*/

function addOrderToTable(orderId, orderData) {
    if (!ordersTableBody) return; // Add check
    const row = document.createElement('tr');
    row.id = `order-row-${orderId}`;
    
    const orderDate = orderData.order_date?.toDate?.() || new Date();
    const dateStr = orderDate.toLocaleDateString();
    const timeStr = orderDate.toLocaleTimeString();

    const statusMap = {
        'pending': 'Pending',
        'accepted': 'Preparing',
        'shipped': 'In Transit',
        'delivered': 'Delivered',
        'cancelled': 'Cancelled'
    };

    row.innerHTML = `
        <td><strong>${orderData.order_number || '#' + orderId.slice(-6).toUpperCase()}</strong></td>
        <td>${orderData.shipping.first_name} ${orderData.shipping.last_name}</td>
        <td>${dateStr} ${timeStr}</td>
        <td>${orderData.summary.total_amount.toLocaleString()} EGP</td>
        <td><span class="status-badge status-${orderData.order_status}">${statusMap[orderData.order_status] || orderData.order_status}</span></td>
        <td>
            <div style="display: flex; gap: 5px; align-items: center;">
                <button class="small-btn" onclick="window.viewOrderDetails('${orderId}')">View</button>
                <select class="status-select" onchange="window.updateOrderStatus('${orderId}', this.value)" style="padding: 4px; border-radius: 4px; border: 1px solid #ddd; font-family: inherit; font-size: 12px;">
                    <option value="" disabled selected>Status</option>
                    <option value="pending">Pending</option>
                    <option value="accepted">Preparing</option>
                    <option value="shipped">In Transit</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>
        </td>
    `;
    ordersTableBody.appendChild(row);
}

// ===== PRODUCT MANAGEMENT =====
async function loadProducts() {
    try {
        const response = await fetch('/api/products');
        const payload = await response.json();
        if (!response.ok || !payload.ok) return;
        
        allProducts = payload.products || [];
        if (totalProductsEl) totalProductsEl.textContent = allProducts.length;
        renderProductsTable(allProducts);
    } catch (error) {
        console.error('Load products failed:', error);
    }
}

function renderProductsTable(list) {
    if (!productsTableBody) return;
    
    if (list.length === 0) {
        productsTableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No products found</td></tr>';
        return;
    }

    productsTableBody.innerHTML = list.map(p => {
        const imgs = Array.isArray(p.images) ? p.images : [];
        const thumbs = imgs.slice(0, 3).map(u => `<img src="${u}" alt="thumb" style="width:30px; height:30px; object-fit:cover; border-radius:4px;">`).join('');
        
        return `
            <tr>
                <td><strong>${escapeHtml(p.name)}</strong></td>
                <td>${escapeHtml(p.category)}</td>
                <td>${Number(p.price).toLocaleString()} EGP</td>
                <td><div class="thumbs">${thumbs}</div></td>
                <td>
                    <div style="display:flex; gap:5px;">
                        <button class="small-btn" onclick="window.editProduct('${p._id}')">Edit</button>
                        <button class="small-btn" onclick="window.deleteProduct('${p._id}')" style="color:#ef4444; border-color:#fecaca;">Delete</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Global functions for onclick handlers
window.viewOrderDetails = async (orderId) => {
    try {
        const docSnap = await getDocs(query(collection(db, 'orders'), where('__name__', '==', orderId)));
        if (docSnap.empty) return;
        
        const order = docSnap.docs[0].data();
        order.order_id = orderId;
        showOrderModal(order);
    } catch (error) {
        console.error('Error viewing order:', error);
    }
};

window.printOrder = (orderId) => {
    const modalContentClone = modalContent.cloneNode(true);
    
    // Remove buttons and dropdowns for printing
    const elementsToRemove = modalContentClone.querySelectorAll('button, select, .close-modal, label');
    elementsToRemove.forEach(el => el.remove());

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html lang="en">
        <head>
            <title>Order Invoice - ${orderId}</title>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
            <style>
                body { font-family: 'Inter', sans-serif; padding: 40px; color: #333; }
                .status-badge { display: inline-block; padding: 5px 15px; border-radius: 20px; font-weight: bold; font-size: 14px; margin-bottom: 20px; }
                .status-pending { background: #fef3c7; color: #92400e; }
                .status-accepted { background: #dcfce7; color: #166534; }
                .status-shipped { background: #dbeafe; color: #1e40af; }
                .status-delivered { background: #f0fdf4; color: #15803d; }
                .status-cancelled { background: #fee2e2; color: #991b1b; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { padding: 12px; border: 1px solid #ddd; text-align: left; }
                th { background: #f8fafc; }
                .total-section { margin-top: 30px; text-align: right; font-size: 18px; }
                .total-row { font-weight: bold; color: #0f766e; font-size: 22px; }
                .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #0f766e; padding-bottom: 20px; }
                @media print { .no-print { display: none; } }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>ElectraCore - Order Invoice</h1>
                <p>Print Date: ${new Date().toLocaleString()}</p>
            </div>
            ${modalContentClone.innerHTML}
            <script>window.onload = () => { window.print(); window.close(); }</script>
        </body>
        </html>
    `);
    printWindow.document.close();
};

window.updateOrderStatus = async (orderId, newStatus) => {
    if (!newStatus) return;
    
    const statusNames = {
        'pending': 'Pending',
        'accepted': 'Preparing',
        'shipped': 'In Transit',
        'delivered': 'Delivered',
        'cancelled': 'Cancelled'
    };

    if (!confirm(`Change status to ${statusNames[newStatus]}?`)) return;

    try {
        const orderRef = doc(db, 'orders', orderId);
        await setDoc(orderRef, { 
            order_status: newStatus,
            last_updated: serverTimestamp() 
        }, { merge: true });
        
        if (orderModal.style.display === 'flex' && orderModal.getAttribute('data-order-id') === orderId) {
            orderModal.style.display = 'none';
        }
    } catch (error) {
        console.error('Update status failed:', error);
        alert('Failed to update status');
    }
};

window.deleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
        const response = await fetch(`/api/products/${productId}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        const payload = await response.json();
        if (payload.ok) {
            loadProducts();
        } else {
            alert(payload.error || 'Failed to delete product');
        }
    } catch (error) {
        console.error('Delete product failed:', error);
    }
};

window.editProduct = (productId) => {
    const product = allProducts.find(p => p._id === productId);
    if (!product) return;

    editingProduct = { ...product };
    editingIdInput.value = product._id;
    formTitle.textContent = 'Edit Product';
    submitBtn.textContent = 'Update Product';
    cancelEditBtn.style.display = 'block';
    
    document.getElementById('name').value = product.name || '';
    document.getElementById('category').value = product.category || '';
    document.getElementById('price').value = product.price || '';
    document.getElementById('oldPrice').value = product.oldPrice || '';
    document.getElementById('brand').value = product.brand || '';
    document.getElementById('color').value = product.color || '';
    document.getElementById('description').value = product.description || '';
    document.getElementById('inStock').value = product.inStock === false ? 'false' : 'true';

    renderExistingImages(product.images || []);
    modeChip.textContent = 'Edit Mode';
    modeChip.className = 'chip bad';
    
    // Switch to products section and scroll to form
    document.querySelector('.menu-item[data-target="products-section"]').click();
    productForm.scrollIntoView({ behavior: 'smooth' });
};

// Form Handlers
productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    statusBox.textContent = 'Saving...';
    
    try {
        const formData = new FormData(productForm);
        const editingId = editingIdInput.value;
        
        if (editingId && editingProduct?.images) {
            formData.append('existingImages', JSON.stringify(editingProduct.images));
        }

        const method = editingId ? 'PUT' : 'POST';
        const url = editingId ? `/api/products/${editingId}` : '/api/products';

        const response = await fetch(url, {
            method,
            body: formData,
            credentials: 'include'
        });

        const payload = await response.json();
        if (payload.ok) {
            statusBox.textContent = 'Product saved successfully!';
            statusBox.style.color = 'green';
            resetProductForm();
            loadProducts();
        } else {
            statusBox.textContent = payload.error || 'Failed to save product';
            statusBox.style.color = 'red';
        }
    } catch (error) {
        statusBox.textContent = 'Request error';
        statusBox.style.color = 'red';
    } finally {
        submitBtn.disabled = false;
    }
});

cancelEditBtn.addEventListener('click', resetProductForm);

function resetProductForm() {
    productForm.reset();
    editingIdInput.value = '';
    editingProduct = null;
    formTitle.textContent = 'Add New Product';
    submitBtn.textContent = 'Create Product';
    cancelEditBtn.style.display = 'none';
    existingPreviewList.innerHTML = '';
    newPreviewList.innerHTML = '';
    modeChip.textContent = 'Create Mode';
    modeChip.className = 'chip ok';
}

// Helpers
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function renderExistingImages(images) {
    existingPreviewList.innerHTML = images.map((img, idx) => `
        <div class="preview-item">
            <img src="${img}">
            <button type="button" class="remove-image-btn" onclick="window.removeExistingImage(${idx})">×</button>
        </div>
    `).join('');
}

window.removeExistingImage = (idx) => {
    if (!editingProduct) return;
    editingProduct.images.splice(idx, 1);
    renderExistingImages(editingProduct.images);
};

imagesInput.addEventListener('change', () => {
    newPreviewList.innerHTML = '';
    Array.from(imagesInput.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const div = document.createElement('div');
            div.className = 'preview-item';
            div.innerHTML = `<img src="${e.target.result}">`;
            newPreviewList.appendChild(div);
        };
        reader.readAsDataURL(file);
    });
});

// Notifications
function showNewOrderNotification(orderId, orderData) {
    const container = document.getElementById('order-notifications') || createNotificationContainer();
    const div = document.createElement('div');
    div.className = 'order-notification';
    div.innerHTML = `
        <div style="padding:15px; background:#0f766e; color:white; border-radius:8px; margin-bottom:10px; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
            <h4 style="margin:0 0 5px 0;">New Order! 📦</h4>
            <p style="margin:0; font-size:13px;">${orderData.shipping.first_name} - ${orderData.summary.total_amount} EGP</p>
            <button onclick="window.viewOrderDetails('${orderId}'); this.parentElement.parentElement.remove();" style="margin-top:10px; padding:5px 10px; border:none; border-radius:4px; cursor:pointer; font-weight:bold;">View Details</button>
        </div>
    `;
    container.prepend(div);
    setTimeout(() => div.remove(), 10000);
}

function createNotificationContainer() {
    const div = document.createElement('div');
    div.id = 'order-notifications';
    div.style.cssText = 'position:fixed; top:20px; right:20px; width:300px; z-index:9999;';
    document.body.appendChild(div);
    return div;
}

function playNotificationSound() {
    try {
        const context = new (window.AudioContext || window.webkitAudioContext)();
        const osc = context.createOscillator();
        const gain = context.createGain();
        osc.connect(gain);
        gain.connect(context.destination);
        osc.frequency.value = 880;
        gain.gain.setValueAtTime(0, context.currentTime);
        gain.gain.linearRampToValueAtTime(0.5, context.currentTime + 0.1);
        gain.gain.linearRampToValueAtTime(0, context.currentTime + 0.5);
        osc.start();
        osc.stop(context.currentTime + 0.5);
    } catch (e) {}
}

// System Status
async function loadSystemStatus() {
    try {
        const res = await fetch('/api/status');
        const data = await res.json();
        systemChips.innerHTML = `
            <span class="chip ${data.databaseConnected ? 'ok' : 'bad'}">DB: ${data.databaseConnected ? 'Connected' : 'Error'}</span>
            <span class="chip ${data.envLoaded ? 'ok' : 'bad'}">ENV: ${data.envLoaded ? 'OK' : 'Error'}</span>
            <span class="chip">Provider: ${data.imageStorageProvider}</span>
        `;
    } catch (e) {
        systemChips.innerHTML = '<span class="chip bad">Status Error</span>';
    }
}

// Modal View
function showOrderModal(order) {
    const statusMap = {
        'pending': 'Pending',
        'accepted': 'Preparing',
        'shipped': 'In Transit',
        'delivered': 'Delivered',
        'cancelled': 'Cancelled'
    };

    const orderDisplayName = order.order_number || order.order_id.slice(-6).toUpperCase();

    modalContent.innerHTML = `
        <span class="close-modal" onclick="document.getElementById('orderModal').style.display='none'">&times;</span>
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; margin-bottom: 20px;">
            <h2 style="color: var(--admin-primary); margin: 0;">Order Details #${orderDisplayName}</h2>
            <div style="display: flex; gap: 10px; align-items: center;">
                <button onclick="window.printOrder('${order.order_id}')" class="small-btn" style="display: flex; align-items: center; gap: 5px;">
                    <span>🖨️</span> Print Invoice
                </button>
                <div class="status-badge status-${order.order_status}">${statusMap[order.order_status] || order.order_status}</div>
            </div>
        </div>
        
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:20px;">
            <div>
                <h4 style="margin-bottom:8px;">Customer Information</h4>
                <p style="font-size:14px; line-height:1.6;">
                    <strong>Name:</strong> ${order.shipping.first_name} ${order.shipping.last_name}<br>
                    <strong>Email:</strong> ${order.shipping.email}<br>
                    <strong>Phone:</strong> ${order.shipping.phone}
                </p>
            </div>
            <div>
                <h4 style="margin-bottom:8px;">Shipping Address</h4>
                <p style="font-size:14px; line-height:1.6;">
                    <strong>Address:</strong> ${order.shipping.address}<br>
                    <strong>City:</strong> ${order.shipping.city}<br>
                    <strong>Postal Code:</strong> ${order.shipping.postal_code}
                </p>
            </div>
        </div>

        <h4 style="margin-bottom:10px;">Ordered Items</h4>
        <table style="width:100%; border-collapse:collapse; margin-bottom:20px; font-size:14px;">
            <thead style="background:#f8fafc;">
                <tr>
                    <th style="padding:10px; text-align:left;">Product</th>
                    <th style="padding:10px; text-align:center;">Qty</th>
                    <th style="padding:10px; text-align:right;">Price</th>
                    <th style="padding:10px; text-align:right;">Subtotal</th>
                </tr>
            </thead>
            <tbody>
                ${order.order_details.map(item => `
                    <tr>
                        <td style="padding:10px; border-bottom:1px solid #eee; display:flex; align-items:center; gap:10px;">
                            <img src="${item.image || 'design/product-placeholder.jpg'}" alt="${item.product_name}" style="width:40px; height:40px; object-fit:cover; border-radius:4px;">
                            <span>${item.product_name}</span>
                        </td>
                        <td style="padding:10px; border-bottom:1px solid #eee; text-align:center;">${item.quantity}</td>
                        <td style="padding:10px; border-bottom:1px solid #eee; text-align:right;">${item.price.toLocaleString()} EGP</td>
                        <td style="padding:10px; border-bottom:1px solid #eee; text-align:right;">${item.subtotal.toLocaleString()} EGP</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>

        <div style="text-align:right; border-top:2px solid #f1f5f9; padding-top:15px; font-size:14px;">
            <p style="margin-bottom:5px;">Subtotal: ${order.summary.subtotal.toLocaleString()} EGP</p>
            <p style="margin-bottom:5px;">Shipping: ${order.summary.shipping_cost.toLocaleString()} EGP</p>
            <p style="margin-bottom:5px;">Tax (14%): ${order.summary.tax.toLocaleString()} EGP</p>
            <h3 style="color:var(--admin-primary); font-size:20px; margin-top:10px;">Total: ${order.summary.total_amount.toLocaleString()} EGP</h3>
        </div>
        
        <div style="margin-top:20px; background:#f8fafc; padding:15px; border-radius:8px;" class="no-print">
            <label style="font-weight:bold; display:block; margin-bottom:10px;">Update Order Status:</label>
            <select onchange="window.updateOrderStatus('${order.order_id}', this.value)" style="width:100%; padding:10px; border-radius:6px; border:1px solid #ddd; font-family:inherit;">
                <option value="" disabled selected>Select status...</option>
                <option value="pending" ${order.order_status === 'pending' ? 'disabled' : ''}>Pending</option>
                <option value="accepted" ${order.order_status === 'accepted' ? 'disabled' : ''}>Preparing</option>
                <option value="shipped" ${order.order_status === 'shipped' ? 'disabled' : ''}>In Transit</option>
                <option value="delivered" ${order.order_status === 'delivered' ? 'disabled' : ''}>Delivered</option>
                <option value="cancelled" ${order.order_status === 'cancelled' ? 'disabled' : ''}>Cancelled</option>
            </select>
        </div>
    `;
    orderModal.style.display = 'flex';
    orderModal.setAttribute('data-order-id', order.order_id);
}

// Search
searchInput.addEventListener('input', () => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        const q = searchInput.value.toLowerCase();
        const filtered = allProducts.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
        renderProductsTable(filtered);
    }, 200);
});

refreshBtn.addEventListener('click', loadProducts);

// Start
checkAuth();
