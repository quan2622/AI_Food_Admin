/* ============================================================================
 * BACKEND RESPONSE WRAPPER TYPES
 * ========================================================================== */

export interface ApiResponse<T = unknown> {
  metadata: {
    statusCode: number;
    message: string;
    EC: number;
    timestamp?: string;
    path?: string;
  };
  data: T;
}

export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  error?: string;
  EC: number;
  timestamp?: string;
  path?: string;
}

/* ─────────────────────────────────────────────────────────────────────────
   PAGINATION
   ───────────────────────────────────────────────────────────────────────── */

export interface PaginationParams {
  page?: number;
  limit?: number;
  skip?: number;
  take?: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
}

/* ─────────────────────────────────────────────────────────────────────────
   ERROR CODES
   ───────────────────────────────────────────────────────────────────────── */

export const ErrorCodes = {
  SUCCESS: 0,
  BAD_REQUEST: 1,
  UNAUTHORIZED: 2,
  FORBIDDEN: 3,
  NOT_FOUND: 4,
  CONFLICT: 5,
  UNPROCESSABLE_ENTITY: 6,
  TOO_MANY_REQUESTS: 7,
  INTERNAL_SERVER_ERROR: 99,
  BAD_GATEWAY: 98,
  SERVICE_UNAVAILABLE: 97,
} as const;
