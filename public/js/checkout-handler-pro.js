/**
 * Professional Checkout Handler
 * Handles order creation, validation, and payment processing
 */

// Configuration
const SHIPPING_FEE = 50; // EGP
const TAX_RATE = 0.14; // 14%

// Validation Rules
const VALIDATION_RULES = {
    firstName: {
        required: true,
        minLength: 2,
        maxLength: 50,
        pattern: /^[a-zA-Z\s]+$/,
        message: "First name should contain letters only (2-50 characters)"
    },
    lastName: {
        required: true,
        minLength: 2,
        maxLength: 50,
        pattern: /^[a-zA-Z\s]+$/,
        message: "Last name should contain letters only (2-50 characters)"
    },
    email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Please enter a valid email address"
    },
    phone: {
        required: true,
        pattern: /^[\d\+\-\s(){}\[\]]{10,}$/,
        message: "Phone number must be at least 10 digits"
    },
    address: {
        required: true,
        minLength: 5,
        maxLength: 200,
        message: "Address must be between 5-200 characters"
    },
    city: {
        required: true,
        minLength: 2,
        maxLength: 50,
        message: "City name must be between 2-50 characters"
    },
    postalCode: {
        required: true,
        pattern: /^[\d\-\s]{3,}$/,
        message: "Postal code is invalid"
    },
    paymentMethod: {
        required: true,
        message: "Please select a payment method"
    }
};

// ===== VALIDATION FUNCTIONS =====
export function validateField(fieldName, value) {
    const rules = VALIDATION_RULES[fieldName];
    if (!rules) return { valid: true };

    if (rules.required && (value === undefined || value === null || String(value).trim() === '')) {
        return { valid: false, message: `${fieldName} is required` };
    }

    if (rules.minLength && String(value).length < rules.minLength) {
        return { valid: false, message: rules.message };
    }

    if (rules.maxLength && String(value).length > rules.maxLength) {
        return { valid: false, message: rules.message };
    }

    if (rules.pattern && !rules.pattern.test(String(value))) {
        return { valid: false, message: rules.message };
    }

    return { valid: true };
}

export function validateAllFields(formData) {
    const errors = {};
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'postalCode', 'paymentMethod'];
    
    // First, ensure all required fields are present and not empty
    requiredFields.forEach(fieldName => {
        const value = formData[fieldName];
        if (!value || String(value).trim() === '') {
            errors[fieldName] = `${fieldName} is required and cannot be empty`;
        }
    });
    
    // Only validate field rules if the field has a value
    Object.keys(VALIDATION_RULES).forEach(fieldName => {
        if (formData[fieldName]) { // Only validate if field exists and has value
            const value = formData[fieldName];
            const validation = validateField(fieldName, value);
            
            if (!validation.valid) {
                errors[fieldName] = validation.message;
            }
        }
    });

    // Build comprehensive error message
    let isValid = Object.keys(errors).length === 0;
    let comprehensiveMessage = null;
    
    if (!isValid) {
        const missingFields = requiredFields.filter(field => errors[field]);
        if (missingFields.length > 0) {
            const fieldLabels = {
                firstName: 'First Name',
                lastName: 'Last Name',
                email: 'Email Address',
                phone: 'Phone Number',
                address: 'Street Address',
                city: 'City',
                postalCode: 'Postal Code'
            };
            const labels = missingFields.map(f => fieldLabels[f] || f).join(', ');
            comprehensiveMessage = `❌ Order cannot be processed! Please complete all required fields: ${labels}`;
        }
    }

    return { 
        isValid, 
        errors,
        comprehensiveMessage 
    };
}

// ===== DISPLAY FUNCTIONS =====
export function displayFieldError(fieldName, message) {
    const input = document.querySelector(`[name="${fieldName}"]`);
    if (!input) return;

    const errorDiv = input.closest('.form-group')?.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.textContent = message;
        input.classList.add('error');
    }
}

export function clearFieldError(fieldName) {
    const input = document.querySelector(`[name="${fieldName}"]`);
    if (!input) return;

    const errorDiv = input.closest('.form-group')?.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.textContent = '';
        input.classList.remove('error');
    }
}

