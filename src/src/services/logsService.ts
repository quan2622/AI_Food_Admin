import privateAxios from "@/lib/privateAxios";
import { IBackendPaginatedResponse } from "@/types/backend.type";
import type {
  IDailyLogAdmin,
  IDailyLogDetail,
  IMealAdmin,
  IMealDetailAdmin,
} from "@/types/logs.type";

export const logsService = {
  getDailyLogsAdminPaginated: async (
    current: number = 1,
    pageSize: number = 10
  ): Promise<IBackendPaginatedResponse<IDailyLogAdmin>> => {
    const res = await privateAxios.get<IBackendPaginatedResponse<IDailyLogAdmin>>(
      "/daily-logs/admin",
      { params: { current, pageSize } }
    );
    return res as unknown as IBackendPaginatedResponse<IDailyLogAdmin>;
  },

  getMealsAdminPaginated: async (
    current: number = 1,
    pageSize: number = 10
  ): Promise<IBackendPaginatedResponse<IMealAdmin>> => {
    const res = await privateAxios.get<IBackendPaginatedResponse<IMealAdmin>>(
      "/meals/admin",
      { params: { current, pageSize } }
    );
    return res as unknown as IBackendPaginatedResponse<IMealAdmin>;
  },

  /**
   * Chi tiết daily log theo user (admin).
   * GET /daily-logs/users/:userId/logs/:dailyLogId
   */
  getDailyLogDetailForUser: async (
    userId: number,
    dailyLogId: number
  ): Promise<IDailyLogDetail> => {
    const res = (await privateAxios.get(
      `/daily-logs/users/${userId}/logs/${dailyLogId}`
    )) as {
      metadata?: { EC?: number; message?: string };
      data?: IDailyLogDetail | { EC?: number; EM?: string; result?: IDailyLogDetail };
    };
    if (res.metadata?.EC !== undefined && res.metadata.EC !== 0) {
      throw new Error(res.metadata.message || "Không thể tải chi tiết daily log");
    }
    const d = res.data;
    if (d && typeof d === "object" && "id" in d && "logDate" in d) {
      return d as IDailyLogDetail;
    }
    const inner = d as { EC?: number; result?: IDailyLogDetail } | undefined;
    if (inner?.EC === 0 && inner.result) return inner.result;
    throw new Error("Phản hồi chi tiết daily log không hợp lệ");
  },

  /**
   * Chi tiết meal theo user (admin).
   * GET /meals/users/:userId/meals/:mealId
   */
  getMealDetailForUser: async (
    userId: number,
    mealId: number
  ): Promise<IMealDetailAdmin> => {
    const res = (await privateAxios.get(
      `/meals/users/${userId}/meals/${mealId}`
    )) as {
      metadata?: { EC?: number; message?: string };
      data?:
        | IMealDetailAdmin
        | { EC?: number; EM?: string; result?: IMealDetailAdmin };
    };
    if (res.metadata?.EC !== undefined && res.metadata.EC !== 0) {
      throw new Error(res.metadata.message || "Không thể tải chi tiết meal");
    }
    const d = res.data;
    if (d && typeof d === "object" && "id" in d && "mealType" in d) {
      return d as IMealDetailAdmin;
    }
    const inner = d as { EC?: number; result?: IMealDetailAdmin } | undefined;
    if (inner?.EC === 0 && inner.result) return inner.result;
    throw new Error("Phản hồi chi tiết meal không hợp lệ");
  },
};
