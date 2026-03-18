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

// ─── Persist helpers ──────────────────────────────────────────────

async function persistFullSession(token: string, user: AuthUser, portal: string | null) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  // Update in-memory cache FIRST — synchronous, always reflects latest state
  _cache = { token, tempToken: null, user, userType: user.userTypeName, expiresAt, portal };
  // Then persist to encrypted storage
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
  // Update in-memory cache FIRST so hasTempToken() returns true immediately
  // without waiting for the async encrypted storage write to complete.
  // This prevents race conditions where a component mounts and checks
  // hasTempToken() before the storage write has resolved.
  _cache.tempToken = token;
  _cache.token = null; // clear any full token when entering a temp-token flow
  await KiduSecureStorage.setItem(KEYS.TEMP_TOKEN, token);
  KiduSecureStorage.removeItem(KEYS.TOKEN);
}

// ─── Fetch /me and complete session ──────────────────────────────
async function completeSessionFromMe(token: string, portal: string | null): Promise<boolean> {
  try {
    // Put token in cache so getToken() returns it for the /me Authorization header
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

    if (response.isSucess && response.value) {
      const dto = response.value as unknown as {
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
            error: 'Login succeeded but user profile could not be loaded. Please try again.',
            value: null,
          };
        }
      } else if (
        dto.authState === 'REQUIRES_2FA'      ||
        dto.authState === 'REQUIRES_PWD_CHANGE' ||
        dto.authState === 'REQUIRES_CONSENT'
      ) {
        // persistTempToken updates _cache.tempToken synchronously BEFORE
        // the navigate() call in LoginForm, so hasTempToken() is true
        // the moment the target component mounts.
        if (dto.token) await persistTempToken(dto.token);
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
        await completeSessionFromMe(dto.token, dto.redirectPortal ?? null);
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
        await completeSessionFromMe(dto.token, dto.redirectPortal ?? null);
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
        await completeSessionFromMe(val.token, null);
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