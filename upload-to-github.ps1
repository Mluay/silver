# رفع المشروع إلى https://github.com/Mluay/silver
# شغّل هذا الملف بعد تثبيت Git: انقر يمين على الملف > تشغيل باستخدام PowerShell

$ErrorActionPreference = "Stop"
$projectPath = $PSScriptRoot
Set-Location $projectPath

Write-Host "المجلد: $projectPath" -ForegroundColor Cyan
Write-Host ""

# التحقق من وجود Git
$git = $null
if (Get-Command git -ErrorAction SilentlyContinue) { $git = "git" }
elseif (Test-Path "C:\Program Files\Git\bin\git.exe") { $git = "C:\Program Files\Git\bin\git.exe" }
elseif (Test-Path "C:\Program Files (x86)\Git\bin\git.exe") { $git = "C:\Program Files (x86)\Git\bin\git.exe" }

if (-not $git) {
    Write-Host "خطأ: Git غير مثبت أو غير موجود في المسار." -ForegroundColor Red
    Write-Host "ثبّت Git من: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host "ثم أعد تشغيل هذا السكربت." -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host "تم العثور على Git." -ForegroundColor Green
Write-Host ""

# تهيئة المستودع إن لم يكن موجوداً
if (-not (Test-Path ".git")) {
    & $git init
    Write-Host "تم تهيئة المستودع." -ForegroundColor Green
} else {
    Write-Host "المستودع موجود مسبقاً." -ForegroundColor Gray
}

# إضافة الملفات
& $git add .
$status = & $git status --short
if (-not $status) {
    Write-Host "لا توجد تغييرات جديدة للرفع. (ربما تم الرفع مسبقاً)" -ForegroundColor Yellow
    $push = Read-Host "مع ذلك، هل تريد تنفيذ push؟ (y/n)"
    if ($push -ne "y") { exit 0 }
} else {
    & $git commit -m "رفع موقع فضة بغداد - Next.js ولوحة تحكم"
    Write-Host "تم إنشاء الـ commit." -ForegroundColor Green
}

& $git branch -M main

# إضافة الـ remote إن لم يكن موجوداً
$remotes = & $git remote 2>$null
if ($remotes -notcontains "origin") {
    & $git remote add origin "https://github.com/Mluay/silver.git"
    Write-Host "تم إضافة origin." -ForegroundColor Green
} else {
    & $git remote set-url origin "https://github.com/Mluay/silver.git"
}

Write-Host ""
Write-Host "جاري الرفع إلى GitHub..." -ForegroundColor Cyan
& $git push -u origin main

Write-Host ""
Write-Host "تم. يمكنك فتح المستودع: https://github.com/Mluay/silver" -ForegroundColor Green
pause
