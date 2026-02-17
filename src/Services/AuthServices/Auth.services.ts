import { API_ENDPOINTS } from "../../CONSTANTS/API_ENDPOINTS";
import { isValidUserRole, type ForgotPasswordRequest, type LoginRequest, type LoginResponse, type RegisterRequest } from "../../Types/Auth/Auth.types";
import type { CustomResponse } from "../../Types/Common/ApiTypes";
import HttpService from "../Common/HttpService";

class AuthService {
  static async login(credentials: LoginRequest): Promise<CustomResponse<LoginResponse>> {
    try {
      const response = await HttpService.callApi<CustomResponse<LoginResponse>>(
        API_ENDPOINTS.AUTH.LOGIN,
        "POST",
        credentials,
        true // isPublic - no token needed for login
      );

      console.log('API Response:', response);

      // Store token in localStorage if login successful
      if (response.isSucess && response.value) {
        console.log('Login successful, storing data...');

        // Validate user role before storing
        if (!response.value.user || !isValidUserRole(response.value.user.role)) {
          console.error('Invalid or missing user role');
          return {
            ...response,
            isSucess: false,
            error: 'Invalid user role. Please contact administrator.',
            customMessage: 'User role not recognized'
          };
        }

        // Store token
        if (response.value.token) {
          localStorage.setItem('jwt_token', response.value.token);
          console.log('Token stored:', localStorage.getItem('jwt_token') !== null);
        }

        // Store user data
        if (response.value.user) {
          const userString = JSON.stringify(response.value.user);
          localStorage.setItem('user', userString);
          console.log('User stored:', localStorage.getItem('user') !== null);
          console.log('Stored user data:', localStorage.getItem('user'));

          // Store user role separately for easy access
          localStorage.setItem('user_role', response.value.user.role);
          console.log('User role stored:', response.value.user.role);

          // ✅ Store memberId separately for easy access (if available)
          if (response.value.user.memberId) {
            localStorage.setItem('member_id', response.value.user.memberId.toString());
            console.log('Member ID stored:', response.value.user.memberId);
          }

          // ✅ Store staffNo separately for easy access
          if (response.value.user.staffNo) {
            localStorage.setItem('staff_no', response.value.user.staffNo.toString());
            console.log('Staff No stored:', response.value.user.staffNo);
          }
        }

        // Store token expiry
        if (response.value.expiresAt) {
          localStorage.setItem('token_expires_at', response.value.expiresAt);
          console.log('Expiry stored:', localStorage.getItem('token_expires_at') !== null);
        }

        // Verify storage
        console.log('Storage verification:');
        console.log('- jwt_token exists:', !!localStorage.getItem('jwt_token'));
        console.log('- user exists:', !!localStorage.getItem('user'));
        console.log('- user_role exists:', !!localStorage.getItem('user_role'));
        console.log('- member_id exists:', !!localStorage.getItem('member_id'));
        console.log('- staff_no exists:', !!localStorage.getItem('staff_no'));
        console.log('- token_expires_at exists:', !!localStorage.getItem('token_expires_at'));
      } else {
        console.error('Login failed - response not successful or no value');
      }

      return response;
    } catch (error) {
      console.error('Login error in AuthService:', error);
      throw error;
    }
  }

  static logout(): void {
    console.log('Logging out...');
    console.log('Before logout - jwt_token:', localStorage.getItem('jwt_token') !== null);
    console.log('Before logout - user:', localStorage.getItem('user') !== null);
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user');
    localStorage.removeItem('user_role');
    localStorage.removeItem('member_id'); // ✅ Clear memberId
    localStorage.removeItem('staff_no'); // ✅ Clear staffNo
    localStorage.removeItem('token_expires_at');
    console.log('After logout - jwt_token:', localStorage.getItem('jwt_token') !== null);
    console.log('After logout - user:', localStorage.getItem('user') !== null);
    console.log('Logout complete');
  }

