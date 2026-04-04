/* ============================================================================
 * AUTHEN TYPES – Admin Panel
 * APIs: POST /auth/login | POST /auth/refresh-token | POST /auth/logout | GET /users/me
 * ========================================================================== */

// ─── Token Data ───────────────────────────────────────────────────────────────

export interface IAuthTokenData {
  access_token: string;
  refresh_token: string;
}

// ─── User (No Password) ───────────────────────────────────────────────────────

export interface IUser {
  id: number;
  email: string;
  avatarUrl?: string | null;
  fullName: string;
  dateOfBirth?: string | null;
  isAdmin: boolean;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  accessToken?: string | null;
  refreshToken?: string | null;
}

// ─── JWT Payload ──────────────────────────────────────────────────────────────

export interface IUserAuthPayload {
  id: number;
  email: string;
  isAdmin: boolean;
}

// ─── Request Bodies ───────────────────────────────────────────────────────────

export interface ILoginRequest {
  email: string;
  password: string;
}
