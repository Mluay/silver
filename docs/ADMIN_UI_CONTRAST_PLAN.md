# خطة وضوح ألوان لوحة التحكم — تقرير وعمل

## الهدف
جعل كل الكلمات والأزرار والمعلومات **واضحة جداً** في كل صفحة وزر في لوحة التحكم عبر تباين ثابت بين النص والخلفية.

---

## المعيار الموحد للتباين

| العنصر | اللون / الطابع | الفئة (Tailwind) | ملاحظات |
|--------|----------------|------------------|---------|
| **خلفية المحتوى** | رمادي فاتح | `bg-slate-50` | خلفية المنطقة الرئيسية |
| **خلفية البطاقات والجداول** | أبيض | `bg-white` | مع حدود واضحة |
| **العناوين الرئيسية (H1)** | أسود تقريباً | `text-slate-900 font-bold` | أوضح نص |
| **العناوين الفرعية (H2)** | رمادي غامق | `text-slate-900 font-semibold` | واضح على الأبيض |
| **تسميات الحقول (Label)** | رمادي غامق | `text-slate-800 font-medium` | يقرأ بسهولة |
| **النص الأساسي** | أسود تقريباً | `text-slate-900` | المحتوى والجدول |
| **النص الثانوي** | رمادي غامق | `text-slate-700` أو `text-slate-800` | توضيحات وتواريخ |
| **رؤوس الجداول** | خلفية + نص غامق | `bg-slate-100 text-slate-800 font-semibold` | مميز عن الصفوف |
| **حدود** | رمادي واضح | `border-slate-200` أو `border-slate-300` | فصل العناصر |
| **زر أساسي (حفظ / إضافة)** | أخضر + أبيض | `bg-accent text-white font-medium` | واضح ومميز |
| **زر ثانوي (تعديل / إلغاء)** | حدود + نص غامق | `border-slate-300 text-slate-800 bg-white` | لا يذوب في الخلفية |
| **زر خطر (حذف)** | حدود حمراء أو رمادي غامق | `border-red-300 text-red-700` أو outline | واضح أنه مختلف |
| **روابط** | أخضر أو غامق | `text-accent` أو `text-slate-800 hover:underline` | واضحة |
| **حالة نشط** | أخضر | `text-accent font-medium` | تمييز الحالة |
| **حالة غير نشط** | رمادي | `text-slate-600` | واضح وليس باهتاً جداً |
| **رسائل الخطأ** | أحمر على خلفية فاتحة | `text-red-700 bg-red-50` | واضحة |

---

## قائمة الصفحات والمكونات (التدقيق والتنفيذ)

### 1. التخطيط والشريط الجانبي
- [x] **app/admin/(dashboard)/layout.tsx** — خلفية المحتوى `bg-slate-50`، النص الافتراضي `text-slate-900`
- [x] **components/admin/AdminSidebar.tsx** — روابط بنص أبيض/واضح، الرابط النشط بلون accent، تسجيل الخروج والعودة للمتجر بنص واضح

### 2. الصفحات
- [x] **app/admin/(dashboard)/page.tsx** — عنوان، وصف، بطاقات إحصائيات (عناوين + أرقام بلون غامق)
- [x] **app/admin/login/page.tsx** — عنوان، تسميات، حقول، زر دخول، رسالة خطأ بتباين عالٍ
- [x] **app/admin/(dashboard)/orders/page.tsx** — عنوان، رؤوس جدول، خلايا (نص غامق)
- [x] **app/admin/(dashboard)/orders/[id]/page.tsx** — عنوان، معلومات العميل، الحالة، عناصر الطلب، المجموع (كل النص غامق وواضح)
- [x] **app/admin/(dashboard)/products/page.tsx** — عنوان، زر إضافة، جدول (رؤوس + خلايا)
- [x] **app/admin/(dashboard)/products/new/page.tsx** — عنوان الصفحة
- [x] **app/admin/(dashboard)/products/[id]/page.tsx** — عنوان التعديل
- [x] **app/admin/(dashboard)/categories/page.tsx** — عنوان، أزرار، جدول
- [x] **app/admin/(dashboard)/types/page.tsx** — عنوان، أزرار، جدول

### 3. المكونات المشتركة
- [x] **components/admin/ProductForm.tsx** — كل Label بنص غامق، أزرار واضحة، نصوص الـ checkbox
- [x] **components/admin/CategoryForm.tsx** — Label، زر حفظ/إضافة، زر حذف، زر تعديل، نص "نشط"
- [x] **components/admin/TypeForm.tsx** — نفس معايير CategoryForm
- [x] **components/admin/OrderStatusUpdate.tsx** — Select بنص غامق
- [x] **components/admin/ProductImageManager.tsx** — تسميات وأزرار بنص واضح

### 4. مكونات الواجهة (المستخدمة في الأدمن)
- [x] **components/ui/button.tsx** — variant default (accent + أبيض)، outline بحدود ونص غامق
- [x] **components/ui/label.tsx** — لون افتراضي للنص (slate-800) في سياق الأدمن عبر className
- [x] **components/ui/input.tsx** — نص غامق وplaceholder واضح (بدون اعتماد على dark فقط)
- [x] **components/ui/select.tsx** — Trigger و Content بنص غامق
- [x] **components/ui/dialog.tsx** — عنوان ومحتوى النافذة بنص غامق

---

## تنفيذ الخطة
يتم تطبيق الفئات أعلاه في الملفات المذكورة بحيث:
1. كل عنصر نقر (زر أو رابط) يكون نصه أو خلفيته واضحة.
2. كل معلومات معروضة (جدول، بطاقة، تفاصيل طلب) تكون بـ `text-slate-900` أو `text-slate-800`.
3. التسميات والحقول في النماذج لا تعتمد على لون افتراضي باهت.

---

## تم التنفيذ
- **مكونات الواجهة:** Dialog (نص غامق، حدود slate)، Select (نص غامق)، Button (outline/ghost بنص slate-800 وخلفية بيضاء).
- **نماذج الأدمن:** ProductForm، CategoryForm، TypeForm — كل التسميات `text-slate-800 font-medium`، نصوص الـ checkbox `text-slate-900`، أزرار الحفظ بلون accent، أزرار الحذف بحدود حمراء ونص أحمر.
- **الشريط الجانبي:** روابط غير نشطة `text-slate-200`، "العودة للمتجر" `text-slate-300` مع hover أبيض.
- **صفحات الطلبات والمنتجات:** روابط "عرض" و"تعديل" و"العودة للطلبات" بخط أوضح.
- **ProductImageManager:** تسمية "رفع صورة" وحدود الصور بـ slate.

---

## تاريخ التحديث
- إنشاء الخطة والتقرير وتطبيق التعديلات الأولى حسب القائمة أعلاه.
- تنفيذ كامل لمعايير التباين في كل الصفحات والمكونات.
