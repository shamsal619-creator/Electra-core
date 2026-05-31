/**
 * Admin Order Listener - Real-time Order Notifications
 * نظام تنبيهات الأوردر الجديدة للأدمن
 */

import { 
    getFirestore,
    collection,
    query,
    where,
    onSnapshot,
    orderBy,
    limit,
    Timestamp
} from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js';

import { getAuth } from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js';
import { getApp } from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js';

const db = getFirestore(getApp());
const auth = getAuth(getApp());

// ===== SOUND NOTIFICATION =====
const NOTIFICATION_SOUND = new Audio('data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==');

// ===== ADMIN ORDERS LISTENER =====
export function initializeAdminOrderListener() {
    const user = auth.currentUser;
    
    // تحقق من أن المستخدم هو أدمن
    if (!user || user.role !== 'admin') {
        console.warn('المستخدم الحالي ليس أدمن');
        return;
    }

    const ordersRef = collection(db, 'orders');
    
    // الاستماع للأوردرز الجديدة (pending) - استخدام order_status
    const q = query(
        ordersRef,
        where('order_status', '==', 'pending'),
        orderBy('order_date', 'desc'),
        limit(50)
    );

    // Real-time listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
                const orderData = change.doc.data();
                const orderId = change.doc.id;

                // إظهار التنبيه
                showNewOrderNotification(orderId, orderData);
                
                // تشغيل صوت التنبيه
                playNotificationSound();
                
                // إضافة الأوردر إلى الجدول
                addOrderToTable(orderId, orderData);
                
                // إرسال إشعار المتصفح (إن أمكن)
                sendBrowserNotification(orderId, orderData);
            }
        });
    });

    return unsubscribe;
}

// ===== NOTIFICATION UI =====
function showNewOrderNotification(orderId, orderData) {
    const notificationContainer = document.getElementById('order-notifications') || createNotificationContainer();
    
    const shipping = orderData.shipping || {};
    const summary = orderData.summary || {};
    const firstName = shipping.first_name || '';
    const lastName = shipping.last_name || '';
    const totalAmount = summary.total_amount || 0;
    
    const notification = document.createElement('div');
    notification.className = 'order-notification';
    notification.innerHTML = `
        <div class="notification-header">
            <h4>أوردر جديد! 🎉</h4>
            <button class="close-notification" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
        <div class="notification-content">
            <p><strong>رقم الأوردر:</strong> ${orderId}</p>
            <p><strong>رمز الأوردر:</strong> ${orderData.order_code || 'N/A'}</p>
            <p><strong>العميل:</strong> ${firstName} ${lastName}</p>
            <p><strong>الإجمالي:</strong> ${totalAmount.toFixed(2)} جنيه</p>
            <p><strong>الوقت:</strong> ${new Date().toLocaleTimeString('ar-EG')}</p>
            <div class="notification-actions">
                <button class="btn-view" onclick="viewOrderDetails('${orderId}')">عرض التفاصيل</button>
                <button class="btn-accept" onclick="acceptOrder('${orderId}')">قبول الأوردر</button>
            </div>
        </div>
    `;

    notification.style.cssText = `
        background: linear-gradient(135deg, #0f766e 0%, #048c7f 100%);
        color: white;
        padding: 16px;
        border-radius: 8px;
        margin-bottom: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        animation: slideInRight 0.3s ease;
    `;

    notificationContainer.insertBefore(notification, notificationContainer.firstChild);

    // إزالة التنبيه تلقائياً بعد 10 ثوان
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 10000);
}

