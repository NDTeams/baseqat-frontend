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

// استخراج الأدوار من payload (يدعم دور واحد أو عدة أدوار)
function extractRoles(payload: any): string[] {
  if (!payload) return [];

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
      if (Array.isArray(roleValue)) {
        return roleValue.map((r: any) => r.toString());
      }
      return [roleValue.toString()];
    }
  }

  return [];
}

// الأدوار المسموح لها بالوصول للوحة التحكم الإدارية
const ALLOWED_ADMIN_ROLES = ['superadmin', 'admin', 'baseqatemployee'];

function hasAdminRole(roles: string[]): boolean {
  return roles.some(r => ALLOWED_ADMIN_ROLES.includes(r.toLowerCase()));
}

// جميع مسارات لوحة التحكم الإدارية (dashboard)
const ADMIN_DASHBOARD_PATHS = [
  '/index',
  '/settings',
  '/users',
  '/user-management',
  '/roles',
  '/privileges',
  '/courses',
  '/courses-table',
  '/course-categories',
  '/enrollments',
  '/certificates',
  '/quizzes',
  '/payments',
  '/instructors-admin',
  '/instructor-skills',
  '/consultants-admin',
  '/consultation-categories-admin',
  '/consultation-requests-admin',
  '/consultations',
  '/media-center-admin',
  '/home-statistics',
  '/indicators',
  '/calendar',
  '/contact-requests',
  '/login-logs',
  '/delete-user',
  '/seed',
  '/auth-test',
];

function isAdminPath(pathname: string): boolean {
  return ADMIN_DASHBOARD_PATHS.some(p =>
    pathname === p || pathname.startsWith(p + '/')
  );
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value
    || request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // 1. حماية لوحة التحكم الإدارية (جميع صفحات الداشبورد)
  if (isAdminPath(pathname)) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const payload = decodeJWT(token);
    const userRoles = extractRoles(payload);

    if (!hasAdminRole(userRoles)) {
      return NextResponse.redirect(new URL('/student-dashboard/index', request.url));
    }
  }

  // 2. حماية صفحات student-dashboard (يجب تسجيل الدخول)
  if (pathname.startsWith('/student-dashboard') && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 3. حماية صفحات client-dashboard (يجب تسجيل الدخول)
  if (pathname.startsWith('/client-dashboard') && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 4. منع المستخدم المسجل من العودة لصفحة الدخول
  if (token && (pathname === '/login' || pathname === '/register')) {
    const payload = decodeJWT(token);
    const userRoles = extractRoles(payload);

    if (hasAdminRole(userRoles)) {
      return NextResponse.redirect(new URL('/index', request.url));
    } else {
      return NextResponse.redirect(new URL('/student-dashboard/index', request.url));
    }
  }

  return NextResponse.next();
}

// تحديد المسارات التي يتم فحصها
export const config = {
  matcher: [
    '/index/:path*',
    '/settings/:path*',
    '/users/:path*',
    '/user-management/:path*',
    '/roles/:path*',
    '/privileges/:path*',
    '/courses/:path*',
    '/courses-table/:path*',
    '/course-categories/:path*',
    '/enrollments/:path*',
    '/certificates/:path*',
    '/quizzes/:path*',
    '/payments/:path*',
    '/instructors-admin/:path*',
    '/instructor-skills/:path*',
    '/consultants-admin/:path*',
    '/consultation-categories-admin/:path*',
    '/consultation-requests-admin/:path*',
    '/consultations/:path*',
    '/media-center-admin/:path*',
    '/home-statistics/:path*',
    '/indicators/:path*',
    '/calendar/:path*',
    '/contact-requests/:path*',
    '/login-logs/:path*',
    '/delete-user/:path*',
    '/seed/:path*',
    '/auth-test/:path*',
    '/student-dashboard/:path*',
    '/client-dashboard/:path*',
    '/login',
    '/register',
  ],
};