export function showToast(message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? '✓' : '✕';
    toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-message">${message}</div>
    `;

    container.appendChild(toast);

    // Force reflow for animation
    toast.offsetHeight;

    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
            if (container.children.length === 0) {
                container.remove();
            }
        }, 500);
    }, 4000);
}

// ===== ORDER SUCCESS MODAL =====
export function showOrderSuccessModal(orderCode, orderId) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease-out;
    `;

    modal.innerHTML = `
        <div style="
            background: white;
            border-radius: 20px;
            padding: 60px 40px;
            text-align: center;
            max-width: 500px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        ">
            <div style="
                font-size: 80px;
                margin-bottom: 20px;
                animation: scaleInBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
            ">✅</div>
            
            <h1 style="
                font-size: 32px;
                font-weight: 900;
                margin: 0 0 10px 0;
                color: var(--dark);
            ">Order Confirmed!</h1>
            
            <p style="
                font-size: 16px;
                color: var(--muted);
                margin-bottom: 30px;
            ">Thank you for your purchase</p>
            
            <div style="
                background: linear-gradient(135deg, #05a391 0%, #048c7f 100%);
                color: white;
                border-radius: 12px;
                padding: 24px;
                margin-bottom: 20px;
                text-align: left;
            ">
                <p style="margin: 0 0 15px 0; font-size: 14px; opacity: 0.9;">Order Code</p>
                <p style="
                    margin: 0;
                    font-size: 24px;
                    font-weight: 900;
                    font-family: 'Courier New', monospace;
                    letter-spacing: 2px;
                ">${orderCode}</p>
            </div>
            
            <p style="
                font-size: 13px;
                color: var(--muted);
                margin: 0;
                line-height: 1.8;
            ">
                Your order has been placed successfully.<br>
                You'll be redirected to the confirmation page...
            </p>
        </div>

        <style>
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideUp {
                from { transform: translateY(50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            @keyframes scaleInBounce {
                0% { transform: scale(0) rotate(0deg); opacity: 0; }
                50% { transform: scale(1.1); }
                100% { transform: scale(1) rotate(0deg); opacity: 1; }
            }
        </style>
    `;

    document.body.appendChild(modal);
}

// ===== CART & CALCULATION FUNCTIONS =====
export function getCartItems() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

export function validateCartItems() {
    const items = getCartItems();
    
    if (!items || items.length === 0) {
        showToast('Your cart is empty. Please add items first.', 'error');
        return false;
    }

    // Validate each item has required fields and valid quantities
    for (const item of items) {
        if (!item.id || !item.name || !item.price || !item.quantity) {
            showToast('Invalid item in cart. Please refresh and try again.', 'error');
            return false;
        }

        if (item.quantity < 1 || !Number.isInteger(item.quantity)) {
            showToast(`Invalid quantity for ${item.name}. Quantity must be a whole number greater than 0.`, 'error');
            return false;
        }

        if (item.price < 0) {
            showToast(`Invalid price for ${item.name}.`, 'error');
            return false;
        }
    }

    return true;
}

export function calculateTotals() {
    const items = getCartItems();
    let subtotal = 0;

    items.forEach(item => {
        subtotal += item.price * item.quantity;
    });

    const tax = Math.round(subtotal * TAX_RATE);
    const itemsTotal = subtotal + tax;
    const total = itemsTotal + SHIPPING_FEE;

    return {
        subtotal,
        tax,
        itemsTotal,
        shippingFee: SHIPPING_FEE,
        total,
        items
    };
}

