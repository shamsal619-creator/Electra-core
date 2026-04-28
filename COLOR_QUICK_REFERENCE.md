# 🎨 دليل الألوان السريع - Quick Reference Guide

## الألوان الأساسية (Primary Colors)

### اللون الأساسي - Teal
- **Teal Primary**: `var(--teal)` → `#05a391`
- **Teal Dark** (Hover): `var(--teal-dark)` → `#048c7f`
- **Teal Light** (Active): `var(--teal-light)` → `#e6fffb`

### ألوان النصوص (Text Colors)
- **Dark Text**: `var(--dark)` → `#333`
- **Secondary Text**: `var(--text-secondary)` → `#475569`
- **Muted Text**: `var(--text-muted)` → `#64748b`
- **Form Labels**: `var(--form-label-color)` → `#555`
- **Form Text**: `var(--form-text-color)` → `#94a3b8`
- **Black**: `var(--text-black)` → `#000`

### ألوان الخلفيات (Background Colors)
- **Light BG**: `var(--light)` → `#f5f5f5`
- **White**: `var(--white)` → `#fff`
- **Field BG**: `var(--field-bg)` → `#fafafa`
- **Form Input BG**: `var(--form-input-bg)` → `#f8fafc`
- **Hover BG**: `var(--bg-hover)` → `#f9f9f9`
- **Light Gray BG**: `var(--bg-light-gray)` → `#e0e0e0`

### ألوان الحدود (Border Colors)
- **Primary Border**: `var(--border)` → `#e6e6e6`
- **Form Input Border**: `var(--form-input-border)` → `#e2e8f0`

### ألوان الحالات الخاصة (Status Colors)
- **Error**: `var(--error-color)` → `#b91c1c` 🔴
- **Success**: `var(--success-color)` → `#0f766e` ✅
- **Warning**: `var(--warning-color)` → `#f59e0b` ⚠️
- **Info**: `var(--info-color)` → `#253858` ℹ️

---

## ظلال (Shadows)

### ظلال سوداء (Black Shadows)
```css
box-shadow: 0 10px 40px var(--shadow-md);  /* 8% opacity */
box-shadow: 0 10px 30px var(--shadow-lg);  /* 10% opacity */
box-shadow: 0 2px 8px var(--shadow-sm);    /* 4% opacity */
box-shadow: 0 2px 12px var(--shadow-xs);   /* 3% opacity */
box-shadow: 0 10px 24px var(--shadow-xl);  /* 15% opacity */
```

### ظلال ملونة Teal (Teal Shadows)
```css
box-shadow: 0 0 0 4px var(--teal-shadow-light);      /* 10% */
box-shadow: 0 4px 15px var(--teal-shadow-dark);     /* 20% */
box-shadow: 0 4px 12px var(--teal-shadow-darker);   /* 30% */
box-shadow: 0 4px 12px var(--teal-shadow-md);       /* 15% */
```

### طبقات بيضاء (White Overlays)
```css
background: var(--white-overlay-light);   /* 15% */
background: var(--white-overlay-md);      /* 30% */
background: var(--white-overlay-dark);    /* 40% */
background: var(--white-overlay-semi);    /* 95% */
```

---

## أمثلة عملية (Practical Examples)

### زر أساسي (Primary Button)
```html
<button class="btn">Click me</button>

<style>
  .btn {
    background: var(--teal);
    color: var(--white);
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .btn:hover {
    background: var(--teal-dark);
    box-shadow: 0 4px 12px var(--teal-shadow-dark);
    transform: translateY(-1px);
  }
</style>
```

### حقل إدخال (Input Field)
```html
<input type="text" class="form-input" placeholder="Enter text">

<style>
  .form-input {
    padding: 12px 16px;
    border: 1px solid var(--form-input-border);
    border-radius: 8px;
    background: var(--form-input-bg);
    font-size: 14px;
    transition: all 0.3s ease;
  }
  
  .form-input:focus {
    outline: none;
    border-color: var(--teal);
    box-shadow: 0 0 0 4px var(--teal-shadow-light);
    background: var(--white);
  }
</style>
```

### بطاقة (Card)
```html
<div class="card">
  <h3>Card Title</h3>
  <p>Card content here</p>
</div>

<style>
  .card {
    background: var(--white);
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 12px var(--shadow-sm);
    border: 1px solid var(--border);
  }
  
  .card:hover {
    box-shadow: 0 8px 24px var(--shadow-md);
  }
</style>
```

### رسالة خطأ (Error Message)
```html
<div class="alert alert-error">
  An error occurred. Please try again.
</div>

<style>
  .alert {
    padding: 12px 16px;
    border-radius: 8px;
    font-weight: 500;
  }
  
  .alert-error {
    background: rgba(185, 28, 28, 0.1);
    color: var(--error-color);
    border: 1px solid var(--error-color);
  }
  
  .alert-error::before {
    content: "❌ ";
  }
</style>
```

