/* Admin logs: GET /daily-logs/admin, GET /meals/admin — see .api_docs/admin-logs-tracking-api.md */

export interface ILogUser {
  id: number;
  email?: string;
  fullName?: string | null;
}

export interface IDailyLogMealStub {
  id: number;
  mealType?: string;
  mealDateTime?: string;
}

/** AllCode enrich — dùng cho mealTypeInfo, statusInfo */
export interface IAllCodeInfo {
  keyMap?: string;
  value?: string;
  description?: string;
  type?: string;
}

/** Từng bữa trong nhóm — GET /daily-logs/admin (chỉ id, thời gian, tổng kcal bữa) */
export interface IDailyLogAdminMealStub {
  id: number;
  mealDateTime?: string;
  totalCalories?: number;
}

/**
 * Nhóm theo buổi — GET /daily-logs/admin (thứ tự: sáng → trưa → tối → snack → khác)
 * Mỗi nhóm: tổng kcal buổi + danh sách bữa (meta)
 */
export interface IDailyLogAdminMealGroup {
  mealType: string;
  mealTypeInfo?: IAllCodeInfo;
  totalCalories?: number;
  meals: IDailyLogAdminMealStub[];
}

export interface IDailyLogAdmin {
  id: number;
  logDate: string;
  status: string;
  userId: number;
  user?: ILogUser;
  meals?: IDailyLogMealStub[];
  createdAt?: string;
  updatedAt?: string;
  statusInfo?: { keyMap?: string; value?: string; description?: string };
  /** Tổng kcal cả ngày (cộng mọi meal) — GET /daily-logs/admin */
  dayTotalCalories?: number;
  /** Gom theo buổi + AllCode từng nhóm */
  mealGroups?: IDailyLogAdminMealGroup[];
  /** @deprecated ưu tiên dùng dayTotalCalories */
  totalCalories?: number;
}

export interface IMealItemStub {
  id?: number;
  food?: { foodName?: string };
  quantity?: number;
  calories?: number;
}

/** Chi tiết meal item — GET /meals/daily-log/:dailyLogId */
export interface IMealItemDetail {
  id?: number;
  food?: { foodName?: string; imageUrl?: string };
  quantity?: number;
  grams?: number;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
}

/** Meal kèm mealItems (dùng chung cho admin) */
export interface IMealByDailyLog {
  id: number;
  mealType: string;
  mealDateTime: string;
  dailyLogId?: number;
  mealItems?: IMealItemDetail[];
  foodImages?: { id?: number; imageUrl?: string; fileName?: string }[];
  createdAt?: string;
  totalCalories?: number;
}

/** Một bản ghi meal trong nhóm loại bữa (có thể có nhiều meal cùng loại trong ngày) */
export interface IMealInGroup {
  id: number;
  mealDateTime?: string;
  mealItems?: IMealItemDetail[];
  totalCalories?: number;
  dailyLogId?: number;
  foodImages?: { id?: number; imageUrl?: string; fileName?: string }[];
  createdAt?: string;
}

/** Nhóm theo loại bữa: breakfast / lunch / ... */
export interface IMealGroup {
  mealType: string;
  mealTypeInfo?: IAllCodeInfo;
  meals: IMealInGroup[];
}

/**
 * GET /daily-logs/users/:userId/logs/:dailyLogId (AdminGuard)
 * Có thể có mealGroups (nhóm theo bữa) hoặc meals (danh sách phẳng — tương thích cũ)
 */
export interface IDailyLogDetail {
  id: number;
  logDate: string;
  status: string;
  userId: number;
  user?: ILogUser;
  statusInfo?: IAllCodeInfo;
  /** Danh sách phẳng (legacy) */
  meals?: IMealByDailyLog[];
  /** Nhóm theo mealType + mealTypeInfo, mỗi nhóm chứa các meal + mealItems */
  mealGroups?: IMealGroup[];
  createdAt?: string;
  updatedAt?: string;
  totalCalories?: number;
}

export interface IMealAdmin {
  id: number;
  mealType: string;
  mealDateTime: string;
  dailyLogId?: number;
  dailyLog?: {
    id: number;
    logDate?: string;
    user?: ILogUser;
  };
  mealItems?: IMealItemStub[];
  foodImages?: unknown[];
  createdAt?: string;
  updatedAt?: string;
  mealTypeInfo?: { keyMap?: string; value?: string; description?: string };
  totalCalories?: number;
  totalProtein?: number;
  totalCarbs?: number;
  totalFat?: number;
}

/**
 * GET /meals/users/:userId/meals/:mealId (AdminGuard)
 * Meal kèm dailyLog + mealItems + food + mealTypeInfo + tổng macro (enrichMealType).
 */
export interface IMealDetailAdmin {
  id: number;
  mealType: string;
  mealDateTime: string;
  mealTypeInfo?: IAllCodeInfo;
  dailyLog?: {
    id: number;
    logDate?: string;
    userId?: number;
    user?: ILogUser;
  };
  mealItems?: IMealItemDetail[];
  totalCalories?: number;
  totalProtein?: number;
  totalCarbs?: number;
  totalFat?: number;
  createdAt?: string;
  updatedAt?: string;
}
