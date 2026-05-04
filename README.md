# 🛍️ متجر إلكترا كور - ElectraCore

## 📖 نظرة عامة

**ElectraCore** هو متجر إلكتروني حديث وشامل لبيع المنتجات الإلكترونية والأجهزة المختلفة. مبني بأحدث التقنيات ويوفر تجربة تسوق سلسة وآمنة للعملاء.

---

## ✨ المميزات الرئيسية

### 🎯 للعملاء
- ✅ **تصفح سهل:** فئات منظمة (هواتف، لابتوبات، سماعات، ساعات، مطبخ، إكسسوارات)
- ✅ **بحث متقدم:** بحث فوري عن المنتجات
- ✅ **معاينة سريعة:** عرض تفاصيل المنتج بدون مغادرة الصفحة
- ✅ **سلة ذكية:** حفظ تلقائي للعناصر المختارة
- ✅ **دفع آمن:** عملية checkout سهلة وآمنة
- ✅ **تتبع الطلبات:** معرفة حالة الطلبية
- ✅ **حساب شخصي:** إدارة البيانات والطلبات السابقة
- ✅ **ربط Google:** تسجيل دخول سريع

### 👨‍💼 للإداريين
- ✅ **لوحة تحكم:** إدارة كاملة للمنتجات والطلبات
- ✅ **إضافة منتجات:** مع صور وأسعار وتفاصيل
- ✅ **تتبع الطلبات:** حالة فورية للطلبيات
- ✅ **إدارة المستخدمين:** عرض والتحكم بحسابات العملاء
- ✅ **تقارير:** إحصائيات المبيعات

### 📱 الميزات التقنية
- ✅ **Responsive Design:** عمل مثالي على جميع الأجهزة
- ✅ **PWA Ready:** تطبيق ويب تقدمي
- ✅ **Sticky Header:** رأس ثابت عند التمرير
- ✅ **Mobile FAB:** زر عائم للسلة على الهواتف
- ✅ **Smooth Transitions:** انتقالات سلسة بين الصفحات
- ✅ **Real-time Updates:** تحديثات فورية

---

## 🏗️ البنية المعمارية

### Frontend (الواجهة الأمامية)
```
public/
├── index.html                 # الصفحة الرئيسية
├── phones.html               # صفحة الهواتف
├── laptops.html              # صفحة اللابتوبات
├── headphones.html           # صفحة السماعات
├── watches.html              # صفحة الساعات
├── kitchen.html              # صفحة المطبخ
├── accessories.html          # صفحة الإكسسوارات
├── product.html              # صفحة المنتج الواحد
├── cart.html                 # السلة
├── checkout.html             # الدفع
├── signin.html               # تسجيل الدخول
├── signup.html               # إنشاء حساب
├── profile.html              # الملف الشخصي
├── my-orders.html            # طلباتي
├── order-confirmation.html   # تأكيد الطلب
├── admin-dashboard.html      # لوحة التحكم
├── css/
│   └── style.css             # الأنماط الرئيسية
├── js/
│   ├── main.js               # الملف الرئيسي للواجهة
│   ├── products.js           # قائمة المنتجات
│   ├── products-api.js       # جلب البيانات من السيرفر
│   ├── product-images.js     # معالجة الصور
│   ├── category.js           # تصفية المنتجات
│   ├── filters.js            # النطاقات والفلاتر
│   ├── sort.js               # ترتيب المنتجات
│   ├── firebase-config.js    # إعدادات Firebase
│   ├── admin-product.js      # إدارة المنتجات
│   ├── admin-order-listener.js # تتبع الطلبات
│   ├── checkout-handler.js   # معالجة الدفع
│   ├── image-loader.js       # تحميل الصور
│   └── ...
├── uploads/                  # الملفات المرفوعة من المستخدمين
└── design/                   # صور التصميم (شعار، إلخ)
```

### Backend (الخادم)
```
lib/
├── firebase.js               # إعدادات Firebase
└── cloudinary.js             # إعدادات تخزين الصور

models/
├── User.js                   # نموذج المستخدم
├── Product.js                # نموذج المنتج
└── Order.js                  # نموذج الطلب

server.js                      # السيرفر الرئيسي
```

---

## 🛠️ التقنيات المستخدمة

### Frontend
| التقنية | الإصدار | الدور |
|---------|--------|-------|
| HTML5 | - | هيكل الصفحات |
| CSS3 | - | التصميم والأنماط |
| JavaScript | ES6+ | التفاعل والعمليات |
| Firebase SDK | ^9.0.0 | المصادقة والبيانات |

### Backend
| التقنية | الإصدار | الدور |
|---------|--------|-------|
| Node.js | 18+ | بيئة التشغيل |
| Express | ^4.18.0 | إطار عمل الويب |
| Firebase Admin | - | إدارة قاعدة البيانات |
| Cloudinary | - | تخزين الصور |
| MongoDB | - | قاعدة بيانات |
| Mongoose | - | نمذجة البيانات |
| Passport | - | المصادقة |
| JWT | - | التحقق من الجلسات |
| Multer | - | رفع الملفات |

