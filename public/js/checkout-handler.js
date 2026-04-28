/**
 * Checkout Handler - Professional Order Management
 * هنا يتم معالجة عملية الشراء بشكل احترافي وآمن
 */

// استيراد Firebase
import { 
    getFirestore, 
    collection, 
    addDoc, 
    serverTimestamp,
    doc,
    setDoc,
    query,
    where,
    getDocs
} from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js';

import { getAuth } from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js';
import { getApp } from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js';

const db = getFirestore(getApp());
const auth = getAuth(getApp());

// ===== VALIDATION RULES =====
const VALIDATION_RULES = {
    firstName: {
        required: true,
        minLength: 2,
        maxLength: 50,
        pattern: /^[a-zA-Z\s]+$/,
        message: "الاسم الأول يجب أن يكون من 2 إلى 50 حرف (أحرف فقط)"
    },
    lastName: {
        required: true,
        minLength: 2,
        maxLength: 50,
        pattern: /^[a-zA-Z\s]+$/,
        message: "الاسم الأخير يجب أن يكون من 2 إلى 50 حرف (أحرف فقط)"
    },
    email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "البريد الإلكتروني غير صحيح"
    },
    phone: {
        required: true,
        pattern: /^[\d\+\-\s]{10,}$/,
        message: "رقم الهاتف يجب أن يكون 10 أرقام على الأقل"
    },
    address: {
        required: true,
        minLength: 5,
        maxLength: 200,
        message: "العنوان يجب أن يكون من 5 إلى 200 حرف"
    },
    city: {
        required: true,
        minLength: 2,
        maxLength: 50,
        message: "اسم المدينة يجب أن يكون من 2 إلى 50 حرف"
    },
    postalCode: {
        required: true,
        pattern: /^[\d\-\s]{3,}$/,
        message: "الرمز البريدي غير صحيح"
    },
    paymentMethod: {
        required: true,
        message: "يجب اختيار طريقة دفع"
    }
};

// ===== VALIDATION FUNCTIONS =====
function validateField(fieldName, value) {
    const rules = VALIDATION_RULES[fieldName];
    if (!rules) return { valid: true };

    // Check required
    if (rules.required && !value.trim()) {
        return { valid: false, message: `${fieldName} مطلوب` };
    }

    // Check min length
    if (rules.minLength && value.length < rules.minLength) {
        return { valid: false, message: rules.message };
    }

    // Check max length
    if (rules.maxLength && value.length > rules.maxLength) {
        return { valid: false, message: rules.message };
    }

    // Check pattern
    if (rules.pattern && !rules.pattern.test(value)) {
        return { valid: false, message: rules.message };
    }

    return { valid: true };
}

