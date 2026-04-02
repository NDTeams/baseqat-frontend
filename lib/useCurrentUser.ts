"use client";

import { useMemo } from "react";

export function useCurrentUser() {
  return useMemo(() => {
    if (typeof window === "undefined") {
      return { roles: [], isAdmin: false, isSuperAdmin: false, isPrivileged: false };
    }

    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        return { roles: [], isAdmin: false, isSuperAdmin: false, isPrivileged: false };
      }

      const user = JSON.parse(userStr);
      const roles: string[] = Array.isArray(user.roles)
        ? user.roles
        : user.role
          ? [user.role]
          : [];
      const rolesLower = roles.map((r) => r.toLowerCase());

      const isAdmin = rolesLower.includes("admin");
      const isSuperAdmin = rolesLower.includes("superadmin") || rolesLower.includes("super admin");
      const isEmployee = rolesLower.includes("baseqatemployee");
      const isPrivileged = isAdmin || isSuperAdmin || isEmployee;

      return { roles, isAdmin, isSuperAdmin, isEmployee, isPrivileged };
    } catch {
      return { roles: [], isAdmin: false, isSuperAdmin: false, isPrivileged: false };
    }
  }, []);
}
