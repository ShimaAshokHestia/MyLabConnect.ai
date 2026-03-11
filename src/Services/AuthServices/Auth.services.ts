// src/Services/AuthServices/Auth.services.ts

import { API_ENDPOINTS } from '../../CONSTANTS/API_ENDPOINTS';
import HttpService from '../Common/HttpService';
import {
  getDashboardRouteByType,
  getRouteFromPortalName,
  isValidUserTypeName,
  type AuthUser,
  type ChangeDefaultPasswordRequest,
  type ChangePasswordRequest,
  type ForgotPasswordRequest,
  type LoginApiResponse,
  type LoginRequest,
  type RegisterApiResponse,
  type RegisterRequest,
  type VerifyOtpRequest,
} from '../../Types/Auth/Auth.types';
import KiduSecureStorage from '../Common/KiduSecureStorage';

// ─── Storage keys ─────────────────────────────────────────────────
const KEYS = {
  TOKEN:       'jwt_token',
  TEMP_TOKEN:  'jwt_temp_token',
  USER:        'auth_user',
  USER_TYPE:   'user_type_name',
  EXPIRES_AT:  'token_expires_at',
  PORTAL:      'redirect_portal',
} as const;

// ─── In-memory cache ──────────────────────────────────────────────
interface AuthCache {
  token:     string | null;
  tempToken: string | null;
  user:      AuthUser | null;
  userType:  string | null;
  expiresAt: string | null;
  portal:    string | null;
}

let _cache: AuthCache = {
  token: null, tempToken: null, user: null,
  userType: null, expiresAt: null, portal: null,
};

// ─── JWT Decoder ──────────────────────────────────────────────────
function decodeJwtPayload(token: string): Record<string, any> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// ─── Safe claim extractor ─────────────────────────────────────────
// The JWT has BOTH JwtRegisteredClaimNames.Email AND a custom "email" claim,
// both with the same key "email". When decoded, duplicate keys become an array.
// This helper ALWAYS returns the first string value safely — never an array.
function claim(p: Record<string, any>, key: string): string {
  const val = p[key];
  if (Array.isArray(val)) return String(val[0] ?? '');
  if (val === null || val === undefined) return '';
  return String(val);
}

// ─── Build AuthUser from JWT claims ───────────────────────────────
function buildUserFromToken(token: string): AuthUser | null {
  const p = decodeJwtPayload(token);
  if (!p) return null;

  const id           = parseInt(claim(p, 'uid') || claim(p, 'sub') || '0', 10);
  const userTypeName = claim(p, 'userTypeName');

  if (!id || !isValidUserTypeName(userTypeName)) return null;

  const dsoMasterIdRaw  = claim(p, 'dsoMasterId');
  const labMasterIdRaw  = claim(p, 'labMasterId');
  // ── Read dsoDoctorId directly from JWT claim ─────────────────────
  const dsoDoctorIdRaw  = claim(p, 'dsoDoctorId');
  const userEmail       = claim(p, 'email');

  return {
    id,
    userName:          claim(p, 'username'),
    userEmail,
    phoneNumber:       claim(p, 'phone'),
    address:           '',
    islocked:          claim(p, 'isLocked') === 'True',
    companyId:         parseInt(claim(p, 'companyId')  || '0', 10),
    companyName:       '',
    userTypeId:        parseInt(claim(p, 'userTypeId') || '0', 10),
    userTypeName,
    lastlogin:         '',
    lastloginString:   '',
    createAtString:    '',
    createdAt:         '',
    updatedAt:         '',
    isDeleted:         false,
    isActive:          true,
    isDefaultPassword: false,
    dsoMasterId:       dsoMasterIdRaw  ? parseInt(dsoMasterIdRaw,  10) : null,
    dsoName:           claim(p, 'dsoName'),
    labMasterId:       labMasterIdRaw  ? parseInt(labMasterIdRaw,  10) : null,
    labName:           claim(p, 'labName'),
    // ── dsoDoctorId: "79" in your JWT screenshot ────────────────────
    dsoDoctorId:       dsoDoctorIdRaw  ? parseInt(dsoDoctorIdRaw,  10) : null,
  };
}

// ─── Sanitise a stored AuthUser ───────────────────────────────────
function sanitiseUser(user: AuthUser | null): AuthUser | null {
  if (!user) return null;
  const email = user.userEmail;
  if (Array.isArray(email)) {
    return { ...user, userEmail: String(email[0] ?? '') };
  }
  return user;
}

// ─── Persist helpers ──────────────────────────────────────────────
async function persistFullSession(token: string, user: AuthUser, portal: string | null) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  await Promise.all([
    KiduSecureStorage.setItem(KEYS.TOKEN,      token),
    KiduSecureStorage.setItem(KEYS.USER,       user),
    KiduSecureStorage.setItem(KEYS.USER_TYPE,  user.userTypeName),
    KiduSecureStorage.setItem(KEYS.EXPIRES_AT, expiresAt),
    KiduSecureStorage.setItem(KEYS.PORTAL,     portal ?? ''),
  ]);
  KiduSecureStorage.removeItem(KEYS.TEMP_TOKEN);
  _cache = { token, tempToken: null, user, userType: user.userTypeName, expiresAt, portal };
}

async function persistTempToken(token: string) {
  await KiduSecureStorage.setItem(KEYS.TEMP_TOKEN, token);
  _cache.tempToken = token;
}

// ─── Complete a SUCCESS login from a full-access token ────────────
function completeSessionFromToken(token: string, portal: string | null): boolean {
  const user = buildUserFromToken(token);
  if (!user) return false;
  persistFullSession(token, user, portal);
  return true;
}

// ─── AuthService ──────────────────────────────────────────────────
class AuthService {