// ===== ORDER CREATION FUNCTION =====
export async function createOrder(formData, cart, paymentDetails) {
    try {
        const totals = calculateTotals();
        
        // Try to get user from session, fallback to localStorage
        let currentUser = null;
        
        try {
            const sessionRes = await fetch('/api/session', { credentials: 'include' });
            const sessionData = await sessionRes.json();
            if (sessionData.ok && sessionData.user) {
                currentUser = sessionData.user;
            }
        } catch (err) {
            console.warn('Session fetch failed:', err);
        }
        
        // Fallback to localStorage
        if (!currentUser) {
            const stored = localStorage.getItem('currentUser');
            if (stored) {
                try {
                    currentUser = JSON.parse(stored);
                } catch (e) {
                    console.warn('Failed to parse currentUser from localStorage');
                }
            }
        }
        
        if (!currentUser || !currentUser.email) {
            showToast('Please log in to place an order.', 'error');
            return false;
        }

        // Prepare order data
        const orderData = {
            // Shipping Information
            shippingInfo: {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                city: formData.city,
                postalCode: formData.postalCode,
                country: formData.country || 'Egypt',
                notes: formData.notes || ''
            },

            // Items
            items: cart.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image,
                category: item.category,
                subtotal: item.price * item.quantity
            })),

            // Billing
            billing: {
                subtotal: totals.subtotal,
                tax: totals.tax,
                itemsTotal: totals.itemsTotal,
                shippingFee: totals.shippingFee,
                total: totals.total
            },

            // Payment
            paymentMethod: formData.paymentMethod,
            paymentStatus: 'pending',
            paymentDetails: paymentDetails
        };

        // Save user profile data
        try {
            await fetch('/api/user/update-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    first: formData.firstName,
                    last: formData.lastName,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city,
                    postalCode: formData.postalCode
                })
            });
        } catch (err) {
            console.warn('Profile update warning:', err);
            // Continue even if profile update fails
        }

        // Create order via API
        const res = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(orderData)
        });

        const result = await res.json();
        
        if (!res.ok) {
            showToast(result.error || 'Failed to create order', 'error');
            return false;
        }

        // Clear cart
        localStorage.removeItem('cart');
        
        // Save user data to profile if authenticated
        try {
            await fetch('/api/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    first: orderData.shippingInfo.firstName,
                    last: orderData.shippingInfo.lastName,
                    phone: orderData.shippingInfo.phone,
                    address: orderData.shippingInfo.address,
                    city: orderData.shippingInfo.city,
                    postalCode: orderData.shippingInfo.postalCode
                })
            });
        } catch (profileErr) {
            console.warn('Failed to save profile data:', profileErr);
        }

        // Show success message with correct styling
        showOrderSuccessModal(result.orderCode, result.orderId);
        
        // Redirect to order confirmation with orderId and orderCode
        setTimeout(() => {
            window.location.href = `/order-confirmation.html?orderId=${result.orderId}&orderCode=${result.orderCode}`;
        }, 2000);
        
        return true;
    } catch (error) {
        console.error('Order creation error:', error);
        showToast('Failed to create order. Please try again.', 'error');
        return false;
    }
}

