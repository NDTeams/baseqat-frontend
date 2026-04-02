# Basqat Platform - أوامر التشغيل والتطوير

## تشغيل المشروع

### Frontend (Next.js)
```bash
cd d:/2026/baseqat/app/Basqat-main
npm run dev
```
- يعمل على: `http://localhost:3000`
- يستخدم Next.js App Router مع Tailwind CSS
- الخط: Cairo (عربي + لاتيني)

### Backend (.NET API)
```bash
cd D:/ND/app/Baseqt
dotnet run --project Baseqt.API
```
- يعمل على: `https://localhost:7226` أو `http://localhost:5189`
- API Base: `/api` (يتم التوجيه عبر Next.js rewrites)

---

## أوامر Git

```bash
# حالة المشروع
git status

# إضافة وحفظ التغييرات
git add .
git commit -m "وصف التعديل"

# رفع على GitHub
git push origin blackboxai/remove-chinese-text-add-header

# سحب آخر التحديثات
git pull origin blackboxai/remove-chinese-text-add-header
```

---

## هيكل المشروع (Frontend)

```
Basqat-main/
├── app/
│   ├── (auth)/           # صفحات المصادقة (login, register, forgot-password, reset-password)
│   ├── (dashboard)/      # لوحة تحكم المدير (layout مشترك مع sidebar + header)
│   │   ├── home-statistics/  # إدارة إحصائيات الموقع (CRUD)
│   │   ├── indicators/       # المؤشرات
│   │   ├── courses/          # الدورات
│   │   └── ...
│   ├── (site)/           # صفحات الموقع العامة
│   └── student-dashboard/ # لوحة تحكم الطالب
├── components/
│   ├── dashboard/        # مكونات لوحة التحكم (sidebar, header)
│   ├── student-dashboard/ # مكونات لوحة الطالب (sidebar, header, profile-settings)
│   └── site/             # مكونات الموقع (company-statistics, hero, etc.)
├── services/
│   └── auth/             # خدمات المصادقة (login, register, logout)
├── lib/
│   └── axios.ts          # إعداد Axios مع interceptors
└── public/
    └── site/             # الصور (logo.png, etc.)
```

## هيكل Backend (.NET)

```
Baseqt/
├── Baseqt.API/
│   └── Controllers/      # API Controllers
├── Baseqt.CORE/
│   ├── DTOs/             # Data Transfer Objects
│   ├── Services/         # Business Logic (AuthServices, TokenService)
│   └── Models/           # Database Models
└── Baseqt.EF/            # Entity Framework (DbContext, Migrations)
```

---

## API Endpoints الرئيسية

| Endpoint | Method | الوصف |
|----------|--------|-------|
| `/api/Account/LoginByEmail` | POST | تسجيل الدخول |
| `/api/Account/Register` | POST | إنشاء حساب |
| `/api/HomeStatistic/GetAll` | GET | جلب الإحصائيات |
| `/api/HomeStatistic/Add` | POST | إضافة إحصائية |
| `/api/HomeStatistic/Update/{id}` | PUT | تعديل إحصائية |
| `/api/HomeStatistic/Delete/{id}` | DELETE | حذف إحصائية |

---

## المصادقة (Authentication)

- **Token**: JWT محفوظ في Cookie (`auth_token`)
- **Remember Me**:
  - مفعل → Cookie 30 يوم + JWT 30 يوم
  - غير مفعل → Cookie جلسة + JWT ساعة واحدة
- **Interceptor**: يضيف `Authorization: Bearer {token}` تلقائياً
- **401 Handler**: يحذف التوكن ويمسح التخزين المحلي

---

## ملاحظات مهمة

- التطبيق RTL (من اليمين لليسار) - عربي بالكامل
- الألوان الرئيسية: `emerald-700` (أخضر)
- Next.js Rewrites: `/api/*` → `https://localhost:7226/api/*`
- الـ Sidebar في لوحة التحكم يستخدم `SidebarContext` للتحكم بالموبايل
- الشعار في الـ Sidebar مربوط بـ `<Link href="/">` للرجوع للموقع الرئيسي
