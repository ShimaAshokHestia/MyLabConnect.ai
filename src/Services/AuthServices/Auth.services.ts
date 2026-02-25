// src/Services/AuthServices/Auth.services.ts
//
// ─── Hybrid: Encrypted localStorage + Sync In-Memory Cache ───────────────────
//
// HOW IT WORKS:
//   • All data is AES-GCM encrypted in localStorage via KiduSecureStorage.
//   • An in-memory cache (_cache) holds a plain copy for synchronous access.
//   • On login  → cache is filled instantly, then encrypted to localStorage.
//   • On refresh → AuthService.init() decrypts localStorage back into cache.
//   • getUser(), getToken(), getUserTypeName(), isAuthenticated(),
//     getDashboardRoute() are ALL still synchronous — zero config changes needed.
//
// SETUP (one line in main.tsx, before ReactDOM.render):
//   await AuthService.init();
//   ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
// ─────────────────────────────────────────────────────────────────────────────

import { API_ENDPOINTS } from '../../CONSTANTS/API_ENDPOINTS';
import HttpService from '../Common/HttpService';
import {
  getDashboardRouteByType,
  isValidUserTypeName,
  type AuthUser,
  type ChangePasswordRequest,
  type ForgotPasswordRequest,
  type LoginApiResponse,
  type LoginRequest,
  type RegisterRequest,
} from '../../Types/Auth/Auth.types';
import KiduSecureStorage from '../Common/KiduSecureStorage';

// ─── Storage keys ─────────────────────────────────────────────────
const KEYS = {
  TOKEN:      'jwt_token',
  USER:       'auth_user',
  USER_TYPE:  'user_type_name',
  EXPIRES_AT: 'token_expires_at',
} as const;

// ─── In-memory cache ──────────────────────────────────────────────
// Survives re-renders. Cleared on page refresh (repopulated by init()).
interface AuthCache {
  token:     string | null;
  user:      AuthUser | null;
  userType:  string | null;
  expiresAt: string | null;
}

let _cache: AuthCache = {
  token:     null,
  user:      null,
  userType:  null,
  expiresAt: null,
};

// ─── Helpers ──────────────────────────────────────────────────────
async function persistToStorage(token: string, user: AuthUser, expiresAt: string) {
  await Promise.all([
    KiduSecureStorage.setItem(KEYS.TOKEN,      token),
    KiduSecureStorage.setItem(KEYS.USER,       user),
    KiduSecureStorage.setItem(KEYS.USER_TYPE,  user.userTypeName),
    KiduSecureStorage.setItem(KEYS.EXPIRES_AT, expiresAt),
  ]);
}

// ─── AuthService ──────────────────────────────────────────────────
class AuthService {

  // ── init ──────────────────────────────────────────────────────────
  /**
   * Call ONCE at app startup in main.tsx BEFORE ReactDOM.render().
   * Decrypts localStorage into memory so synchronous getters work immediately.
   *
   * main.tsx example:
   *   import AuthService from './Services/AuthServices/Auth.services';
   *
   *   AuthService.init().then(() => {
   *     ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
   *   });
   */
  static async init(): Promise<void> {
    try {
      const [token, user, userType, expiresAt] = await Promise.all([
        KiduSecureStorage.getItem<string>(KEYS.TOKEN),
        KiduSecureStorage.getItem<AuthUser>(KEYS.USER),
        KiduSecureStorage.getItem<string>(KEYS.USER_TYPE),
        KiduSecureStorage.getItem<string>(KEYS.EXPIRES_AT),
      ]);
      _cache = { token, user, userType, expiresAt };
    } catch {
      _cache = { token: null, user: null, userType: null, expiresAt: null };
    }
  }

  // ── Login ─────────────────────────────────────────────────────────
  static async login(credentials: LoginRequest): Promise<LoginApiResponse> {
    const response = await HttpService.callApi<LoginApiResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      'POST',
      credentials,
      true
    );

    if (response.isSucess && response.value) {
      const { token, expiresAt, user } = response.value;

      if (!isValidUserTypeName(user.userTypeName)) {
        return {
          ...response,
          isSucess: false,
          error: `Unknown user type: "${user.userTypeName}". Please contact administrator.`,
          value: null,
        };
      }

      // Fill cache immediately — synchronous getters work right away
      _cache = { token, user, userType: user.userTypeName, expiresAt };

      // Encrypt and persist to localStorage in the background
      await persistToStorage(token, user, expiresAt);
    }

    return response;
  }

  // ── Register ──────────────────────────────────────────────────────
  static async register(data: RegisterRequest): Promise<LoginApiResponse> {
    const response = await HttpService.callApi<LoginApiResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      'POST',
      data,
      true
    );

    if (response.isSucess && response.value) {
      const { token, expiresAt, user } = response.value;
      _cache = { token, user, userType: user.userTypeName, expiresAt };
      await persistToStorage(token, user, expiresAt);
    }

    return response;
  }

  // ── Forgot / Change Password ──────────────────────────────────────
  static async forgotPassword(data: ForgotPasswordRequest): Promise<LoginApiResponse> {
    return HttpService.callApi<LoginApiResponse>(
      API_ENDPOINTS.AUTH.FORGOT_PASSWORD, 'POST', data, true
    );
  }

  static async changePassword(data: ChangePasswordRequest): Promise<LoginApiResponse> {
    return HttpService.callApi<LoginApiResponse>(
      API_ENDPOINTS.AUTH.CHANGE_PASSWORD, 'POST', data
    );
  }

  // ── Logout ────────────────────────────────────────────────────────
  static logout(): void {
    _cache = { token: null, user: null, userType: null, expiresAt: null };
    Object.values(KEYS).forEach(key => KiduSecureStorage.removeItem(key));
  }

  // ── Synchronous Getters ── (API is IDENTICAL to the original) ─────

  /** Returns the cached JWT token synchronously. */
  static getToken(): string | null {
    return _cache.token;
  }

  /** Returns the cached userTypeName synchronously. */
  static getUserTypeName(): string | null {
    return _cache.userType;
  }

  /**
   * Returns the cached AuthUser synchronously.
   * AppAdminLayoutConfig getter works without any changes:
   *
   *   get user(): UserProfile {
   *     const u = AuthService.getUser(); ✅ still sync, zero changes
   *     return { name: u?.userName ?? 'App Admin', ... };
   *   }
   */
  static getUser(): AuthUser | null {
    return _cache.user;
  }

  /** Synchronous auth check — identical behaviour to original. */
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

  /** Synchronous route resolver — identical to original. */
  static getDashboardRoute(): string {
    return getDashboardRouteByType(_cache.userType ?? '');
  }
}

export default AuthService;