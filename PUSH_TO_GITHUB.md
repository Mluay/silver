# رفع المشروع إلى GitHub

المستودع: **https://github.com/Mluay/silver** (فارغ وجاهز للرفع)

## الطريقة الأسهل: تشغيل السكربت

1. ثبّت **Git** من: https://git-scm.com/download/win  
   (أثناء التثبيت اختر: *Git from the command line and also from 3rd-party software*)
2. أعد تشغيل Cursor أو الجهاز بعد التثبيت.
3. من مجلد المشروع، انقر يمين على **`upload-to-github.ps1`** واختر **تشغيل باستخدام PowerShell**.
4. إذا طُلب تسجيل الدخول إلى GitHub، نفّذ ذلك من المتصفح.

---

## 1. تثبيت Git (إن لم يكن مثبتاً)

- حمّل Git من: https://git-scm.com/download/win  
- ثبّته ثم أعد فتح الطرفية (Terminal).

## 2. الأوامر لرفع المشروع

افتح **PowerShell** أو **Command Prompt** داخل مجلد المشروع، ثم نفّذ الأوامر بالترتيب:

```powershell
cd "c:\Users\ASUS\OneDrive\Desktop\silver test"
```

```powershell
git init
```

```powershell
git add .
```

```powershell
git commit -m "رفع موقع فضة بغداد - Next.js ولوحة تحكم"
```

```powershell
git branch -M main
```

```powershell
git remote add origin https://github.com/Mluay/silver.git
```

إذا كان المستودع فارغاً (بدون أي commit سابق):

```powershell
git push -u origin main
```

إذا كان المستودع فيه commits سابقة وتريد دمجها:

```powershell
git pull origin main --allow-unrelated-histories
git push -u origin main
```

## 3. ملاحظات

- ملف **`.env`** غير مرفوع (موجود في `.gitignore`) لحماية مفاتيح قاعدة البيانات و Supabase.  
  أضف متغيرات البيئة في إعدادات الاستضافة (مثل Vercel) أو أنشئ `.env` يدوياً على الجهاز الآخر.
- بعد أي تعديل لاحق، استخدم:
  ```powershell
  git add .
  git commit -m "وصف التعديل"
  git push
  ```
