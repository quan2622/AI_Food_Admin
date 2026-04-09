/* ============================================================================
 * USER SUBMISSION TYPES
 * ========================================================================== */

export type SubmissionType = "REPORT" | "CONTRIBUTION";

export type SubmissionCategory =
  | "WRONG_INFO"
  | "BAD_IMAGE"
  | "NEW_FOOD"
  | "DUPLICATE";

export type SubmissionStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface ISubmissionUser {
  id: number;
  fullName: string;
  email: string;
  avatarUrl?: string;
}

export interface ISubmissionTargetFood {
  id: number;
  foodName: string;
  imageUrl?: string;
  nutritionProfile?: {
    values: Array<{
      nutrient: { name: string };
      value: number;
    }>;
  };
}

export interface IUserSubmission {
  id: number;
  userId?: number;
  type: SubmissionType;
  category: SubmissionCategory;
  payload: Record<string, unknown>;
  description?: string;
  status: SubmissionStatus;
  adminNote?: string;
  upvotes: number;
  downvotes: number;
  reliabilityScore: number;
  targetFoodId?: number;
  user?: ISubmissionUser;
  targetFood?: ISubmissionTargetFood | null;
  createdAt: string;
  updatedAt?: string;
}

export interface ISubmissionStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  reports: number;
  contributions: number;
}

/* ─── Request / Response DTOs ─────────────────────────────────────── */

export interface ISubmissionListParams {
  type?: SubmissionType;
  category?: SubmissionCategory;
  status?: SubmissionStatus;
  userId?: number;
  targetFoodId?: number;
  current?: number;
  pageSize?: number;
}

export interface IApproveSubmissionDto {
  adminNote?: string;
}

export interface IRejectSubmissionDto {
  adminNote: string;
}

export interface IUpdateSubmissionStatusDto {
  status: SubmissionStatus;
  adminNote?: string;
}
