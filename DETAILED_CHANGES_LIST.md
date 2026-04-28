# 📝 قائمة التعديلات التفصيلية (Detailed Changes List)

## نظرة عامة
هذا الملف يحتوي على قائمة دقيقة بجميع التعديلات المطلوبة في كل ملف HTML.

---

## 1️⃣ signin.html - تسجيل الدخول

### الملفات المتأثرة:
- `public/signin.html` - الملف الرئيسي

### الألوان المراد تحديثها:

#### في القسم الأيسر (Left Side):
```css
/* الحالة الحالية */
.left {
    background: var(--teal);  /* ✅ موجود بالفعل */
}

/* الحالة الحالية */
.left .cta:hover {
    background: rgba(255,255,255,0.15);  /* 🔴 يجب تحويلها */
}

/* يجب التغيير من */
background: rgba(255,255,255,0.15);
/* إلى */
background: var(--white-overlay-light);
```

#### في حقول الإدخال (Input Fields):
```css
/* الحالة الحالية */
input[type="text"],
input[type="email"],
input[type="password"] {
    border: 1px solid #e2e8f0;      /* 🔴 */
    background: #f8fafc;             /* 🔴 */
}

/* يجب التغيير من */
border: 1px solid #e2e8f0;
/* إلى */
border: 1px solid var(--form-input-border);

/* يجب التغيير من */
background: #f8fafc;
/* إلى */
background: var(--form-input-bg);
```

#### في حالة Focus:
```css
/* الحالة الحالية */
input:focus {
    box-shadow: 0 0 0 4px rgba(5, 163, 145, 0.1);  /* 🔴 */
}

/* يجب التغيير من */
box-shadow: 0 0 0 4px rgba(5, 163, 145, 0.1);
/* إلى */
box-shadow: 0 0 0 4px var(--teal-shadow-light);
```

#### في Toggle Password:
```css
/* الحالة الحالية */
.toggle-password {
    color: #94a3b8;  /* 🔴 */
}

/* يجب التغيير من */
color: #94a3b8;
/* إلى */
color: var(--form-text-color);
```

#### في الزر:
```css
/* الحالة الحالية */
.right .btn {
    background: var(--teal);  /* ✅ موجود */
}

.right .btn:hover {
    background: #048c7f;       /* 🔴 */
    box-shadow: 0 4px 12px rgba(5, 163, 145, 0.2);  /* 🔴 */
}

/* يجب التغيير من */
background: #048c7f;
/* إلى */
background: var(--teal-dark);

/* يجب التغيير من */
box-shadow: 0 4px 12px rgba(5, 163, 145, 0.2);
/* إلى */
box-shadow: 0 4px 12px var(--teal-shadow-dark);
```

#### في Google Button:
```css
/* الحالة الحالية */
.google-btn {
    border: 1px solid #e2e8f0;  /* 🔴 */
    color: #475569;             /* 🔴 */
}

.google-btn:hover {
    background: #f8fafc;        /* 🔴 */
    border-color: #cbd5e1;      /* 🔴 */
}

/* يجب التغيير من */
border: 1px solid #e2e8f0;
/* إلى */
border: 1px solid var(--form-input-border);

/* يجب التغيير من */
color: #475569;
/* إلى */
color: var(--text-secondary);

/* يجب التغيير من */
background: #f8fafc;
/* إلى */
background: var(--form-input-bg);

/* يجب التغيير من */
border-color: #cbd5e1;
/* إلى */
border-color: var(--form-input-border);  /* أقرب لون */
```

#### في الـ Divider:
```css
/* الحالة الحالية */
.divider-text {
    color: #94a3b8;  /* 🔴 */
}

.divider-text::before,
.divider-text::after {
    border-bottom: 1px solid #e2e8f0;  /* 🔴 */
}

/* يجب التغيير من */
color: #94a3b8;
/* إلى */
color: var(--form-text-color);

/* يجب التغيير من */
border-bottom: 1px solid #e2e8f0;
/* إلى */
border-bottom: 1px solid var(--form-input-border);
```

#### في Muted Text:
```css
/* الحالة الحالية */
.muted {
    color: #64748b;  /* 🔴 */
}

/* يجب التغيير من */
color: #64748b;
/* إلى */
color: var(--text-muted);
```

---

## 2️⃣ forgot-password.html - نسيان كلمة المرور

### الملفات المتأثرة:
- `public/forgot-password.html` - الملف الرئيسي

### الألوان المراد تحديثها:

#### الـ Card:
```css
/* الحالة الحالية */
.card {
    background: white;                 /* ✅ قريب جداً، يمكن استخدام var(--white) */
    box-shadow: 0 10px 40px rgba(0,0,0,0.08);  /* 🔴 */
}

/* يجب التغيير من */
box-shadow: 0 10px 40px rgba(0,0,0,0.08);
/* إلى */
box-shadow: 0 10px 40px var(--shadow-md);
```

