// src/Types/Auth/Auth.types.ts

// ─── Request Types ────────────────────────────────────────────────
export interface LoginRequest {
  userName: string;
  password: string;
}

export interface RegisterRequest {
  userName: string;
  userEmail: string;
  phoneNumber: string;
  address?: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  email: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// ─── UserTypeName — must match DB UserTypes exactly ───────────────
export type UserTypeName =
  | 'DSO'
  | 'Lab'
  | 'Doctor'
  | 'Practice'
  | 'Integrator'
  | 'AppAdmin';

// ─── Portal route map ─────────────────────────────────────────────
export const PORTAL_ROUTES: Record<UserTypeName, string> = {
  AppAdmin:   '/appadmin-connect',
  DSO:        '/dsoadmin-connect',
  Lab:        '/lab-connect',
  Practice:   '/practice-connect',
  Doctor:     '/doctor-connect',
  Integrator: '/integrator-connect',
};

// ─── AuthUser — mirrors backend UserDTO ──────────────────────────
export interface AuthUser {
  id: number;
  userName: string;
  userEmail: string;
  phoneNumber: string;
  address: string;
  islocked: boolean;
  companyId: number;
  companyName: string;
  userTypeId: number;
  userTypeName: UserTypeName;
  lastlogin: string;
  lastloginString: string;
  createAtString: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  isActive: boolean;
}

// ─── Login response (value field from backend) ────────────────────
export interface LoginResponseValue {
  token: string;
  expiresAt: string;
  user: AuthUser;
}

// ─── Generic backend wrapper — preserves backend typo "isSucess" ──
export interface CustomApiResponse<T = any> {
  statusCode: number;
  error: string | null;
  customMessage: string | null;
  isSucess: boolean;
  value: T | null;
}

export type LoginApiResponse = CustomApiResponse<LoginResponseValue>;

// ─── Helpers ──────────────────────────────────────────────────────
export function isValidUserTypeName(name: string | null | undefined): name is UserTypeName {
  if (!name) return false;
  return ['DSO', 'Lab', 'Doctor', 'Practice', 'Integrator', 'AppAdmin'].includes(name);
}

export function getDashboardRouteByType(userTypeName: string): string {
  if (!isValidUserTypeName(userTypeName)) return '/';
  return PORTAL_ROUTES[userTypeName];
}