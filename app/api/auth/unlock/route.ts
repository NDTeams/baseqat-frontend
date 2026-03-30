import { NextRequest, NextResponse } from "next/server";
import Cookies from "js-cookie";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    // الحصول على التوكن من الكوكيز
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          succeeded: false,
          message: "جلسة العمل منتهية، الرجاء تسجيل الدخول مجدداً",
        },
        { status: 401 }
      );
    }

    // في حالة وجود backend API، يمكن إرسال الطلب إليه
    // هنا نستخدم محاكاة بسيطة للتحقق من كلمة المرور

    // يمكنك استبدال هذا بطلب حقيقي للـ backend:
    /*
    const backendResponse = await fetch(`${process.env.BACKEND_URL}/api/auth/unlock`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ password })
    });

    const data = await backendResponse.json();
    return NextResponse.json(data);
    */

    // محاكاة التحقق (يجب استبدالها بطلب حقيقي للـ backend)
    if (password === "123456") {
      return NextResponse.json({
        succeeded: true,
        message: "تم فتح القفل بنجاح",
      });
    } else {
      return NextResponse.json(
        {
          succeeded: false,
          message: "كلمة المرور غير صحيحة",
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Unlock error:", error);
    return NextResponse.json(
      {
        succeeded: false,
        message: "حدث خطأ في الخادم",
      },
      { status: 500 }
    );
  }
}