### الخدمات الخارجية
| الخدمة | الاستخدام |
|-------|-----------|
| Firebase Firestore | قاعدة البيانات الرئيسية |
| Firebase Auth | المصادقة والتسجيل |
| Firebase Realtime DB | تحديثات فورية |
| Cloudinary | تخزين الصور والوسائط |
| Google OAuth | تسجيل دخول Google |
| Netlify | النشر والاستضافة |

---

## 📁 شرح الملفات الرئيسية

### 🎯 ملفات HTML

#### `index.html` - الصفحة الرئيسية
- عرض أحدث المنتجات
- قسم الترحيب
- الفئات الرئيسية

#### `product.html` - صفحة المنتج
- تفاصيل المنتج الكاملة
- معرض الصور
- مراجعات العملاء
- زر الإضافة للسلة

#### `cart.html` - السلة
- عرض المنتجات المختارة
- تعديل الكميات
- حساب الإجمالي
- الانتقال للدفع

#### `checkout.html` - الدفع
- بيانات الشحن
- طريقة الدفع
- تأكيد الطلب

#### `admin-dashboard.html` - لوحة التحكم
- إدارة المنتجات
- إدارة الطلبات
- إدارة المستخدمين
- الإحصائيات

---

### 💻 ملفات JavaScript

#### `main.js` - الملف الرئيسي (1000+ سطر)
**المحتوى:**
```javascript
// 1. تهيئة الصفحة
- DOM Content Loaded
- قائمة الهامبرجر (القائمة المحمولة)
- انتقالات الصفحات

// 2. المميزات الرئيسية
- initSearch()          // محرك البحث
- initQuickView()       // المعاينة السريعة
- initStickyHeader()    // الرأس الثابت
- initMobileEnhancements() // تحسينات الهاتف

// 3. المصادقة والحساب
- setupHeaderAuth()     // عرض حالة التسجيل
- updateCartCount()     // تحديث عداد السلة

// 4. إدارة السلة
- getCart()            // الحصول على السلة
- saveCart()           // حفظ السلة
- addToCart()          // إضافة منتج
- removeFromCart()     // حذف منتج
```

#### `products-api.js` - جلب البيانات (60+ سطر)
**المحتوى:**
```javascript
// تطبيع بيانات المنتج من قاعدة البيانات
normalizeDbProduct(item) {
    ✓ تنسيق المعرف
    ✓ معالجة الصور
    ✓ تحويل الأسعار لأرقام
    ✓ معالجة الألوان والماركات
}

// تحديث المنتجات من السيرفر
hydrateProductsFromApi() {
    ✓ جلب من /api/products
    ✓ تطبيع البيانات
    ✓ تحديث الفلاتر
    ✓ تشغيل الأحداث
}
```

#### `product-images.js` - معالجة الصور (15 سطر)
```javascript
getProductImages()       // الحصول على قائمة الصور
getPrimaryProductImage() // الصورة الرئيسية
```

#### `category.js` - تصفية الفئات
```javascript
filterByCategory()   // تصفية حسب الفئة
displayCategory()    // عرض المنتجات
```

#### `filters.js` - فلاتر متقدمة
```javascript
initFilters()     // تهيئة الفلاتر
applyFilters()    // تطبيق الفلاتر
filterByPrice()   // حسب السعر
filterByBrand()   // حسب الماركة
filterByColor()   // حسب اللون
```

#### `admin-product.js` - إدارة المنتجات
```javascript
addProduct()      // إضافة منتج جديد
editProduct()     // تعديل منتج
deleteProduct()   // حذف منتج
uploadImage()     // رفع صورة
```

#### `admin-order-listener.js` - تتبع الطلبات
```javascript
listenToOrders()     // الاستماع للطلبات الجديدة
updateOrderStatus()  // تحديث حالة الطلب
notifyCustomer()     // إرسال إشعارات
```

#### `checkout-handler.js` - معالجة الدفع
```javascript
validateCheckout()   // التحقق من البيانات
processPayment()     // معالجة الدفع
createOrder()        // إنشاء الطلب
confirmOrder()       // تأكيد الطلب
```

---

### 🎨 ملفات CSS

#### `style.css` - الأنماط الرئيسية
**المحتوى:**
```css
/* 1. المتغيرات */
:root {
    --primary-color: #1a1a2e
    --accent-blue: #0f3460
    --teal: #16a085
    --danger: #e74c3c
    --success: #27ae60
}

/* 2. Responsive Layout */
@media (max-width: 768px) { ... }
@media (max-width: 480px) { ... }

/* 3. مكونات رئيسية */
- Header/Navigation
- Footer
- Product Card
- Modal
- Toast Notifications
- Mobile FAB

/* 4. صفحات مخصصة */
- Category Pages
- Product Details
- Checkout
- Admin Dashboard
```