#### الـ H2:
```css
/* الحالة الحالية */
h2 {
    color: var(--dark);  /* ✅ موجود */
}
```

#### Description:
```css
/* الحالة الحالية */
p.description {
    color: #64748b;  /* 🔴 */
}

/* يجب التغيير من */
color: #64748b;
/* إلى */
color: var(--text-muted);
```

#### الـ Input:
```css
/* الحالة الحالية */
input[type="email"] {
    border: 1px solid #e2e8f0;  /* 🔴 */
    background: #f8fafc;         /* 🔴 */
}

input:focus {
    border-color: var(--teal);  /* ✅ موجود */
    box-shadow: 0 0 0 4px rgba(5, 163, 145, 0.1);  /* 🔴 */
}

/* التغييرات */
border: 1px solid #e2e8f0;        → border: 1px solid var(--form-input-border);
background: #f8fafc;              → background: var(--form-input-bg);
box-shadow: 0 0 0 4px rgba(...)   → box-shadow: 0 0 0 4px var(--teal-shadow-light);
```

#### الـ Button:
```css
/* الحالة الحالية */
.btn {
    background: var(--teal);  /* ✅ موجود */
}

.btn:hover {
    background: #048c7f;       /* 🔴 */
    box-shadow: 0 4px 12px rgba(5, 163, 145, 0.2);  /* 🔴 */
}

/* التغييرات */
background: #048c7f;                               → background: var(--teal-dark);
box-shadow: 0 4px 12px rgba(5, 163, 145, 0.2);    → box-shadow: 0 4px 12px var(--teal-shadow-dark);
```

#### الـ Messages:
```css
/* الحالة الحالية */
.message {
    color: #253858;  /* 🔴 */
}

.message.error {
    color: #b91c1c;  /* 🔴 */
}

.message.success {
    color: #0f766e;  /* 🔴 */
}

/* التغييرات */
color: #253858;   → color: var(--info-color);
color: #b91c1c;   → color: var(--error-color);
color: #0f766e;   → color: var(--success-color);
```

#### الـ Muted:
```css
/* الحالة الحالية */
.muted {
    color: #64748b;  /* 🔴 */
}

/* التغيير */
color: #64748b;  → color: var(--text-muted);
```

---

## 3️⃣ reset-password.html - إعادة تعيين كلمة المرور

### الملفات المتأثرة:
- `public/reset-password.html` - الملف الرئيسي

### الملاحظة:
**نفس تماماً مثل forgot-password.html** - اتبع نفس التعديلات أعلاه ✅

---

## 4️⃣ checkout.html - صفحة الدفع

### الملفات المتأثرة:
- `public/checkout.html` - الملف الرئيسي

### الألوان المراد تحديثها:

#### الـ Section Header:
```css
/* الحالة الحالية */
.section-header {
    border-bottom: 2px solid var(--teal);  /* ✅ موجود */
}
```

#### الـ Card:
```css
/* الحالة الحالية */
.checkout-card {
    background: var(--white);  /* ✅ موجود */
    box-shadow: 0 4px 20px rgba(0,0,0,0.04);  /* 🔴 */
}

/* التغيير */
box-shadow: 0 4px 20px rgba(0,0,0,0.04);  → box-shadow: 0 4px 20px var(--shadow-sm);
```

#### الـ Inputs:
```css
/* الحالة الحالية */
input, select {
    border: 1px solid var(--border);  /* ✅ موجود */
}

input:focus, select:focus {
    border-color: var(--teal);  /* ✅ موجود */
    box-shadow: 0 0 0 3px rgba(5, 163, 145, 0.1);  /* 🔴 */
}

/* التغيير */
box-shadow: 0 0 0 3px rgba(5, 163, 145, 0.1);  → box-shadow: 0 0 0 3px var(--teal-shadow-light);
```

#### Payment Methods:
```css
/* الحالة الحالية */
.method-card.active {
    border-color: var(--teal);  /* ✅ موجود */
    background: #e6fffb;        /* 🔴 */
    color: var(--teal);         /* ✅ موجود */
}

/* التغيير */
background: #e6fffb;  → background: var(--teal-light);
```

#### Order Item Image:
```css
/* الحالة الحالية */
.order-item img {
    background: #f9f9f9;  /* 🔴 */
}

/* التغيير */
background: #f9f9f9;  → background: var(--bg-hover);
```

#### Place Order Button:
```css
/* الحالة الحالية */
.place-order-btn {
    background: var(--teal);  /* ✅ موجود */
    box-shadow: 0 5px 15px rgba(5, 163, 145, 0.3);  /* 🔴 */
}

/* التغيير */
box-shadow: 0 5px 15px rgba(5, 163, 145, 0.3);  → box-shadow: 0 5px 15px var(--teal-shadow-darker);
```

