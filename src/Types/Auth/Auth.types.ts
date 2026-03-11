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

export interface VerifyOtpRequest {
  otpCode: string;
}

export interface ChangeDefaultPasswordRequest {
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
  isDefaultPassword: boolean;
  dsoMasterId?: number | null;
  dsoName?: string;
  labMasterId?: number | null;
  labName?: string;
  // ── Doctor-specific: resolved from JWT claim "dsoDoctorId" ──────
  dsoDoctorId?: number | null;
}

// ─── Auth states returned by backend ─────────────────────────────
export type AuthState = 'SUCCESS' | 'REQUIRES_2FA' | 'REQUIRES_PWD_CHANGE';

// ─── Backend AuthResponseDTO shape ───────────────────────────────
export interface AuthResponseDTO {
  authState: AuthState;
  token: string | null;
  resendAvailableInSeconds?: number | null;
  redirectPortal?: string | null;
}

// ─── Generic backend wrapper — preserves backend typo "isSucess" ──
export interface CustomApiResponse<T = any> {
  statusCode: number;
  error: string | null;
  customMessage: string | null;
  isSucess: boolean;
  value: T | null;
}

// ─── Specific response types ─────────────────────────────────────
export type LoginApiResponse = CustomApiResponse<AuthResponseDTO>;
export type MeApiResponse = CustomApiResponse<AuthUser>;

// ─── Legacy shape kept for register (still returns token+user) ────
export interface RegisterResponseValue {
  token: string;
  expiresAt: string;
  user: AuthUser;
}
export type RegisterApiResponse = CustomApiResponse<RegisterResponseValue>;

// ─── Helpers ──────────────────────────────────────────────────────
export function isValidUserTypeName(name: string | null | undefined): name is UserTypeName {
  if (!name) return false;
  return ['DSO', 'Lab', 'Doctor', 'Practice', 'Integrator', 'AppAdmin'].includes(name);
}

export function getDashboardRouteByType(userTypeName: string): string {
  if (!isValidUserTypeName(userTypeName)) return '/';
  return PORTAL_ROUTES[userTypeName];
}

// ─── Portal name → route (matches backend DeterminePortal) ───────
const PORTAL_NAME_MAP: Record<string, string> = {
  AdminConnect:     '/appadmin-connect',
  DSOConnect:       '/dsoadmin-connect',
  LabConnect:       '/lab-connect',
  PracticePortal:   '/practice-connect',
  DrConnect:        '/doctor-connect',
  DefaultDashboard: '/',
};

export function getRouteFromPortalName(portalName: string | null | undefined): string {
  if (!portalName) return '/';
  return PORTAL_NAME_MAP[portalName] ?? '/';
}