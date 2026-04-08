import privateAxios from "@/lib/privateAxios";
import type { ApiResponse } from "@/types/backend.type";
import { IBackendPaginatedResponse } from "@/types/backend.type";
import type {
  IAllCode,
  ICreateAllCodeRequest,
  IUpdateAllCodeRequest,
} from "@/types/allcode.type";

function unwrapList(payload: unknown): IAllCode[] {
  if (Array.isArray(payload)) return payload as IAllCode[];
  if (payload && typeof payload === "object") {
    const o = payload as Record<string, unknown>;
    if (Array.isArray(o.data)) return o.data as IAllCode[];
    const inner = o.data as Record<string, unknown> | undefined;
    if (inner && Array.isArray(inner.result)) {
      return inner.result as IAllCode[];
    }
  }
  return [];
}

export const allCodeService = {
  /**
   * Admin phân trang + lọc aqp — GET /allcodes/admin
   */
  getAllCodesAdminPaginated: async (
    current: number = 1,
    pageSize: number = 10,
    filters?: { type?: string }
  ): Promise<IBackendPaginatedResponse<IAllCode>> => {
    const params: Record<string, unknown> = {
      current,
      pageSize,
    };
    /** Lọc aqp: backend parse `filter[type]=value` → `{ filter: { type } }`; axios serialize nested object `filter: { type }` ra cùng query string. */
    if (filters?.type) {
      params.filter = { type: filters.type };
    }
    const res = await privateAxios.get<IBackendPaginatedResponse<IAllCode>>(
      "/allcodes/admin",
      { params }
    );
    return res as unknown as IBackendPaginatedResponse<IAllCode>;
  },

  /**
   * Toàn bộ mã — GET /allcodes | GET /allcodes?type=
   */
  getAllCodesList: async (opts?: { type?: string }): Promise<IAllCode[]> => {
    const res = (await privateAxios.get(
      "/allcodes",
      opts?.type ? { params: { type: opts.type } } : {}
    )) as unknown;
    const list = unwrapList(res);
    if (list.length > 0) return list;
    const maybe = res as ApiResponse<IAllCode[]> | undefined;
    if (maybe?.data && Array.isArray(maybe.data)) return maybe.data;
    return [];
  },

  createAllCode: async (
    body: ICreateAllCodeRequest
  ): Promise<ApiResponse<IAllCode>> => {
    const res = await privateAxios.post<ApiResponse<IAllCode>>("/allcodes", body);
    return res as unknown as ApiResponse<IAllCode>;
  },

  updateAllCode: async (
    id: number,
    body: IUpdateAllCodeRequest
  ): Promise<ApiResponse<IAllCode>> => {
    const res = await privateAxios.patch<ApiResponse<IAllCode>>(
      `/allcodes/${id}`,
      body
    );
    return res as unknown as ApiResponse<IAllCode>;
  },
};
