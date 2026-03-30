import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value;

    // إرسال طلب تسجيل الخروج للـ backend (اختياري)
    if (token) {
      const backendUrl = process.env.BACKEND_URL || "http://localhost:5139/api";

      try {
        await fetch(`${backendUrl}/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error("Backend logout error:", error);
        // نتجاهل الخطأ ونكمل عملية تسجيل الخروج محلياً
      }
    }

    // حذف التوكن من الكوكيز
    const response = NextResponse.json({
      succeeded: true,
      message: "تم تسجيل الخروج بنجاح",
    });

    response.cookies.delete("auth_token");

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      {
        succeeded: false,
        message: "حدث خطأ في تسجيل الخروج",
      },
      { status: 500 }
    );
  }
}
