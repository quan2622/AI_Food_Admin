import privateAxios from "@/lib/privateAxios";
import { ApiResponse } from "@/types/backend.type";

export interface DashboardData {
  asOf: string;
  kpi: {
    totalUsers: number;
    activeUsersToday: number;
    activeUsersYesterday: number;
    activeUsersChangePercent: number | null;
    mealsLoggedLast7Days: number;
    mealsLoggedPrevious7Days: number;
    mealsChangePercent: number | null;
    newUsersLast7Days: number;
    newUsersPrevious7Days: number;
    newUsersChangePercent: number | null;
  };
  activityAndAlerts: {
    series: { date: string; activeUsers: number }[];
    alerts: {
      id: string;
      severity: "info" | "warning" | "critical";
      title: string;
      detail?: string;
      count?: number;
    }[];
  };
  nutritionPlatform: {
    metrics: {
      key: string;
      labelKey: string;
      actualDailyAverage: number;
      recommendedAverage: number;
      percentOfRecommended: number;
    }[];
    distinctUserDaysWithMeals: number;
    ongoingGoalsSampleSize: number;
    period: { from: string; to: string; note: string };
  };
  foodsAndGoals: {
    topFoods: { foodId: string; foodName: string; imageUrl?: string; count: number }[];
    goalTypeBreakdown: { goalType: string; count: number; percentOfTotal: number }[];
    ongoingGoalsTotal: number;
  };
  usersAndContent: {
    newUsers: {
      id: string;
      email: string;
      fullName: string;
      accountActive: boolean;
      createdAt: string;
    }[];
    newUsersNote: string;
    contentQueue: {
      foodsMissingNutritionProfile: { total: number; sample: string[] };
      reportedFoods: { total: number; items: any[]; note: string };
    };
  };
}

export const dashboardService = {
  getOverview: async (): Promise<ApiResponse<DashboardData>> => {
    const res = await privateAxios.get<ApiResponse<DashboardData>>("/admin/dashboard/overview");
    return res as unknown as ApiResponse<DashboardData>;
  },
};