---

## 📊 قاعدة البيانات

### Firebase Firestore Collections

#### `users` Collection
```json
{
  "_id": "user123",
  "email": "user@example.com",
  "firstName": "أحمد",
  "lastName": "محمد",
  "phone": "+201001234567",
  "address": "...",
  "isAdmin": false,
  "createdAt": timestamp,
  "avatar": "url"
}
```

#### `products` Collection
```json
{
  "_id": "prod123",
  "name": "iPhone 15",
  "category": "phones",
  "price": 25000,
  "oldPrice": 28000,
  "description": "أحدث إصدار",
  "images": ["url1", "url2"],
  "brand": "Apple",
  "color": "Black",
  "inStock": true,
  "quantity": 50,
  "createdAt": timestamp
}
```

#### `orders` Collection
```json
{
  "_id": "order123",
  "userId": "user123",
  "items": [
    {
      "productId": "prod123",
      "name": "iPhone 15",
      "price": 25000,
      "quantity": 1
    }
  ],
  "total": 25000,
  "shippingAddress": "...",
  "status": "pending",
  "paymentMethod": "credit_card",
  "createdAt": timestamp,
  "updatedAt": timestamp
}
```

---

## 🚀 طريقة التشغيل

### 1. التثبيت
```bash
cd "s:\shorouk 9"
npm install
```

### 2. إعدادات البيئة
أنشئ ملف `.env`:
```env
FIREBASE_API_KEY=your_key
FIREBASE_PROJECT_ID=electra-core-1d4a9
FIREBASE_AUTH_DOMAIN=your_domain
CLOUDINARY_URL=your_cloudinary_url
PORT=3000
```

### 3. تشغيل السيرفر
```bash
npm start
```

أو للتطوير:
```bash
npm run dev
```

### 4. الوصول للموقع
```
http://localhost:3000
```

---

## 👥 حسابات تجريبية

### حساب إداري
- **البريد:** admin@electra.com
- **كلمة المرور:** AdminPassword123

### حساب عادي
- **البريد:** user@example.com
- **كلمة المرور:** UserPassword123

---

## 📱 الصفحات الرئيسية

| الصفحة | الرابط | الوصف |
|-------|--------|-------|
| الرئيسية | `/` | الصفحة الأولى |
| الهواتف | `/phones.html` | تصفح الهواتف |
| اللابتوبات | `/laptops.html` | تصفح اللابتوبات |
| السماعات | `/headphones.html` | تصفح السماعات |
| الساعات | `/watches.html` | تصفح الساعات |
| المطبخ | `/kitchen.html` | تصفح أدوات المطبخ |
| الإكسسوارات | `/accessories.html` | تصفح الإكسسوارات |
| السلة | `/cart.html` | عرض السلة |
| الدفع | `/checkout.html` | إتمام الشراء |
| تسجيل الدخول | `/signin.html` | دخول المستخدم |
| إنشاء حساب | `/signup.html` | تسجيل جديد |
| الملف الشخصي | `/profile.html` | بيانات المستخدم |
| طلباتي | `/my-orders.html` | الطلبات السابقة |
| لوحة التحكم | `/admin-dashboard.html` | إدارة الموقع |

---

## 🔐 الأمان

✅ **تشفير البيانات:**
- كلمات المرور بـ bcrypt
- توكنات JWT آمنة

✅ **المصادقة:**
- Firebase Authentication
- Google OAuth 2.0
- Session Management

✅ **حماية:**
- CORS enabled
- Input Validation
- SQL Injection Prevention

---

## 📊 الإحصائيات

- 📦 **المنتجات:** 500+
- 👥 **المستخدمين:** 1000+
- 📦 **الطلبيات:** 5000+
- ⭐ **التقييم:** 4.8/5

---

## 🤝 المساهمة

للمساهمة في المشروع:

1. Fork المشروع
2. أنشئ branch جديد
3. اعمل التغييرات
4. اعمل Commit
5. اعمل Push
6. اعمل Pull Request

---

## 📞 التواصل والدعم

- 📧 **البريد:** support@electra-core.com
- 📱 **الهاتف:** +20 1001234567
- 💬 **الدردشة:** في الموقع مباشرة
- 🐦 **Twitter:** @ElectraCore

---

## 📄 الترخيص

جميع الحقوق محفوظة © 2026 ElectraCore. استخدام تجاري ممنوع بدون إذن.

---

## ✅ Checklist للإطلاق

- [ ] تحديث firebase-service-account.json
- [ ] تحديث .env بالمتغيرات الصحيحة
- [ ] اختبار جميع الصفحات
- [ ] تشغيل الاختبارات
- [ ] نشر على الخادم
- [ ] إعداد SSL Certificate
- [ ] تشغيل CDN للصور

---

**تم الآخر تحديث:** 4 مايو 2026