  static async init(): Promise<void> {
    try {
      const [token, tempToken, user, userType, expiresAt, portal] = await Promise.all([
        KiduSecureStorage.getItem<string>(KEYS.TOKEN),
        KiduSecureStorage.getItem<string>(KEYS.TEMP_TOKEN),
        KiduSecureStorage.getItem<AuthUser>(KEYS.USER),
        KiduSecureStorage.getItem<string>(KEYS.USER_TYPE),
        KiduSecureStorage.getItem<string>(KEYS.EXPIRES_AT),
        KiduSecureStorage.getItem<string>(KEYS.PORTAL),
      ]);
      _cache = { token, tempToken, user: sanitiseUser(user), userType, expiresAt, portal };
    } catch {
      _cache = { token: null, tempToken: null, user: null, userType: null, expiresAt: null, portal: null };
    }
  }

  static async login(credentials: LoginRequest): Promise<LoginApiResponse> {
    const response = await HttpService.callApi<LoginApiResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      'POST',
      credentials,
      true
    );

    if (response.isSucess && response.value) {
      const dto = response.value as unknown as {
        authState: string;
        token: string | null;
        redirectPortal: string | null;
        resendAvailableInSeconds?: number | null;
      };

      if (dto.authState === 'SUCCESS' && dto.token) {
        const ok = completeSessionFromToken(dto.token, dto.redirectPortal ?? null);
        if (!ok) {
          return {
            ...response,
            isSucess: false,
            error: 'Login succeeded but user profile could not be read. Please contact support.',
            value: null,
          };
        }
      } else if (
        (dto.authState === 'REQUIRES_2FA' || dto.authState === 'REQUIRES_PWD_CHANGE') &&
        dto.token
      ) {
        await persistTempToken(dto.token);
      }
    }

    return response;
  }

  static async verifyOtp(data: VerifyOtpRequest): Promise<LoginApiResponse> {
    const response = await HttpService.callApi<LoginApiResponse>(
      API_ENDPOINTS.AUTH.VERIFY_OTP,
      'POST',
      data,
      false
    );

    if (response.isSucess && response.value) {
      const dto = response.value as unknown as {
        authState: string;
        token: string | null;
        redirectPortal: string | null;
      };
      if (dto.authState === 'SUCCESS' && dto.token) {
        completeSessionFromToken(dto.token, dto.redirectPortal ?? null);
      }
    }

    return response;
  }

  static async resendOtp(): Promise<LoginApiResponse> {
    return HttpService.callApi<LoginApiResponse>(
      API_ENDPOINTS.AUTH.RESEND_OTP,
      'POST',
      undefined,
      false
    );
  }

  static async changeDefaultPassword(data: ChangeDefaultPasswordRequest): Promise<LoginApiResponse> {
    const response = await HttpService.callApi<LoginApiResponse>(
      API_ENDPOINTS.AUTH.CHANGE_DEFAULT_PASSWORD,
      'POST',
      data,
      false
    );

    if (response.isSucess && response.value) {
      const dto = response.value as unknown as {
        authState: string;
        token: string | null;
        redirectPortal: string | null;
      };
      if (dto.authState === 'SUCCESS' && dto.token) {
        completeSessionFromToken(dto.token, dto.redirectPortal ?? null);
      }
    }

    return response;
  }

  static async register(data: RegisterRequest): Promise<RegisterApiResponse> {
    const response = await HttpService.callApi<RegisterApiResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      'POST',
      data,
      true
    );

    if (response.isSucess && response.value) {
      const val = response.value as unknown as { token: string; user: AuthUser };
      if (val?.token) {
        completeSessionFromToken(val.token, null);
      }
    }

    return response;
  }

  static async forgotPassword(data: ForgotPasswordRequest) {
    return HttpService.callApi(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, 'POST', data, true);
  }

  static async resetPassword(data: { token: string; email: string; newPassword: string }) {
    return HttpService.callApi(API_ENDPOINTS.AUTH.RESET_PASSWORD, 'POST', data, true);
  }

  static async changePassword(data: ChangePasswordRequest) {
    return HttpService.callApi(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, 'POST', data, false);
  }

  static logout(): void {
    _cache = { token: null, tempToken: null, user: null, userType: null, expiresAt: null, portal: null };
    Object.values(KEYS).forEach(key => KiduSecureStorage.removeItem(key));
  }

  static getToken(): string | null {
    return _cache.token ?? _cache.tempToken;
  }

  static getFullToken(): string | null {
    return _cache.token;
  }

  static getTempToken(): string | null {
    return _cache.tempToken;
  }

  static getUser(): AuthUser | null {
    return _cache.user;
  }

  static getUserTypeName(): string | null {
    return _cache.userType;
  }

  static isDefaultPassword(): boolean {
    return _cache.user?.isDefaultPassword ?? false;
  }

  static clearDefaultPasswordFlag(): void {
    if (_cache.user) {
      _cache.user = { ..._cache.user, isDefaultPassword: false };
      if (_cache.token && _cache.expiresAt) {
        persistFullSession(_cache.token, _cache.user, _cache.portal);
      }
    }
  }

  static isAuthenticated(): boolean {
    if (!_cache.token) return false;
    if (_cache.expiresAt && new Date() >= new Date(_cache.expiresAt)) {
      this.logout();
      return false;
    }
    if (!isValidUserTypeName(_cache.userType)) {
      this.logout();
      return false;
    }
    return true;
  }

  static hasTempToken(): boolean {
    return !!_cache.tempToken && !_cache.token;
  }

  static getDashboardRoute(): string {
    if (_cache.portal) {
      const route = getRouteFromPortalName(_cache.portal);
      if (route !== '/') return route;
    }
    return getDashboardRouteByType(_cache.userType ?? '');
  }
}

export default AuthService;