### رسالة نجاح (Success Message)
```html
<div class="alert alert-success">
  Operation completed successfully!
</div>

<style>
  .alert-success {
    background: rgba(15, 118, 110, 0.1);
    color: var(--success-color);
    border: 1px solid var(--success-color);
  }
  
  .alert-success::before {
    content: "✅ ";
  }
</style>
```

---

## القائمة المرجعية (Checklist)

### عند إنشاء صفحة جديدة:
- [ ] استخدام `var(--color-name)` بدلاً من الألوان المحددة مباشرة
- [ ] استخدام متغيرات الظلال للـ box-shadow
- [ ] اختيار الألوان من القائمة أعلاه
- [ ] اختبار الصفحة في الأضاءة والظلام (إن أمكن)
- [ ] التأكد من توافق الألوان مع معايير WCAG

### عند تحديث لون:
1. ابحث عن المتغير في `:root`
2. غيّر القيمة في مكان واحد فقط
3. جميع الصفحات ستحدّث تلقائياً ✅

---

## 📋 جدول المتغيرات الكاملة

| المتغير | القيمة | الاستخدام |
|--------|--------|----------|
| `--teal` | #05a391 | اللون الأساسي |
| `--teal-dark` | #048c7f | حالة Hover |
| `--teal-light` | #e6fffb | خلفية نشطة |
| `--dark` | #333 | نص رئيسي |
| `--white` | #fff | خلفية |
| `--muted` | #9aa6a6 | نصوص مخفوضة |
| `--border` | #e6e6e6 | حدود |
| `--light` | #f5f5f5 | خلفية فاتحة |
| `--field-bg` | #fafafa | خلفية الحقول |
| `--form-input-bg` | #f8fafc | خلفية الإدخال |
| `--form-input-border` | #e2e8f0 | حد الإدخال |
| `--form-label-color` | #555 | تسميات النماذج |
| `--form-text-color` | #94a3b8 | نصوص النماذج |
| `--text-secondary` | #475569 | نص ثانوي |
| `--text-muted` | #64748b | نص مخفوض |
| `--text-black` | #000 | أسود خالص |
| `--bg-hover` | #f9f9f9 | خلفية Hover |
| `--bg-light-gray` | #e0e0e0 | رمادي فاتح |
| `--error-color` | #b91c1c | أحمر للأخطاء |
| `--success-color` | #0f766e | أخضر للنجاح |
| `--warning-color` | #f59e0b | برتقالي للتحذيرات |
| `--info-color` | #253858 | أزرق للمعلومات |
| `--shadow-xs` | rgba(0,0,0,0.03) | ظل صغير جداً |
| `--shadow-sm` | rgba(0,0,0,0.04) | ظل صغير |
| `--shadow-md` | rgba(0,0,0,0.08) | ظل متوسط |
| `--shadow-lg` | rgba(0,0,0,0.1) | ظل كبير |
| `--shadow-xl` | rgba(0,0,0,0.15) | ظل كبير جداً |
| `--teal-shadow-light` | rgba(5,163,145,0.1) | ظل Teal فاتح |
| `--teal-shadow-md` | rgba(5,163,145,0.15) | ظل Teal متوسط |
| `--teal-shadow-dark` | rgba(5,163,145,0.2) | ظل Teal غامق |
| `--teal-shadow-darker` | rgba(5,163,145,0.3) | ظل Teal أكثر غموضاً |
| `--white-overlay-light` | rgba(255,255,255,0.15) | طبقة بيضاء فاتحة |
| `--white-overlay-md` | rgba(255,255,255,0.3) | طبقة بيضاء متوسطة |
| `--white-overlay-dark` | rgba(255,255,255,0.4) | طبقة بيضاء غامقة |
| `--white-overlay-semi` | rgba(255,255,255,0.95) | طبقة بيضاء شبه معتمة |

---

## نصائح المطورين 💡

1. **استخدم CSS Variables دائماً**: بدلاً من الألوان المحددة مباشرة
2. **اختبر في الأجهزة المختلفة**: خاصة الهواتف الذكية
3. **تحقق من التباين**: استخدم أدوات مثل WebAIM Contrast Checker
4. **اتبع نمط التسمية**: اسم متغير واضح = سهل الصيانة
5. **وثّق الألوان المخصصة**: إذا أنشأت ألواناً جديدة، أضفها إلى هذه القائمة

---

## الدعم والأسئلة

للأسئلة حول الألوان أو المتغيرات، راجع:
- `COLOR_ANALYSIS_REPORT.md` - تقرير تفصيلي شامل
- `CSS_VARIABLES_READY_TO_USE.css` - كود CSS جاهز للاستخدام
- ملفات HTML للصفحات المفردة - للأمثلة المحددة

---

**آخر تحديث:** 27 أبريل 2026
**الإصدار:** 1.0
**الحالة:** جاهز للاستخدام ✅
