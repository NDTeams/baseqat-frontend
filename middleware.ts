import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // 1. حماية صفحات الداشبورد
  if (pathname.startsWith('/index') && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. منع المستخدم المسجل من العودة لصفحة الدخول
  if (token && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/student-dashboard', request.url));
  }

  return NextResponse.next();
}

// تحديد المسارات التي يتم فحصها
export const config = {
  matcher: ['/student-dashboard/:path*', '/login', '/register'],
};