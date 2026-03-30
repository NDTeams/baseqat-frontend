import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // التحقق من البيانات
    if (!email || !password) {
      return NextResponse.json(
        {
          succeeded: false,
          message: "الرجاء إدخال البريد الإلكتروني وكلمة المرور",
        },
        { status: 400 }
      );
    }

    // إرسال الطلب إلى الـ backend API
    const backendUrl = process.env.BACKEND_URL || "http://localhost:5139/api";

    try {
      const backendResponse = await fetch(`${backendUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await backendResponse.json();

      if (data.succeeded && data.data?.token) {
        // إنشاء response مع حفظ التوكن في الكوكيز
        const response = NextResponse.json(data);

        // حفظ التوكن في الكوكيز (httpOnly للأمان)
        response.cookies.set("auth_token", data.data.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7, // 7 أيام
          path: "/",
        });

        return response;
      }

      return NextResponse.json(data, { status: backendResponse.status });
    } catch (backendError) {
      console.error("Backend connection error:", backendError);

      // في حالة فشل الاتصال بالـ backend، استخدم محاكاة للتطوير
      if (process.env.NODE_ENV === "development") {
        // محاكاة تسجيل دخول للتطوير
        if (email === "admin@baseqat.com" && password === "123456") {
          const mockToken = "mock_token_" + Date.now();
          const mockUser = {
            id: "1",
            name: "أحمد محمد",
            email: "admin@baseqat.com",
            role: "مدير النظام",
          };

          const response = NextResponse.json({
            succeeded: true,
            message: "تم تسجيل الدخول بنجاح",
            data: {
              token: mockToken,
              user: mockUser,
            },
          });

          response.cookies.set("auth_token", mockToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
          });

          return response;
        }
      }

      return NextResponse.json(
        {
          succeeded: false,
          message: "فشل الاتصال بالخادم",
        },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      {
        succeeded: false,
        message: "حدث خطأ في الخادم",
      },
      { status: 500 }
    );
  }
}