---

## 5️⃣ profile.html - الملف الشخصي

### الملفات المتأثرة:
- `public/profile.html` - الملف الرئيسي

### الألوان المراد تحديثها:

#### Email Avatar:
```css
/* الحالة الحالية */
.email-avatar {
    background: #000;  /* 🔴 */
    color: var(--white);  /* ✅ موجود */
}

/* التغيير */
background: #000;  → background: var(--text-black);
```

#### Add Email Button:
```css
/* الحالة الحالية */
.add-email-btn {
    background: #e0e0e0;  /* 🔴 */
    color: var(--dark);   /* ✅ موجود */
}

/* التغيير */
background: #e0e0e0;  → background: var(--bg-light-gray);
```

#### Email Card Shadow:
```css
/* الحالة الحالية */
.email-card {
    box-shadow: 0 2px 12px rgba(0,0,0,0.03);  /* 🔴 */
}

/* التغيير */
box-shadow: 0 2px 12px rgba(0,0,0,0.03);  → box-shadow: 0 2px 12px var(--shadow-xs);
```

---

## 6️⃣ index.html - الصفحة الرئيسية

### الملفات المتأثرة:
- `public/index.html` - الملف الرئيسي

### الملاحظة:
**✅ لا توجد تعديلات مطلوبة** - هذه الصفحة لا تحتوي على inline styles!

---

## 📊 ملخص إحصائي

### إجمالي التعديلات المطلوبة:

| الملف | الألوان المراد تحديثها | التعديلات |
|------|----------------------|----------|
| signin.html | 15 لون | 18 تعديل |
| forgot-password.html | 12 لون | 15 تعديل |
| reset-password.html | 12 لون | 15 تعديل (نفس forgot-password) |
| checkout.html | 8 ألوان | 10 تعديلات |
| profile.html | 4 ألوان | 5 تعديلات |
| index.html | 0 | ✅ لا يحتاج |
| **المجموع** | **51+ لون** | **63+ تعديل** |

### الألوان المستخدمة بكثرة (الأولويات):
1. `var(--teal-dark)` - 4 صفحات
2. `var(--form-input-border)` - 4 صفحات
3. `var(--form-input-bg)` - 4 صفحات
4. `var(--teal-shadow-light)` - 4 صفحات
5. `var(--teal-shadow-dark)` - 3 صفحات

---

## ✅ خطوات التنفيذ الموصى بها

### المرحلة 1: إضافة المتغيرات (HIGH PRIORITY)
1. افتح `public/css/style.css`
2. ابحث عن `:root`
3. أضف المتغيرات الجديدة من `CSS_VARIABLES_READY_TO_USE.css`
4. احفظ الملف

### المرحلة 2: تحديث signin.html (HIGH PRIORITY)
1. استخدم Find & Replace لـ:
   - `#e2e8f0` → `var(--form-input-border)`
   - `#f8fafc` → `var(--form-input-bg)`
   - `#048c7f` → `var(--teal-dark)`
   - إلخ... (راجع القائمة أعلاه)
2. اختبر الصفحة
3. احفظ

### المرحلة 3: تحديث forgot-password.html و reset-password.html (MEDIUM PRIORITY)
1. كرر نفس الخطوات
2. اختبر كلا الصفحتين
3. احفظ

### المرحلة 4: تحديث checkout.html (MEDIUM PRIORITY)
1. كرر الخطوات
2. اختبر الصفحة
3. احفظ

### المرحلة 5: تحديث profile.html (LOW PRIORITY)
1. كرر الخطوات
2. اختبر الصفحة
3. احفظ

### المرحلة 6: الاختبار والتحقق (FINAL STEP)
1. ✅ اختبر جميع الصفحات الستة
2. ✅ تحقق من عدم وجود أخطاء في console
3. ✅ تحقق من الألوان بصرياً
4. ✅ اختبر على أجهزة مختلفة
5. ✅ احتفظ بنسخة من الملفات القديمة للمقارنة

---

## 🚀 ملاحظات مهمة

### تحذيرات:
⚠️ تأكد من استخدام Find & Replace بعناية
⚠️ اختبر دائماً بعد كل مجموعة تعديلات
⚠️ لا تغيّر المتغيرات الأصلية المستخدمة

### نصائح:
💡 استخدم Git لتتبع التغييرات
💡 احفظ نسخة احتياطية قبل البدء
💡 اختبر في متصفحات مختلفة
💡 اطلب من زميل مراجعة التغييرات

---

**آخر تحديث:** 27 أبريل 2026
**الحالة:** جاهز للتنفيذ ✅
