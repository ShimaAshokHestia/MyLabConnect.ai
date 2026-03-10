// src/Hooks/useCurrentUser.ts
//
// ─── useCurrentUser ───────────────────────────────────────────────────────────
// Reusable hook that exposes the logged-in user's identity and DSO context
// decoded from the JWT token via AuthService.
//
// Usage:
//   const { user, dsoMasterId, labMasterId, isAuthenticated } = useCurrentUser();
//
// ─────────────────────────────────────────────────────────────────────────────

import { useMemo } from "react";
import type { AuthUser } from "../../Types/Auth/Auth.types";
import AuthService from "./Auth.services";


export interface CurrentUserContext {
  /** Full user object decoded from JWT */
  user: AuthUser | null;

  /** Shorthand fields used across DSO pages */
  userId: number | null;
  userName: string | null;
  userEmail: string | null;
  userTypeId: number | null;
  userTypeName: string | null;

  /** DSO-specific context — null if user is not a DSO type */
  dsoMasterId: number | null;
  dsoName: string | null;

  /** Lab-specific context — null if user is not a Lab type */
  labMasterId: number | null;
  labName: string | null;

  /** Auth state helpers */
  isAuthenticated: boolean;
  isDSOUser: boolean;
  isLabUser: boolean;
  isAppAdmin: boolean;
  isDoctor: boolean;

  /**
   * Asserts dsoMasterId is present and throws a user-friendly error if not.
   * Use this inside form submit handlers to get a guaranteed non-null value.
   *
   * @example
   * const { requireDSOMasterId } = useCurrentUser();
   * const dsOMasterId = requireDSOMasterId(); // throws if missing
   */
  requireDSOMasterId: () => number;

  /**
   * Same as requireDSOMasterId but for lab pages.
   */
  requireLabMasterId: () => number;
}

export function useCurrentUser(): CurrentUserContext {
  const user = AuthService.getUser();

  return useMemo<CurrentUserContext>(() => {
    const userTypeName = user?.userTypeName?.trim().toLowerCase() ?? "";

    return {
      // ── Full user object ─────────────────────────────────────────────────
      user,

      // ── Identity ─────────────────────────────────────────────────────────
      userId: user?.id ?? null,
      userName: user?.userName ?? null,
      userEmail: user?.userEmail ?? null,
      userTypeId: user?.userTypeId ?? null,
      userTypeName: user?.userTypeName ?? null,

      // ── DSO context ───────────────────────────────────────────────────────
      dsoMasterId: user?.dsoMasterId ?? null,
      dsoName: user?.dsoName ?? null,

      // ── Lab context ───────────────────────────────────────────────────────
      labMasterId: user?.labMasterId ?? null,
      labName: user?.labName ?? null,

      // ── Auth state helpers ────────────────────────────────────────────────
      isAuthenticated: AuthService.isAuthenticated(),
      isDSOUser: userTypeName === "dso" || userTypeName === "dso admin",
      isLabUser: userTypeName === "lab" || userTypeName === "lab technician",
      isAppAdmin: userTypeName === "app admin" || userTypeName === "super admin",
      isDoctor: userTypeName === "doctor" || userTypeName === "dentist",

      // ── Assert helpers ────────────────────────────────────────────────────
      requireDSOMasterId(): number {
        const id = user?.dsoMasterId;
        if (!id) {
          throw new Error(
            "Session error: DSO Master ID not found. Please log out and log in again."
          );
        }
        return id;
      },

      requireLabMasterId(): number {
        const id = user?.labMasterId;
        if (!id) {
          throw new Error(
            "Session error: Lab Master ID not found. Please log out and log in again."
          );
        }
        return id;
      },
    };
  }, [user]);
}