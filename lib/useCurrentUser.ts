"use client";

import { useMemo } from "react";
import Cookies from "js-cookie";

interface DecodedToken {
  sub?: string;
  email?: string;
  name?: string;
  role?: string | string[];
  // ASP.NET Core Identity claim keys
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string | string[];
  exp?: number;
}

function decodeJwt(token: string): DecodedToken | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(payload + "=".repeat((4 - payload.length % 4) % 4));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export function useCurrentUser() {
  return useMemo(() => {
    const token =
      typeof window !== "undefined"
        ? Cookies.get("auth_token") ||
          localStorage.getItem("auth_token") ||
          localStorage.getItem("authToken")
        : null;

    if (!token) return { roles: [], isAdmin: false, isSuperAdmin: false, isPrivileged: false };

    const decoded = decodeJwt(token);
    if (!decoded) return { roles: [], isAdmin: false, isSuperAdmin: false, isPrivileged: false };

    // Get roles — ASP.NET uses the long claim name OR short "role"
    const rawRoles =
      decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ??
      decoded.role ??
      [];

    const roles: string[] = Array.isArray(rawRoles) ? rawRoles : [rawRoles];
    const rolesLower = roles.map((r) => r.toLowerCase());

    const isAdmin = rolesLower.includes("admin");
    const isSuperAdmin = rolesLower.includes("superadmin") || rolesLower.includes("super admin");
    const isEmployee = rolesLower.includes("baseqatemployee");
    const isPrivileged = isAdmin || isSuperAdmin || isEmployee;

    return { roles, isAdmin, isSuperAdmin, isEmployee, isPrivileged };
  }, []);
}
