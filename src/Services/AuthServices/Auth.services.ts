// src/Services/AuthServices/Auth.services.ts
//
// ─── Auth Flow ────────────────────────────────────────────────────────────────
//
// LOGIN FLOW:
//   POST /Auth/login → { authState, token, redirectPortal? }
//
//   SUCCESS           → decode JWT claims to get user (no extra /me call needed)
//   REQUIRES_2FA      → store temp token, navigate to /verify-otp
//   REQUIRES_PWD_CHANGE → store temp token, navigate to /force-change-password
//
//   POST /Auth/verify-otp → { authState: "SUCCESS", token, redirectPortal }
//     → same: decode JWT → store session
//
//   POST /Auth/change-default-password → { authState: "SUCCESS", token, ... }
//     → same: decode JWT → store session
//
// WHY decode instead of calling /me:
//   The backend's GenerateToken() embeds all needed claims (uid, username, email,
//   companyId, userTypeName, dsoMasterId, etc.) directly in the JWT payload.
//   Decoding avoids an extra network round-trip and removes the failure mode
//   where /me returns 404 if the token isn't in the Authorization header yet.
// ─────────────────────────────────────────────────────────────────────────────

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
// Safely decode the base64url JWT payload without any library.
function decodeJwtPayload(token: string): Record<string, any> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    // Base64url → base64 → decode
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

// ─── Build AuthUser from JWT claims ───────────────────────────────
// Claim names must match JwtService.GenerateToken() exactly.
function buildUserFromToken(token: string): AuthUser | null {
  const p = decodeJwtPayload(token);
  if (!p) return null;

  // sub / uid both hold userId
  const id = parseInt(p['uid'] ?? p['sub'] ?? '0', 10);
  const userTypeName = p['userTypeName'] ?? '';

  if (!id || !isValidUserTypeName(userTypeName)) return null;

  return {
    id,
    userName:          p['username']          ?? '',
    userEmail:         p['email']             ?? '',
    phoneNumber:       p['phone']             ?? '',
    address:           '',
    islocked:          p['isLocked'] === 'True' || p['isLocked'] === true,
    companyId:         parseInt(p['companyId'] ?? '0', 10),
    companyName:       '',           // not in token; populated via /me if needed
    userTypeId:        parseInt(p['userTypeId'] ?? '0', 10),
    userTypeName,
    lastlogin:         '',
    lastloginString:   '',
    createAtString:    '',
    createdAt:         '',
    updatedAt:         '',
    isDeleted:         false,
    isActive:          true,
    isDefaultPassword: false,        // already changed by this point for SUCCESS
    dsoMasterId:       p['dsoMasterId'] ? parseInt(p['dsoMasterId'], 10) : null,
    dsoName:           p['dsoName']    ?? '',
    labMasterId:       p['labMasterId'] ? parseInt(p['labMasterId'], 10) : null,
    labName:           p['labName']    ?? '',
  };
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
  // Fire-and-forget persist (synchronous cache update is what matters for navigation)
  persistFullSession(token, user, portal);
  return true;
}

// ─── AuthService ──────────────────────────────────────────────────
class AuthService {

  // ── init ──────────────────────────────────────────────────────────
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
      _cache = { token, tempToken, user, userType, expiresAt, portal };
    } catch {
      _cache = { token: null, tempToken: null, user: null, userType: null, expiresAt: null, portal: null };
    }
  }

  // ── Login ─────────────────────────────────────────────────────────
  static async login(credentials: LoginRequest): Promise<LoginApiResponse> {
    const response = await HttpService.callApi<LoginApiResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      'POST',
      credentials,
      true // public — no auth header
    );

    if (response.isSucess && response.value) {
      const dto = response.value as unknown as {
        authState: string;
        token: string | null;
        redirectPortal: string | null;
        resendAvailableInSeconds?: number | null;
      };

      if (dto.authState === 'SUCCESS' && dto.token) {
        // ✅ Decode JWT — no /me call needed
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
        // Store temp token — NO /me call, user not fully authenticated yet
        await persistTempToken(dto.token);
      }
    }

    return response;
  }

  // ── Verify OTP (2FA) ──────────────────────────────────────────────
  static async verifyOtp(data: VerifyOtpRequest): Promise<LoginApiResponse> {
    const response = await HttpService.callApi<LoginApiResponse>(
      API_ENDPOINTS.AUTH.VERIFY_OTP,
      'POST',
      data,
      false // sends temp MFA token via Authorization header
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

  // ── Resend OTP ────────────────────────────────────────────────────
  static async resendOtp(): Promise<LoginApiResponse> {
    return HttpService.callApi<LoginApiResponse>(
      API_ENDPOINTS.AUTH.RESEND_OTP,
      'POST',
      undefined,
      false
    );
  }

  // ── Change Default Password (forced) ─────────────────────────────
  static async changeDefaultPassword(data: ChangeDefaultPasswordRequest): Promise<LoginApiResponse> {
    const response = await HttpService.callApi<LoginApiResponse>(
      API_ENDPOINTS.AUTH.CHANGE_DEFAULT_PASSWORD,
      'POST',
      data,
      false // sends temp PasswordReset token
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

  // ── Register ──────────────────────────────────────────────────────
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

  // ── Forgot / Reset / Change Password ──────────────────────────────
  static async forgotPassword(data: ForgotPasswordRequest) {
    return HttpService.callApi(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, 'POST', data, true);
  }

  static async resetPassword(data: { token: string; email: string; newPassword: string }) {
    return HttpService.callApi(API_ENDPOINTS.AUTH.RESET_PASSWORD, 'POST', data, true);
  }

  static async changePassword(data: ChangePasswordRequest) {
    return HttpService.callApi(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, 'POST', data, false);
  }

  // ── Logout ────────────────────────────────────────────────────────
  static logout(): void {
    _cache = { token: null, tempToken: null, user: null, userType: null, expiresAt: null, portal: null };
    Object.values(KEYS).forEach(key => KiduSecureStorage.removeItem(key));
  }

  // ── Getters ───────────────────────────────────────────────────────

  /** Returns full token if authenticated, temp token if mid-2FA/pwd-change */
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