function createNotificationContainer() {
    const container = document.createElement('div');
    container.id = 'order-notifications';
    container.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        width: 350px;
        max-height: 600px;
        overflow-y: auto;
        z-index: 9999;
        background: transparent;
    `;
    document.body.appendChild(container);
    return container;
}

function playNotificationSound() {
    try {
        NOTIFICATION_SOUND.play();
    } catch (e) {
        console.log('لا يمكن تشغيل الصوت:', e);
    }
}

function sendBrowserNotification(orderId, orderData) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('أوردر جديد!', {
            body: `أوردر من ${orderData.shipping.first_name} - الإجمالي: ${orderData.summary.total_amount} جنيه`,
            icon: 'design/logo.png',
            tag: 'order-' + orderId,
            requireInteraction: true
        });
    }
}

// ===== REQUEST NOTIFICATION PERMISSION =====
export function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

// ===== ADD ORDER TO TABLE =====
function addOrderToTable(orderId, orderData) {
    const tableBody = document.getElementById('orders-table-body');
    if (!tableBody) return;

    const row = document.createElement('tr');
    row.id = `order-row-${orderId}`;
    
    const shipping = orderData.shipping || {};
    const summary = orderData.summary || {};
    const firstName = shipping.first_name || '';
    const lastName = shipping.last_name || '';
    const userEmail = orderData.user_email || '';
    const totalAmount = summary.total_amount || 0;
    
    const orderDate = orderData.order_date?.toDate?.() || new Date();
    const dateStr = orderDate.toLocaleDateString('ar-EG');
    const timeStr = orderDate.toLocaleTimeString('ar-EG');

    row.innerHTML = `
        <td>${orderId}</td>
        <td>${firstName} ${lastName}</td>
        <td>${userEmail}</td>
        <td>${totalAmount.toFixed(2)}</td>
        <td>${dateStr} ${timeStr}</td>
        <td><span class="status-badge status-pending">قيد الانتظار</span></td>
        <td>
            <button class="btn-small" onclick="viewOrderDetails('${orderId}')">عرض</button>
            <button class="btn-small" onclick="acceptOrder('${orderId}')">قبول</button>
        </td>
    `;

    tableBody.insertBefore(row, tableBody.firstChild);
}

// ===== ORDER ACTIONS =====
export async function viewOrderDetails(orderId) {
    try {
        const response = await fetch(`/api/orders/${orderId}`);
        const order = await response.json();

        showOrderModal(order);
    } catch (error) {
        console.error('خطأ في جلب تفاصيل الأوردر:', error);
        alert('خطأ في جلب التفاصيل');
    }
}

export async function acceptOrder(orderId) {
    if (!confirm('هل أنت متأكد من قبول هذا الأوردر؟')) {
        return;
    }

    try {
        const response = await fetch(`/api/orders/${orderId}/accept`, {
            method: 'POST'
        });

        if (response.ok) {
            const row = document.getElementById(`order-row-${orderId}`);
            if (row) {
                row.remove();
            }
            alert('تم قبول الأوردر بنجاح!');
        }
    } catch (error) {
        console.error('خطأ في قبول الأوردر:', error);
        alert('خطأ في قبول الأوردر');
    }
}

// ===== ORDER MODAL =====
function showOrderModal(order) {
    const modal = document.createElement('div');
    modal.className = 'order-modal';
    
    const shipping = order.shipping || order.shippingInfo || {};
    const summary = order.summary || order.billing || {};
    const items = order.items || [];
    
    const firstName = shipping.first_name || shipping.firstName || '';
    const lastName = shipping.last_name || shipping.lastName || '';
    const email = shipping.email || '';
    const phone = shipping.phone || '';
    const address = shipping.address || '';
    const city = shipping.city || '';
    const postalCode = shipping.postal_code || shipping.postalCode || '';
    
    const detailsHTML = items.map(item => `
        <tr>
            <td>${item.name || ''}</td>
            <td>${item.quantity || 1}</td>
            <td>${(item.price || 0).toFixed(2)}</td>
            <td>${(item.subtotal || item.price * item.quantity || 0).toFixed(2)}</td>
        </tr>
    `).join('');

    modal.innerHTML = `
        <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2>تفاصيل الأوردر #${order.id}</h2>
                <button class="close-btn" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
            
            <div class="modal-body">
                <div class="section">
                    <h3>معلومات العميل</h3>
                    <p><strong>الاسم:</strong> ${firstName} ${lastName}</p>
                    <p><strong>البريد:</strong> ${email}</p>
                    <p><strong>الهاتف:</strong> ${phone}</p>
                </div>

                <div class="section">
                    <h3>معلومات الشحن</h3>
                    <p><strong>العنوان:</strong> ${address}</p>
                    <p><strong>المدينة:</strong> ${city}</p>
                    <p><strong>الرمز البريدي:</strong> ${postalCode}</p>
                </div>

                <div class="section">
                    <h3>تفاصيل الأوردر</h3>
                    <table class="order-items-table">
                        <thead>
                            <tr>
                                <th>المنتج</th>
                                <th>الكمية</th>
                                <th>السعر</th>
                                <th>الإجمالي</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${detailsHTML}
                        </tbody>
                    </table>
                </div>

                <div class="section summary">
                    <p><strong>المجموع الفرعي:</strong> ${(summary.subtotal || 0).toFixed(2)}</p>
                    <p><strong>تكلفة الشحن:</strong> ${(summary.shipping_cost || summary.shippingFee || 50).toFixed(2)}</p>
                    <p><strong>الضريبة:</strong> ${(summary.tax || 0).toFixed(2)}</p>
                    <p class="total"><strong>الإجمالي:</strong> ${(summary.total_amount || summary.total || 0).toFixed(2)}</p>
                </div>

                <div class="section">
                    <h3>معلومات الدفع</h3>
                    <p><strong>الطريقة:</strong> ${order.payment?.payment_method || order.paymentMethod || 'N/A'}</p>
                    <p><strong>رمز الأوردر:</strong> ${order.order_code || 'N/A'}</p>
                </div>
            </div>
        </div>
    `;

    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10000;
    `;

    document.body.appendChild(modal);
}

