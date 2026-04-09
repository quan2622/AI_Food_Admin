import privateAxios from "@/lib/privateAxios";
import { ApiResponse } from "@/types/backend.type";
import type { IDashboardV2Overview } from "@/types/dashboard.type";

export const dashboardService = {
  getOverview: async (): Promise<ApiResponse<IDashboardV2Overview>> => {
    const res = await privateAxios.get<ApiResponse<IDashboardV2Overview>>("/admin/dashboard-v2/overview");
    return res as unknown as ApiResponse<IDashboardV2Overview>;
  },
};