function validateCheckoutForm(formData) {
    const errors = {};
    
    Object.keys(VALIDATION_RULES).forEach(field => {
        const result = validateField(field, formData[field] || '');
        if (!result.valid) {
            errors[field] = result.message;
        }
    });

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

// ===== ORDER CREATION =====
async function createOrder(orderData) {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error("يجب تسجيل الدخول أولاً");
        }

        // البيانات الأساسية للأوردر
        const orderObj = {
            // معلومات الأوردر الأساسية
            order_status: 'pending',
            order_date: serverTimestamp(),
            user_id: user.uid,
            user_email: user.email,

            // معلومات الشحن
            shipping: {
                first_name: orderData.firstName,
                last_name: orderData.lastName,
                email: orderData.email,
                phone: orderData.phone,
                address: orderData.address,
                city: orderData.city,
                postal_code: orderData.postalCode,
                country: orderData.country || 'Egypt',
                shipping_status: 'pending',
                shipping_date: null
            },

            // معلومات الدفع
            payment: {
                payment_method: orderData.paymentMethod,
                payment_status: 'pending',
                payment_date: null,
                amount: orderData.totalAmount
            },

            // تفاصيل الأوردر (المنتجات)
            order_details: orderData.cartItems.map(item => ({
                product_id: item.productId,
                product_name: item.productName,
                quantity: item.quantity,
                price: item.price,
                subtotal: item.quantity * item.price
            })),

            // ملخص الأوردر
            summary: {
                subtotal: orderData.subtotal,
                shipping_cost: orderData.shippingCost || 0,
                tax: orderData.tax || 0,
                total_amount: orderData.totalAmount,
                items_count: orderData.cartItems.length
            },

            // معلومات إضافية
            notes: orderData.notes || '',
            created_at: serverTimestamp(),
            last_updated: serverTimestamp()
        };

        // حفظ الأوردر في Firestore
        const ordersRef = collection(db, 'orders');
        const docRef = await addDoc(ordersRef, orderObj);

        // حفظ معلومات الأوردر في ملف المستخدم أيضاً (للوصول السريع)
        const userRef = doc(db, 'users', user.uid);
        const userOrders = collection(userRef, 'orders');
        await setDoc(doc(userOrders, docRef.id), {
            order_id: docRef.id,
            created_at: serverTimestamp(),
            status: 'pending'
        });

        return {
            success: true,
            orderId: docRef.id,
            orderData: orderObj
        };
    } catch (error) {
        console.error('خطأ في إنشاء الأوردر:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// ===== SHOW VALIDATION ERRORS =====
function showValidationError(fieldName, message) {
    const inputElement = document.querySelector(`[name="${fieldName}"]`);
    if (inputElement) {
        inputElement.classList.add('error');
        const errorDiv = inputElement.nextElementSibling;
        if (errorDiv && errorDiv.classList.contains('error-message')) {
            errorDiv.textContent = message;
        } else {
            const error = document.createElement('div');
            error.className = 'error-message';
            error.textContent = message;
            error.style.color = '#b91c1c';
            error.style.fontSize = '12px';
            error.style.marginTop = '4px';
            inputElement.parentElement.appendChild(error);
        }
    }
}

function clearValidationErrors() {
    document.querySelectorAll('input, select').forEach(el => {
        el.classList.remove('error');
        const errorMsg = el.parentElement.querySelector('.error-message');
        if (errorMsg) errorMsg.remove();
    });
}

// ===== FORM SUBMISSION HANDLER =====
export async function handleCheckoutSubmit(event) {
    event.preventDefault();
    
    clearValidationErrors();
    
    // جمع البيانات من النموذج
    const formData = {
        firstName: document.querySelector('[name="firstName"]')?.value || '',
        lastName: document.querySelector('[name="lastName"]')?.value || '',
        email: document.querySelector('[name="email"]')?.value || '',
        phone: document.querySelector('[name="phone"]')?.value || '',
        address: document.querySelector('[name="address"]')?.value || '',
        city: document.querySelector('[name="city"]')?.value || '',
        postalCode: document.querySelector('[name="postalCode"]')?.value || '',
        country: document.querySelector('[name="country"]')?.value || 'Egypt',
        paymentMethod: document.querySelector('input[name="paymentMethod"]:checked')?.value || '',
        notes: document.querySelector('[name="notes"]')?.value || ''
    };

    // التحقق من صحة البيانات
    const validation = validateCheckoutForm(formData);
    
    if (!validation.isValid) {
        Object.keys(validation.errors).forEach(field => {
            showValidationError(field, validation.errors[field]);
        });
        showToast('يرجى ملء جميع البيانات المطلوبة بشكل صحيح', 'error');
        return;
    }

    // عرض رسالة التحميل
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'جاري معالجة الأوردر...';

    try {
        // الحصول على بيانات السلة من localStorage
        const cartData = JSON.parse(localStorage.getItem('cart')) || [];
        
        if (cartData.length === 0) {
            showToast('السلة فارغة!', 'error');
            return;
        }

        // حساب الإجمالي
        const subtotal = cartData.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shippingCost = 50; // قيمة ثابتة للشحن
        const tax = subtotal * 0.05; // 5% ضريبة
        const totalAmount = subtotal + shippingCost + tax;

        // إنشاء البيانات الكاملة للأوردر
        const orderData = {
            ...formData,
            cartItems: cartData,
            subtotal,
            shippingCost,
            tax,
            totalAmount
        };

        // إنشاء الأوردر في Firebase
        const result = await createOrder(orderData);

        if (result.success) {
            // مسح السلة
            localStorage.removeItem('cart');
            
            // عرض رسالة النجاح
            showToast('تم إنشاء الأوردر بنجاح! رقم الأوردر: ' + result.orderId, 'success');
            
            // إعادة التوجيه بعد 2 ثانية
            setTimeout(() => {
                window.location.href = `/order-confirmation.html?orderId=${result.orderId}`;
            }, 2000);
        } else {
            showToast('خطأ في إنشاء الأوردر: ' + result.error, 'error');
        }
    } catch (error) {
        console.error('خطأ:', error);
        showToast('حدث خطأ ما. يرجى المحاولة مرة أخرى', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

// ===== TOAST NOTIFICATIONS =====
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 20px;
        padding: 16px 24px;
        background: ${type === 'success' ? '#0f766e' : type === 'error' ? '#b91c1c' : '#253858'};
        color: white;
        border-radius: 8px;
        z-index: 10000;
        font-weight: 700;
        animation: slideInUp 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutDown 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// ===== EXPORT FUNCTIONS =====
export { validateCheckoutForm, createOrder, showToast };