  static getCurrentUser(): any | null {
    try {
      const userStr = localStorage.getItem('user');
      console.log('Getting current user, raw string:', userStr);

      if (!userStr) {
        console.log('No user found in localStorage');
        return null;
      }

      const user = JSON.parse(userStr);
      console.log('Parsed user:', user);

      // Validate that parsed user has a valid role
      if (!isValidUserRole(user?.role)) {
        console.error('Stored user has invalid role, clearing storage');
        this.logout();
        return null;
      }
      return user;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
  }

  static getUserRole(): string | null {
    try {
      const role = localStorage.getItem('user_role');
      console.log('Getting user role:', role);

      // Validate role
      if (!isValidUserRole(role)) {
        console.error('Invalid user role found, clearing storage');
        this.logout();
        return null;
      }

      return role;
    } catch (error) {
      console.error('Error getting user role from localStorage:', error);
      return null;
    }
  }

  // ✅ NEW METHOD - Get memberId for current user
  static getMemberId(): number | null {
    try {
      const memberIdStr = localStorage.getItem('member_id');
      console.log('Getting member ID:', memberIdStr);

      if (!memberIdStr) {
        // Try getting from user object as fallback
        const user = this.getCurrentUser();
        if (user?.memberId) {
          console.log('Member ID found in user object:', user.memberId);
          return user.memberId;
        }
        console.log('No member ID found');
        return null;
      }
      const memberId = parseInt(memberIdStr, 10);
      return isNaN(memberId) ? null : memberId;
    } catch (error) {
      console.error('Error getting member ID:', error);
      return null;
    }
  }
  // ✅ NEW METHOD - Get staffNo for current user
  static getStaffNo(): number | null {
    try {
      const staffNoStr = localStorage.getItem('staff_no');
      console.log('Getting staff number:', staffNoStr);

      if (!staffNoStr) {
        // Try getting from user object as fallback
        const user = this.getCurrentUser();
        if (user?.staffNo) {
          console.log('Staff number found in user object:', user.staffNo);
          return user.staffNo;
        }
        console.log('No staff number found');
        return null;
      }

      const staffNo = parseInt(staffNoStr, 10);
      return isNaN(staffNo) ? null : staffNo;
    } catch (error) {
      console.error('Error getting staff number:', error);
      return null;
    }
  }

  static getToken(): string | null {
    const token = localStorage.getItem('jwt_token');
    console.log('Getting token, exists:', token !== null);
    return token;
  }

  static isAuthenticated(): boolean {
    const token = localStorage.getItem('jwt_token');
    console.log('Checking authentication, token exists:', token !== null);

    if (!token) {
      console.log('Not authenticated - no token');
      return false;
    }

    // Check if user role is valid
    const role = localStorage.getItem('user_role');
    if (!isValidUserRole(role)) {
      console.log('Not authenticated - invalid or missing role');
      this.logout();
      return false;
    }

    // Check if token is expired
    const expiresAt = localStorage.getItem('token_expires_at');
    if (expiresAt) {
      const expiryDate = new Date(expiresAt);
      const now = new Date();
      console.log('Token expiry check:', { expiryDate, now, expired: now >= expiryDate });

      if (now >= expiryDate) {
        console.log('Token expired, logging out');
        this.logout();
        return false;
      }
    }

    console.log('User is authenticated');
    return true;
  }

  /**
   * Get the appropriate dashboard route based on user role
   * @returns The dashboard route path
   */
  static getDashboardRoute(): string {
    const role = this.getUserRole();
    console.log('Determining dashboard route for role:', role);

    if (!role) {
      console.warn('No role found, cannot determine dashboard');
      return '/';
    }

    const normalizedRole = role.trim().toLowerCase();

    switch (normalizedRole) {
      case 'staff':
        console.log('Routing to Staff Portal');
        return '/staff-portal';

      case 'admin user':
      case 'adminuser':
        console.log('Routing to Admin Dashboard');
        return '/dashboard';

      case 'super admin':
      case 'superadmin':
        console.log('Routing to Admin Dashboard (Super Admin)');
        return '/dashboard';

      default:
        console.warn(`Unknown role: ${role}, redirecting to home`);
        return '/';
    }
  }

  /**
   * Check if user has admin privileges (Admin User or Super Admin)
   * @returns boolean indicating if user is admin
   */
  static isAdmin(): boolean {
    const role = this.getUserRole();
    if (!role) return false;

    const normalizedRole = role.trim().toLowerCase();
    return normalizedRole === 'admin user' ||
      normalizedRole === 'adminuser' ||
      normalizedRole === 'super admin' ||
      normalizedRole === 'superadmin';
  }

  /**
   * Check if user is staff
   * @returns boolean indicating if user is staff
   */
  static isStaff(): boolean {
    const role = this.getUserRole();
    if (!role) return false;

    return role.trim().toLowerCase() === 'staff';
  }

  /**
   * Check if user is super admin
   * @returns boolean indicating if user is super admin
   */
  static isSuperAdmin(): boolean {
    const role = this.getUserRole();
    if (!role) return false;

    const normalizedRole = role.trim().toLowerCase();
    return normalizedRole === 'super admin' || normalizedRole === 'superadmin';
  }

  // change-password
  static async changePassword(currentPassword: string, newPassword: string): Promise<CustomResponse<any>> {
    try {
      const payload = { currentPassword, newPassword };
      const response = await HttpService.callApi<CustomResponse<any>>(
        API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
        "POST",
        payload
      );
      return response;
    } catch (error) {
      console.error("Change password error:", error);
      throw error;
    }
  }

  //forgot-password
  static async forgotPassword(data: ForgotPasswordRequest): Promise<CustomResponse<void>> {
    return await HttpService.callApi<CustomResponse<void>>(
      API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
      "POST",
      data,
      true // public endpoint (no token required)
    );
  }

  /*  REGISTER API (ADDED) */
  static async register(
    data: RegisterRequest
  ): Promise<CustomResponse<LoginResponse>> {
    return await HttpService.callApi<CustomResponse<LoginResponse>>(
      API_ENDPOINTS.AUTH.REGISTER,
      "POST",
      data,
      true
    );
  }
}

export default AuthService;