// ===== MAIN CHECKOUT HANDLER =====
export async function handleCheckoutSubmit(event) {
    if (event && event.preventDefault) {
        event.preventDefault();
    }

    const placeOrderBtn = document.getElementById('placeOrderBtn');
    if (placeOrderBtn) {
        placeOrderBtn.disabled = true;
        placeOrderBtn.textContent = 'Processing...';
    }

    try {
        // 1. First, check if user is authenticated
        const sessionRes = await fetch('/api/session', { credentials: 'include' });
        const sessionData = await sessionRes.json();
        
        if (!sessionData.ok || !sessionData.user) {
            showToast('Please log in to place an order.', 'error');
            if (placeOrderBtn) {
                placeOrderBtn.disabled = false;
                placeOrderBtn.textContent = 'Confirm Order Now';
            }
            return;
        }

        // 2. Validate cart
        if (!validateCartItems()) {
            if (placeOrderBtn) {
                placeOrderBtn.disabled = false;
                placeOrderBtn.textContent = 'Confirm Order Now';
            }
            return;
        }

        // 2. Get form data - with null check
        const firstNameInput = document.querySelector('[name="firstName"]');
        const lastNameInput = document.querySelector('[name="lastName"]');
        const emailInput = document.querySelector('[name="email"]');
        const phoneInput = document.querySelector('[name="phone"]');
        const addressInput = document.querySelector('[name="address"]');
        const cityInput = document.querySelector('[name="city"]');
        const postalCodeInput = document.querySelector('[name="postalCode"]');
        const countryInput = document.querySelector('[name="country"]');
        const notesInput = document.querySelector('[name="notes"]');
        const paymentMethodInput = document.querySelector('[name="paymentMethod"]:checked');

        // Safety check - ensure all inputs exist
        if (!firstNameInput || !lastNameInput || !emailInput || !phoneInput || !addressInput || !cityInput || !postalCodeInput) {
            showToast('Form fields are missing. Please refresh and try again.', 'error');
            if (placeOrderBtn) {
                placeOrderBtn.disabled = false;
                placeOrderBtn.textContent = 'Confirm Order Now';
            }
            return;
        }

        const formData = {
            firstName: firstNameInput.value.trim(),
            lastName: lastNameInput.value.trim(),
            email: emailInput.value.trim(),
            phone: phoneInput.value.trim(),
            address: addressInput.value.trim(),
            city: cityInput.value.trim(),
            postalCode: postalCodeInput.value.trim(),
            country: countryInput ? countryInput.value : 'Egypt',
            notes: notesInput ? notesInput.value.trim() : '',
            paymentMethod: paymentMethodInput?.value
        };

        // DEBUG: Log form data for debugging
        console.log('🔍 DEBUG - Form Data:', formData);
        console.log('🔍 DEBUG - Payment Method:', formData.paymentMethod);

        // 3. STRICT validation - ALL fields must be filled and valid
        const validation = validateAllFields(formData);
        if (!validation.isValid) {
            // Show comprehensive error message first
            if (validation.comprehensiveMessage) {
                showToast(validation.comprehensiveMessage, 'error');
            }
            
            // Display individual field errors
            Object.keys(validation.errors).forEach(fieldName => {
                displayFieldError(fieldName, validation.errors[fieldName]);
            });
            
            // Add red border to all empty fields
            const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'postalCode'];
            requiredFields.forEach(fieldName => {
                const input = document.querySelector(`[name="${fieldName}"]`);
                if (input && (!input.value || input.value.trim() === '')) {
                    input.style.borderColor = '#dc2626';
                    input.style.backgroundColor = '#fef2f2';
                }
            });
            
            if (placeOrderBtn) {
                placeOrderBtn.disabled = false;
                placeOrderBtn.textContent = 'Confirm Order Now';
            }
            return;
        }

        // 4. Additional validation - ensure no field is empty or just spaces
        const isEmptyOrSpaces = (str) => !str || str.trim() === '';
        const emptyFields = [];
        
        if (isEmptyOrSpaces(formData.firstName)) emptyFields.push('First Name');
        if (isEmptyOrSpaces(formData.lastName)) emptyFields.push('Last Name');
        if (isEmptyOrSpaces(formData.email)) emptyFields.push('Email');
        if (isEmptyOrSpaces(formData.phone)) emptyFields.push('Phone Number');
        if (isEmptyOrSpaces(formData.address)) emptyFields.push('Address');
        if (isEmptyOrSpaces(formData.city)) emptyFields.push('City');
        if (isEmptyOrSpaces(formData.postalCode)) emptyFields.push('Postal Code');
        
        if (emptyFields.length > 0) {
            showToast(`❌ Please fill in all required fields: ${emptyFields.join(', ')}`, 'error');
            if (placeOrderBtn) {
                placeOrderBtn.disabled = false;
                placeOrderBtn.textContent = 'Confirm Order Now';
            }
            return;
        }

        // 5. CRITICAL: Check payment method - ONLINE PAYMENT IS DISABLED
        if (!formData.paymentMethod) {
            showToast('Please select a payment method.', 'error');
            if (placeOrderBtn) {
                placeOrderBtn.disabled = false;
                placeOrderBtn.textContent = 'Confirm Order Now';
            }
            return;
        }

        const paymentDetails = {};
        if (formData.paymentMethod === 'online') {
            showToast('Online payment is currently unavailable. Please use Cash on Delivery.', 'error');
            if (placeOrderBtn) {
                placeOrderBtn.disabled = false;
                placeOrderBtn.textContent = 'Confirm Order Now';
            }
            return; // CRITICAL: Stop order creation for online payment
        } else if (formData.paymentMethod === 'cod') {
            paymentDetails.method = 'Cash on Delivery (COD)';
            paymentDetails.status = 'pending';
        } else {
            showToast('Invalid payment method selected.', 'error');
            if (placeOrderBtn) {
                placeOrderBtn.disabled = false;
                placeOrderBtn.textContent = 'Confirm Order Now';
            }
            return;
        }

        // 6. Create order - ONLY if payment is COD
        const cart = getCartItems();
        const success = await createOrder(formData, cart, paymentDetails);

        if (!success && placeOrderBtn) {
            placeOrderBtn.disabled = false;
            placeOrderBtn.textContent = 'Confirm Order Now';
        }
    } catch (error) {
        console.error('Checkout error:', error);
        showToast('An unexpected error occurred. Please try again.', 'error');
        if (placeOrderBtn) {
            placeOrderBtn.disabled = false;
            placeOrderBtn.textContent = 'Confirm Order Now';
        }
    }
}

