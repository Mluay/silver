المشروع نُقل هنا من OneDrive لتفادي أخطاء الملفات المقفلة (EBUSY).

تم تنفيذ:
- npm install
- npx prisma generate
- npx prisma db push
- npm run build  (نجح)

لتشغيل الموقع:
1. أغلق أي برنامج يستخدم المنفذ 3000 (أو شغّل على منفذ آخر:
   $env:PORT=3001; npm run start
2. من هذا المجلد نفّذ:
   npm run start
   أو للتطوير:
   npm run dev
3. افتح المتصفح: http://localhost:3000

خطة الاختبار والتسليم: docs\PLAN_TEST_AND_DELIVERY.md
