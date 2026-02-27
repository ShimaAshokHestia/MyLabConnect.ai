// src/Services/Common/HttpService.ts

import AuthService from '../AuthServices/Auth.services';
import type { CustomApiResponse } from '../../Types/Auth/Auth.types';

export class HttpService {
  static async callApi<T = CustomApiResponse>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET',
    data?: any,
    isPublic: boolean = false,
    isFormData: boolean = false
  ): Promise<T> {
    const headers: Record<string, string> = {};

    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    // Use AuthService.getToken() — returns full token OR temp token as needed
    if (!isPublic) {
      const token = AuthService.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const response = await fetch(endpoint, {
      method,
      headers,
      body: method !== 'GET' ? (isFormData ? data : JSON.stringify(data)) : undefined,
    });

    // ✅ KEY FIX: For error HTTP status codes, try to parse the JSON body first.
    // The backend ALWAYS returns { statusCode, isSucess, error, customMessage }
    // even on 400/401/404/500. Return that object so callers can check isSucess
    // and customMessage — don't throw a raw error string.
    if (!response.ok) {
      if (response.status === 401 && !AuthService.hasTempToken()) {
        AuthService.logout();
      }

      const contentType = response.headers.get('content-type') ?? '';
      if (contentType.includes('application/json')) {
        try {
          const errorBody = await response.json();
          return errorBody as T;
        } catch {
          // fall through
        }
      }

      const errorText = await response.text();
      throw new Error(`Error: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  static async downloadFile(url: string, fileName: string): Promise<void> {
    const token = AuthService.getToken();
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(url, { headers });
    if (!response.ok) throw new Error(`Download error: ${response.status}`);

    const blob = await response.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
  }
}

export default HttpService;