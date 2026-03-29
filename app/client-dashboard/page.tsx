"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ClientDashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/client-dashboard/index");
  }, [router]);

  return null;
}