// ===== INITIALIZATION =====
export function setupPaymentMethodListeners() {
    document.querySelectorAll('.method-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.method-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            card.querySelector('input').checked = true;

            const method = card.dataset.method;
            const cardForm = document.getElementById('cardDetailsForm');
            const codNotice = document.getElementById('codNotice');

            if (method === 'online') {
                if (cardForm) cardForm.style.display = 'grid';
                if (codNotice) codNotice.style.display = 'none';
            } else {
                if (cardForm) cardForm.style.display = 'none';
                if (codNotice) codNotice.style.display = 'block';
            }

            clearFieldError('paymentMethod');
        });
    });

    // Real-time field validation
    document.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('blur', () => {
            clearFieldError(field.name);
        });

        field.addEventListener('input', () => {
            clearFieldError(field.name);
        });
    });
}

export function renderCheckoutSummary() {
    const cart = getCartItems();
    const itemsList = document.getElementById('checkoutItemsList');
    const subtotalEl = document.getElementById('checkoutSubtotal');
    const taxEl = document.getElementById('checkoutTax');
    const itemsTotalEl = document.getElementById('checkoutItemsTotal');
    const totalEl = document.getElementById('checkoutTotal');

    if (!itemsList) return;

    if (cart.length === 0) {
        itemsList.innerHTML = '<p style="text-align: center; color: var(--muted); padding: 20px 0;">Your cart is empty. Please add items first.</p>';
        return;
    }

    itemsList.innerHTML = '';
    const totals = calculateTotals();

    cart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'order-item';
        itemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.name}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2260%22%3E%3Crect fill=%22%23f0f0f0%22 width=%2260%22 height=%2260%22/%3E%3Ctext x=%2230%22 y=%2230%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22 fill=%22%23999%22 font-size=%2212%22%3ENo Image%3C/text%3E%3C/svg%3E'">
            <div class="order-item-info" style="flex: 1;">
                <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 700;">${item.name}</h4>
                <p style="margin: 0; font-size: 12px; color: var(--muted);">Qty: ${item.quantity} × ${item.price.toLocaleString('en-US')} EGP</p>
                <p style="margin: 4px 0 0 0; font-size: 12px; font-weight: 700; color: var(--teal);">${(item.price * item.quantity).toLocaleString('en-US')} EGP</p>
            </div>
        `;
        itemsList.appendChild(itemDiv);
    });

    if (subtotalEl) subtotalEl.textContent = totals.subtotal.toLocaleString('en-US') + ' EGP';
    if (taxEl) taxEl.textContent = totals.tax.toLocaleString('en-US') + ' EGP';
    if (itemsTotalEl) itemsTotalEl.textContent = totals.itemsTotal.toLocaleString('en-US') + ' EGP';
    if (totalEl) totalEl.textContent = totals.total.toLocaleString('en-US') + ' EGP';
}

export async function prefillUserData() {
    try {
        const response = await fetch('/api/session');
        const data = await response.json();

        if (data.ok && data.user) {
            const user = data.user;
            const fields = {
                firstName: user.first || user.firstName,
                lastName: user.last || user.lastName,
                email: user.email,
                phone: user.phone,
                address: user.address,
                city: user.city,
                postalCode: user.postalCode
            };

            Object.keys(fields).forEach(name => {
                const inputs = document.querySelectorAll(`[name="${name}"]`);
                if (fields[name]) {
                    inputs.forEach(input => {
                        input.value = fields[name];
                        // Trigger input event to clear errors if any
                        input.dispatchEvent(new Event('input', { bubbles: true }));
                    });
                }
            });
        }
    } catch (err) {
        console.warn('Could not prefill user data:', err);
    }
}

// Export initialization
export function initializeCheckout() {
    document.addEventListener('DOMContentLoaded', () => {
        // Check authentication first
        onAuthStateChanged(auth, (user) => {
            if (!user) {
                showToast('Please log in to proceed with checkout.', 'error');
                setTimeout(() => {
                    window.location.href = '/signin.html?redirect=checkout.html';
                }, 2000);
                return;
            }

            renderCheckoutSummary();
            setupPaymentMethodListeners();
            prefillUserData();

            const placeOrderBtn = document.getElementById('placeOrderBtn');
            if (placeOrderBtn) {
                placeOrderBtn.addEventListener('click', handleCheckoutSubmit);
            }
        });
    });
}
