// src/Hooks/useCurrentUser.ts

import { useMemo } from "react";
import type { AuthUser } from "../../Types/Auth/Auth.types";
import AuthService from "./Auth.services";

export interface CurrentUserContext {
  user: AuthUser | null;

  userId: number | null;
  userName: string | null;
  userEmail: string | null;
  userTypeId: number | null;
  userTypeName: string | null;

  dsoMasterId: number | null;
  dsoName: string | null;

  labMasterId: number | null;
  labName: string | null;

  // ── Doctor-specific ───────────────────────────────────────────────
  dsoDoctorId: number | null;

  isAuthenticated: boolean;
  isDSOUser: boolean;
  isLabUser: boolean;
  isAppAdmin: boolean;
  isDoctor: boolean;

  requireDSOMasterId: () => number;
  requireLabMasterId: () => number;
  requireDSODoctorId: () => number;
}

export function useCurrentUser(): CurrentUserContext {
  const user = AuthService.getUser();

  return useMemo<CurrentUserContext>(() => {
    const userTypeName = user?.userTypeName?.trim().toLowerCase() ?? "";

    return {
      user,
      userId:       user?.id          ?? null,
      userName:     user?.userName    ?? null,
      userEmail:    user?.userEmail   ?? null,
      userTypeId:   user?.userTypeId  ?? null,
      userTypeName: user?.userTypeName ?? null,

      dsoMasterId:  user?.dsoMasterId  ?? null,
      dsoName:      user?.dsoName      ?? null,

      labMasterId:  user?.labMasterId  ?? null,
      labName:      user?.labName      ?? null,

      // ── Resolved directly from JWT — no extra API call needed ──────
      dsoDoctorId:  user?.dsoDoctorId  ?? null,

      isAuthenticated: AuthService.isAuthenticated(),
      isDSOUser:  userTypeName === "dso" || userTypeName === "dso admin",
      isLabUser:  userTypeName === "lab" || userTypeName === "lab technician",
      isAppAdmin: userTypeName === "app admin" || userTypeName === "super admin",
      isDoctor:   userTypeName === "doctor" || userTypeName === "dentist",

      requireDSOMasterId(): number {
        const id = user?.dsoMasterId;
        if (!id) throw new Error("Session error: DSO Master ID not found. Please log out and log in again.");
        return id;
      },

      requireLabMasterId(): number {
        const id = user?.labMasterId;
        if (!id) throw new Error("Session error: Lab Master ID not found. Please log out and log in again.");
        return id;
      },

      requireDSODoctorId(): number {
        const id = user?.dsoDoctorId;
        if (!id) throw new Error("Session error: Doctor ID not found. Please log out and log in again.");
        return id;
      },
    };
  }, [user]);
}