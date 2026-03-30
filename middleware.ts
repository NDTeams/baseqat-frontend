import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// فك تشفير JWT بسيط (بدون مكتبة)
function decodeJWT(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      Buffer.from(base64, 'base64')
        .toString()
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('JWT decode error:', error);
    return null;
  }
}

// استخراج الدور من payload بطرق مختلفة
function extractRole(payload: any): string | null {
  if (!payload) return null;

  // جرّب جميع الاحتمالات الممكنة لمفتاح الدور
  const possibleRoleKeys = [
    'role',
    'Role',
    'ROLE',
    'user_role',
    'userRole',
    'UserRole',
    'roles',
    'Roles',
    'ROLES',
    'http://schemas.microsoft.com/ws/2008/06/identity/claims/role',
  ];

  for (const key of possibleRoleKeys) {
    if (payload[key]) {
      const roleValue = payload[key];
      // إذا كان array، خذ أول عنصر
      if (Array.isArray(roleValue)) {
        return roleValue[0]?.toString() || null;
      }
      return roleValue.toString();
    }
  }

  // إذا فشلت جميع المحاولات، طباعة payload للتشخيص
  console.log('JWT Payload:', JSON.stringify(payload, null, 2));
  return null;
}

// الأدوار المسموح لها بالوصول للوحة التحكم (بجميع حالات الأحرف)
const ALLOWED_ADMIN_ROLES = [
  'admin',
  'Admin',
  'ADMIN',
  'baseqatemployee',
  'BASEQATEMPLOYEE',
  'BaseqatEmployee',
  'superadmin',
  'SUPERADMIN',
  'SuperAdmin',
];

function hasAdminRole(role: string | null): boolean {
  if (!role) return false;

  // تحويل إلى lowercase للمقارنة
  const roleLower = role.toLowerCase();
  return ALLOWED_ADMIN_ROLES.some(r => r.toLowerCase() === roleLower);
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // 1. حماية لوحة التحكم الإدارية (/index)
  if (pathname.startsWith('/index')) {
    // التحقق من وجود توكن
    if (!token) {
      console.log('No token found, redirecting to /login');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // فك تشفير التوكن للحصول على الدور
    const payload = decodeJWT(token);
    const userRole = extractRole(payload);

    console.log('User role extracted:', userRole);

    // التحقق من الدور
    if (!hasAdminRole(userRole)) {
      console.log('User does not have admin role, redirecting to /student-dashboard');
      return NextResponse.redirect(new URL('/student-dashboard', request.url));
    }

    console.log('Admin access granted');
  }

  // 2. حماية صفحات student-dashboard
  if (pathname.startsWith('/student-dashboard') && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 3. منع المستخدم المسجل من العودة لصفحة الدخول
  if (token && (pathname === '/login' || pathname === '/register')) {
    // فك تشفير التوكن لتحديد نوع المستخدم
    const payload = decodeJWT(token);
    const userRole = extractRole(payload);

    // إعادة توجيه حسب الدور
    if (hasAdminRole(userRole)) {
      return NextResponse.redirect(new URL('/index', request.url));
    } else {
      return NextResponse.redirect(new URL('/student-dashboard', request.url));
    }
  }

  return NextResponse.next();
}

// تحديد المسارات التي يتم فحصها
export const config = {
  matcher: [
    '/index/:path*',
    '/student-dashboard/:path*',
    '/login',
    '/register',
  ],
};
