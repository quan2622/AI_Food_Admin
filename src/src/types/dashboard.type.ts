export interface IDashboardKeyMetrics {
  totalUsers: {
    value: number;
    trendPercent: number | null;
    trendLabel: string;
  };
  newUsersToday: {
    value: number;
    trendPercent: number | null;
    trendLabel: string;
  };
  totalFoods: {
    value: number;
    newContributions: number;
    trendLabel: string;
  };
  totalMealLogs: {
    value: number;
    trendPercent: number | null;
    trendLabel: string;
  };
}

export interface IDashboardTrends {
  activeUsersLast30Days: Array<{
    date: string;
    users: number;
  }>;
}

export interface IDashboardUserGoalBreakdown {
  name: string;
  goalType: string;
  count: number;
  percentage: number;
}

export interface IDashboardTopFood {
  rank: number;
  foodId: number;
  name: string;
  calories: number | null;
  logCount: number;
  trendPercent: number | null;
}

export interface IDashboardAlert {
  id: string;
  type: string;
  text: string;
  timeAgo: string;
  createdAt: string;
}

export interface IDashboardV2Overview {
  keyMetrics: IDashboardKeyMetrics;
  trends: IDashboardTrends;
  analytics: {
    userGoalsBreakdown: IDashboardUserGoalBreakdown[];
    topFoods: IDashboardTopFood[];
  };
  management: {
    totalAlerts: number;
    alerts: IDashboardAlert[];
  };
}
