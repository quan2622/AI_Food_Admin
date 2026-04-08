/* Nutrition components (GET /nutrition-components) & goals (admin) */

export type UnitType =
  | "UNIT_G"
  | "UNIT_KG"
  | "UNIT_MG"
  | "UNIT_OZ"
  | "UNIT_LB";

export type GoalType = "GOAL_LOSS" | "GOAL_GAIN" | "GOAL_MAINTAIN" | "GOAL_STRICT";

export type NutritionGoalStatus =
  | "NUTR_GOAL_ONGOING"
  | "NUTR_GOAL_COMPLETED"
  | "NUTR_GOAL_PAUSED"
  | "NUTR_GOAL_FAILED";

export interface INutritionComponent {
  id: number;
  name: string;
  unit: UnitType | string;
  values?: unknown[];
  createdAt?: string;
  /** Ngày cập nhật (một số API có thể trả về `updateAt`) */
  updatedAt?: string;
  updateAt?: string;
}

export interface ICreateNutritionComponentRequest {
  name: string;
  unit: UnitType | string;
}

export interface IUpdateNutritionComponentRequest {
  name?: string;
  unit?: UnitType | string;
}

export interface INutritionGoalCodeInfo {
  keyMap?: string;
  value?: string;
  description?: string;
}

export interface INutritionGoalUser {
  id: number;
  email: string;
  fullName?: string | null;
}

export interface INutritionGoal {
  id: number;
  goalType: GoalType | string;
  status: NutritionGoalStatus | string;
  targetWeight: number | null;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  targetFiber: number;
  startDate: string;
  endDate: string;
  userId: number;
  user?: INutritionGoalUser;
  createdAt?: string;
  updatedAt?: string;
  goalTypeInfo?: INutritionGoalCodeInfo;
  statusInfo?: INutritionGoalCodeInfo;
}

export interface ICreateNutritionGoalRequest {
  goalType: GoalType | string;
  targetWeight: number;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  targetFiber: number;
  startDate: string;
  endDate: string;
  status?: NutritionGoalStatus | string;
}

export interface IUpdateNutritionGoalRequest {
  goalType?: GoalType | string;
  status?: NutritionGoalStatus | string;
  targetWeight?: number;
  targetCalories?: number;
  targetProtein?: number;
  targetCarbs?: number;
  targetFat?: number;
  targetFiber?: number;
  startDate?: string;
  endDate?: string;
}
