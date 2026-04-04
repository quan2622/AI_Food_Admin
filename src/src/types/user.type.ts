/* ============================================================================
 * USER TYPES – Admin Panel
 * APIs: /users | /user-profiles | /user-allergies
 * ========================================================================== */

import { IUser } from "./authen.type";

// ─── User Profile ────────────────────────────────────────────────────────────

export interface IUserProfile {
  id: number;
  age: number;
  height: number;
  weight: number;
  bmi: number;
  bmr: number;
  tdee: number;
  gender: string | null;
  activityLevel: string | null;
  userId: number;
  createdAt?: string;
  updatedAt?: string;
  user?: Partial<IUser>;
}

// ─── User Allergy ────────────────────────────────────────────────────────────

export interface IAllergen {
  id: number;
  name: string;
  description?: string | null;
}

export interface IUserAllergy {
  id: number;
  severity: string;
  note?: string | null;
  userId: number;
  allergenId: number;
  allergen?: IAllergen;
  createdAt?: string;
  updatedAt?: string;
}

// ─── Nutrition Goal ──────────────────────────────────────────────────────────

export interface INutritionGoal {
  id: number;
  goalType: string;
  status: string;
  targetWeight?: number | null;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  targetFiber: number;
  startDate: string;
  endDate: string;
  userId: number;
  createdAt?: string;
  updatedAt?: string;
}

// ─── Detailed User ───────────────────────────────────────────────────────────

export interface IUserDetail extends IUser {
  userProfile?: IUserProfile | null;
  allergies?: IUserAllergy[];
  nutritionGoals?: INutritionGoal[];
}

// ─── Request Interfaces ──────────────────────────────────────────────────────

export interface ICreateUserRequest {
  email: string;
  password?: string;
  fullName: string;
  genderCode?: string;
  avatarUrl?: string;
  birthOfDate?: string;
  isAdmin?: boolean;
}

export interface IUpdateUserRequest {
  email?: string;
  fullName?: string;
  avatarUrl?: string;
  genderCode?: string;
  birthOfDate?: string;
  isAdmin?: boolean;
}

export interface IUpdateUserPasswordRequest {
  newPassword: string;
}

export interface IUpdateUserStatusRequest {
  status: boolean;
}

export interface ICreateUserProfileRequest {
  age: number;
  height: number;
  weight: number;
  gender?: string;
  activityLevel?: string;
}

export interface IUpdateUserProfileRequest {
  age?: number;
  height?: number;
  weight?: number;
  gender?: string;
  activityLevel?: string;
}

export interface ICreateUserAllergyRequest {
  userId: number;
  allergenId: number;
  severity: string;
  note?: string;
}

export interface IUpdateUserAllergyRequest {
  severity?: string;
  note?: string;
}
