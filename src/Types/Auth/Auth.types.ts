// src/types/Auth.types.ts

import type { AuditTrails } from "../Auditlog.types";

export interface LoginRequest {
  userName: string;
  password: string;
}

/* REGISTER TYPES (ADDED) */
export interface RegisterRequest {
  staffNo: number;
  userName: string;
  userEmail: string;
  phoneNumber: string;
  address?: string;
  password: string;
}

export interface User {
  userId: number;
  userName: string;
  userEmail: string;
  staffNo: number;
  memberId?: number; // Added to match backend response
  phoneNumber: string;
  address: string;
  passwordHash: string;
  oldPassword?: string;
  newPassword?: string;
  isActive: boolean;
  islocked: boolean;
  createAt: string;
  lastlogin: string;
  lastloginString: string;
  createAtSyring: string;
  companyId?: number;
  companyName?: string;
  role: string; // User role from backend
  auditLogs?: AuditTrails[];
}

export interface LoginResponse {
  token: string;
  expiresAt: string;
  user: User;
}

export interface ForgotPasswordRequest {
  email: string;
}

// Type guard to check if user has valid role
export function isValidUserRole(role: string | null | undefined): role is string {
  if (!role) return false;
  const normalizedRole = role.trim().toLowerCase();
  return normalizedRole === 'DSO' || 
         normalizedRole === 'Lab' || 
         normalizedRole === 'Doctor' ||
         normalizedRole === 'Practice' || 
         normalizedRole === 'Integrator' ||
         normalizedRole === 'AppAdmin';
}