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

// ─── UserTypeName ─────────────────────────────────────────────────
// Kept as `string` intentionally — DB values vary in casing and spacing
// (e.g. "doctor", "app admin", "dso"). All validation is done at runtime
// via isValidUserTypeName() which is case-insensitive.
export type UserTypeName = string;

// ─── Portal route map — keyed by lowercase DB value ──────────────
export const PORTAL_ROUTES_MAP: Record<string, string> = {
  'dso':              '/dsoadmin-connect',
  'dso admin':        '/dsoadmin-connect',
  'lab':              '/lab-connect',
  'lab technician':   '/lab-connect',
  'doctor':           '/doctor-connect',
  'dentist':          '/doctor-connect',
  'practice':         '/practice-connect',
  'practice manager': '/practice-connect',
  'integrator':       '/integrator-connect',
  'app admin':        '/appadmin-connect',
  'appadmin':         '/appadmin-connect',   // legacy DB value before migration
  'super admin':      '/appadmin-connect',
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
  dsoDoctorId?: number | null;
  doctorID?: number | null;
  doctorId?: number | null;
}

// ─── Auth states returned by backend ─────────────────────────────
export type AuthState =
  | 'SUCCESS'
  | 'REQUIRES_2FA'
  | 'REQUIRES_PWD_CHANGE'
  | 'REQUIRES_CONSENT';

// ─── Backend response shapes ──────────────────────────────────────
export interface AuthResponseDTO {
  authState: AuthState;
  token: string | null;
  resendAvailableInSeconds?: number | null;
  redirectPortal?: string | null;
}
export interface CustomApiResponse<T = any> {
  statusCode: number;
  error: string | null;
  customMessage: string | null;
  isSucess: boolean;
  value: T | null;
}
export type LoginApiResponse  = CustomApiResponse<AuthResponseDTO>;
export type MeApiResponse     = CustomApiResponse<AuthUser>;

export interface RegisterResponseValue {
  token: string;
  expiresAt: string;
  user: AuthUser;
}
export type RegisterApiResponse = CustomApiResponse<RegisterResponseValue>;

// ─── Runtime helpers ──────────────────────────────────────────────

/** Case-insensitive. Handles legacy "appadmin" and new "app admin". */
export function isValidUserTypeName(name: string | null | undefined): name is UserTypeName {
  if (!name) return false;
  return (name.toLowerCase().trim()) in PORTAL_ROUTES_MAP;
}

/** Returns the dashboard route for a given userTypeName (case-insensitive). */
export function getDashboardRouteByType(userTypeName: string): string {
  return PORTAL_ROUTES_MAP[userTypeName?.toLowerCase().trim()] ?? '/';
}

/** Maps backend RedirectPortal name → frontend route. */
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