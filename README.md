# فضة بغداد — متجر فضة أونلاين

موقع تجارة إلكترونية احترافي لمجوهرات فضية في بغداد، العراق. الواجهة بالكامل بالعربية والأسعار بالدينار العراقي.

## التقنيات

- **Next.js 14** (App Router)
- **shadcn/ui** (Radix + Tailwind)
- **Prisma** مع PostgreSQL (Supabase)
- **Supabase**: قاعدة البيانات، المصادقة (لوحة التحكم)، التخزين (صور المنتجات)
- **Zustand** (سلة المشتريات)

## الإعداد

### 1. Supabase

- أنشئ مشروعاً على [Supabase](https://supabase.com).
- من **Settings → API**: انسخ `Project URL` و `anon` key.
- من **Settings → Database**: انسخ **Connection string** (URI) لـ PostgreSQL.
- من **Storage**: أنشئ bucket باسم `products` واجعله **Public** حتى تظهر الصور.

### 2. المتغيرات البيئية

انسخ الملفات النموذجية واملأ القيم:

```bash
cp .env.example .env
cp .env.local.example .env.local
```

في `.env` و/أو `.env.local`:

```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT_REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

في Supabase **Authentication → Users** أنشئ مستخدماً (بريد + كلمة مرور) واستخدمه لتسجيل الدخول إلى لوحة التحكم.

### 3. التثبيت وقاعدة البيانات

```bash
npm install
npx prisma generate
npx prisma db push
npm run db:seed
```

### 4. التشغيل

```bash
npm run dev
```

- الموقع العام: [http://localhost:3000](http://localhost:3000)
- لوحة التحكم: [http://localhost:3000/admin](http://localhost:3000/admin) (تسجيل الدخول أولاً من /admin/login)

## هيكل المشروع

- **`app/`** — صفحات المتجر (الرئيسية، المتجر، المنتج، السلة، الدفع) + مسارات الـ Admin.
- **`app/admin/`** — تسجيل الدخول ولوحة التحكم (منتجات، تصنيفات، أنواع، طلبات).
- **`components/storefront/`** — مكونات الواجهة (بطاقة منتج، فلاتر، هيرو، إلخ).
- **`components/admin/`** — نماذج وإدارة المنتجات والصور والطلبات.
- **`lib/`** — Prisma، Supabase، تخزين السلة، ثوابت.
- **`prisma/schema.prisma`** — النماذج: Product, Category, Type, ProductImage, Order, OrderItem.

## الميزات

- واجهة عربية كاملة، RTL، أسعار بالدينار العراقي.
- صفحة متجر مع فلاتر (جنس، تصنيف، نوع، سعر، وزن، حجر) وترتيب وبحث فوري.
- بطاقة منتج: صورة، اسم، وصف قصير، **سعر ووزن وزر "أضف إلى السلة" ثابتين في أسفل البطاقة**.
- صفحة منتج: معرض صور، وزن، سعر، وصف، نقاء فضة، نوع حجر، منتجات ذات صلة.
- سلة ودفع (دفع عند الاستلام، اسم، هاتف، عنوان بغداد).
- لوحة تحكم محمية: إحصائيات، إدارة منتجات (إضافة/تعديل/تعطيل)، تصنيفات وأنواع، رفع وإعادة ترتيب وتحديد صورة رئيسية، عرض الطلبات وتحديث الحالة.

## استكشاف الأخطاء

### «Can't reach database server» أو عدم ظهور المنتجات

1. **تفعيل المشروع:** في [Supabase Dashboard](https://supabase.com/dashboard) تأكد أن المشروع يعمل (مشاريع مجانية تتوقف بعد فترة عدم استخدام — اضغط Restore إن لزم).
2. **رابط الاتصال:** من **Settings → Database** انسخ **Connection string** → **URI** واستخدمه في `DATABASE_URL` و `DIRECT_URL`. إذا كان الرابط يستخدم المنفذ **6543** وفشل الاتصال، جرّب الرابط المباشر (منفذ **5432** أو مضيف `db.xxx.supabase.co`).
3. بعد تعديل `.env` أعد تشغيل السيرفر (`npm run dev`).

### تسجيل الدخول للوحة التحكم

- استخدم مفتاح **anon (public)** من Supabase → Settings → API في `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- أنشئ مستخدماً من **Authentication → Users** ثم سجّل الدخول بنفس البريد وكلمة المرور.

## أوامر مفيدة

- `npm run db:push` — تطبيق الـ schema على قاعدة البيانات.
- `npm run db:seed` — إدراج تصنيفات ومنتجات افتراضية.
- `npm run db:studio` — فتح Prisma Studio.
