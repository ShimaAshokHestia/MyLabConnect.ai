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

const SESSION_SENTINEL = 'mlc_session_active';

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

// ─── Persist helpers ──────────────────────────────────────────────

async function persistFullSession(token: string, user: AuthUser, portal: string | null) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  // Update cache synchronously first — any code after this sees new state immediately
  _cache = { token, tempToken: null, user, userType: user.userTypeName, expiresAt, portal };
  sessionStorage.setItem(SESSION_SENTINEL, '1');
  await Promise.all([
    KiduSecureStorage.setItem(KEYS.TOKEN,      token),
    KiduSecureStorage.setItem(KEYS.USER,       user),
    KiduSecureStorage.setItem(KEYS.USER_TYPE,  user.userTypeName),
    KiduSecureStorage.setItem(KEYS.EXPIRES_AT, expiresAt),
    KiduSecureStorage.setItem(KEYS.PORTAL,     portal ?? ''),
  ]);
  KiduSecureStorage.removeItem(KEYS.TEMP_TOKEN);
}

async function persistTempToken(token: string) {
  // Update cache synchronously FIRST so hasTempToken() returns true immediately
  // before navigate() fires and the target component mounts.
  _cache.tempToken = token;
  _cache.token     = null;
  await KiduSecureStorage.setItem(KEYS.TEMP_TOKEN, token);
  KiduSecureStorage.removeItem(KEYS.TOKEN);
}

// ─── Fetch /me and complete session ──────────────────────────────
async function completeSessionFromMe(token: string, portal: string | null): Promise<boolean> {
  try {
    _cache.token = token;

    const meResponse = await HttpService.callApi<any>(
      API_ENDPOINTS.AUTH.ME,
      'GET',
      undefined,
      false
    );

    if (!meResponse?.isSucess || !meResponse.value) {
      _cache.token = null;
      return false;
    }

    const user = meResponse.value as AuthUser;
    if (!user || !isValidUserTypeName(user.userTypeName)) {
      _cache.token = null;
      return false;
    }

    await persistFullSession(token, user, portal);
    return true;
  } catch {
    _cache.token = null;
    return false;
  }
}

// ─── Handle any auth chain response ──────────────────────────────
// Shared logic for processing authState responses from any endpoint
// that participates in the login chain (login, changeDefaultPassword,
// verifyOtp). Returns the original response unchanged — callers use
// the authState to decide navigation.
async function processAuthChainResponse(
  response: any,
  successErrorMsg: string
): Promise<any> {
  if (!response.isSucess || !response.value) return response;

  const dto = response.value as {
    authState: string;
    token: string | null;
    redirectPortal: string | null;
    resendAvailableInSeconds?: number | null;
  };

  if (dto.authState === 'SUCCESS' && dto.token) {
    const ok = await completeSessionFromMe(dto.token, dto.redirectPortal ?? null);
    if (!ok) {
      return {
        ...response,
        isSucess: false,
        error: successErrorMsg,
        value: null,
      };
    }
  } else if (
    dto.authState === 'REQUIRES_2FA'        ||
    dto.authState === 'REQUIRES_PWD_CHANGE' ||
    dto.authState === 'REQUIRES_CONSENT'      // ← THIS is the key fix
  ) {
    // Always replace the current temp token with the new one returned
    // by the backend. Each gate issues a new purpose-scoped token.
    // e.g. PasswordReset → Consent_Pending → MFA_Pending
    // If we don't replace it, the old token (wrong purpose) gets sent
    // to the next endpoint and the backend returns "Invalid token purpose."
    if (dto.token) await persistTempToken(dto.token);
  }

  return response;
}

// ─── AuthService ──────────────────────────────────────────────────
class AuthService {

  static async init(): Promise<void> {
    try {
      const sentinelPresent = !!sessionStorage.getItem(SESSION_SENTINEL);

      if (!sentinelPresent) {
        Object.values(KEYS).forEach(k => KiduSecureStorage.removeItem(k));
        _cache = { token: null, tempToken: null, user: null, userType: null, expiresAt: null, portal: null };
        return;
      }

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

  static async login(credentials: LoginRequest): Promise<LoginApiResponse> {
    const response = await HttpService.callApi<LoginApiResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      'POST',
      credentials,
      true
    );
    return processAuthChainResponse(
      response,
      'Login succeeded but user profile could not be loaded. Please try again.'
    );
  }

  static async verifyOtp(data: VerifyOtpRequest): Promise<LoginApiResponse> {
    const response = await HttpService.callApi<LoginApiResponse>(
      API_ENDPOINTS.AUTH.VERIFY_OTP,
      'POST',
      data,
      false
    );
    return processAuthChainResponse(
      response,
      'OTP verified but user profile could not be loaded. Please try again.'
    );
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
    // processAuthChainResponse handles all three cases:
    // SUCCESS       → call /me, complete session
    // REQUIRES_CONSENT → replace PasswordReset token with new Consent_Pending token ← THE FIX
    // REQUIRES_2FA  → replace with new MFA_Pending token
    return processAuthChainResponse(
      response,
      'Password changed but user profile could not be loaded. Please try again.'
    );
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
      if (val?.token) await completeSessionFromMe(val.token, null);
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
    sessionStorage.removeItem(SESSION_SENTINEL);
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