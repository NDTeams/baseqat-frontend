"use client";

import { useTheme } from "next-themes";
import { useLayoutEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // نستخدم useLayoutEffect لتجنب أي flash أو تحذيرات
  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  // قبل التحميل على العميل، نرجع زر فارغ لتجنب Hydration Mismatch
  if (!mounted)
    return (
      <button className="p-2 border rounded opacity-0 pointer-events-none">
        ...
      </button>
    );

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 border rounded transition-colors duration-200"
    >
      {theme === "dark" ? "☀️ نهار" : "🌙 ليل"}
    </button>
  );
}
