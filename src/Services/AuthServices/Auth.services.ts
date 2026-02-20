// src/Services/Auth/AuthService.ts

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

// ─── localStorage keys ────────────────────────────────────────────
const KEYS = {
  TOKEN:      'jwt_token',
  USER:       'auth_user',
  USER_TYPE:  'user_type_name',
  EXPIRES_AT: 'token_expires_at',
} as const;

// ─── AuthService ──────────────────────────────────────────────────
class AuthService {

  // ── Login ─────────────────────────────────────────────────────────
  static async login(credentials: LoginRequest): Promise<LoginApiResponse> {
    const response = await HttpService.callApi<LoginApiResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      'POST',
      credentials,
      true  // isPublic — no token needed
    );

    if (response.isSucess && response.value) {
      const { token, expiresAt, user } = response.value;

      // Validate userTypeName is one we recognise
      if (!isValidUserTypeName(user.userTypeName)) {
        return {
          ...response,
          isSucess: false,
          error: `Unknown user type: "${user.userTypeName}". Please contact administrator.`,
          value: null,
        };
      }

      // Persist auth data
      localStorage.setItem(KEYS.TOKEN,      token);
      localStorage.setItem(KEYS.USER,       JSON.stringify(user));
      localStorage.setItem(KEYS.USER_TYPE,  user.userTypeName);
      localStorage.setItem(KEYS.EXPIRES_AT, expiresAt);
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
      localStorage.setItem(KEYS.TOKEN,      token);
      localStorage.setItem(KEYS.USER,       JSON.stringify(user));
      localStorage.setItem(KEYS.USER_TYPE,  user.userTypeName);
      localStorage.setItem(KEYS.EXPIRES_AT, expiresAt);
    }

    return response;
  }

  // ── Forgot Password ───────────────────────────────────────────────
  static async forgotPassword(data: ForgotPasswordRequest): Promise<LoginApiResponse> {
    return HttpService.callApi<LoginApiResponse>(
      API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
      'POST',
      data,
      true
    );
  }

  // ── Change Password ───────────────────────────────────────────────
  static async changePassword(data: ChangePasswordRequest): Promise<LoginApiResponse> {
    return HttpService.callApi<LoginApiResponse>(
      API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
      'POST',
      data
    );
  }

  // ── Logout ────────────────────────────────────────────────────────
  static logout(): void {
    Object.values(KEYS).forEach(key => localStorage.removeItem(key));
  }

  // ── Getters ───────────────────────────────────────────────────────
  static getToken(): string | null {
    return localStorage.getItem(KEYS.TOKEN);
  }

  static getUserTypeName(): string | null {
    return localStorage.getItem(KEYS.USER_TYPE);
  }

  static getUser(): AuthUser | null {
    try {
      const raw = localStorage.getItem(KEYS.USER);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  }

  // ── isAuthenticated ───────────────────────────────────────────────
  static isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    // Token expiry check
    const expiresAt = localStorage.getItem(KEYS.EXPIRES_AT);
    if (expiresAt && new Date() >= new Date(expiresAt)) {
      this.logout();
      return false;
    }

    // userTypeName must be valid
    if (!isValidUserTypeName(this.getUserTypeName())) {
      this.logout();
      return false;
    }

    return true;
  }

  // ── getDashboardRoute ─────────────────────────────────────────────
  static getDashboardRoute(): string {
    return getDashboardRouteByType(this.getUserTypeName() ?? '');
  }
}

export default AuthService;