// ===== STYLES =====
const styles = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }

    .order-notification {
        border-left: 4px solid white;
    }

    .notification-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
    }

    .notification-header h4 {
        margin: 0;
        font-size: 16px;
    }

    .close-notification {
        background: none;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
    }

    .notification-actions {
        display: flex;
        gap: 8px;
        margin-top: 12px;
    }

    .btn-view, .btn-accept {
        flex: 1;
        padding: 8px 12px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 700;
        transition: 0.3s;
    }

    .btn-view {
        background: rgba(255, 255, 255, 0.2);
        color: white;
    }

    .btn-accept {
        background: #4caf50;
        color: white;
    }

    .btn-view:hover, .btn-accept:hover {
        transform: translateY(-2px);
    }

    .order-modal {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
    }

    .modal-content {
        position: relative;
        background: white;
        border-radius: 12px;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        z-index: 10001;
    }

    .modal-header {
        padding: 24px;
        border-bottom: 1px solid #e6e6e6;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .modal-body {
        padding: 24px;
    }

    .section {
        margin-bottom: 24px;
    }

    .section h3 {
        color: #05a391;
        margin-bottom: 12px;
    }

    .section p {
        margin: 8px 0;
    }

    .summary {
        background: #f5f5f5;
        padding: 16px;
        border-radius: 8px;
    }

    .total {
        font-size: 18px;
        color: #05a391;
    }

    .order-items-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 12px;
    }

    .order-items-table th,
    .order-items-table td {
        padding: 12px;
        text-align: right;
        border-bottom: 1px solid #e6e6e6;
    }

    .order-items-table th {
        background: #f5f5f5;
        font-weight: 700;
    }

    .status-badge {
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 700;
    }

    .status-pending {
        background: #fbbf24;
        color: #333;
    }

    .status-accepted {
        background: #4caf50;
        color: white;
    }

    .close-btn {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #333;
    }

    .btn-small {
        padding: 6px 12px;
        border: none;
        border-radius: 4px;
        background: #05a391;
        color: white;
        cursor: pointer;
        font-weight: 700;
        transition: 0.3s;
    }

    .btn-small:hover {
        background: #048c7f;
    }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

// ===== AUTO INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    const isAdminPage = document.body.classList.contains('admin-page');
    if (isAdminPage) {
        requestNotificationPermission();
        initializeAdminOrderListener();
    }
});

export { showOrderModal };
