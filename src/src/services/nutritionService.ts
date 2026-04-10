import privateAxios from "@/lib/privateAxios";
import { ApiResponse, IBackendPaginatedResponse } from "@/types/backend.type";
import type {
  INutritionComponent,
  ICreateNutritionComponentRequest,
  IUpdateNutritionComponentRequest,
  INutritionGoal,
  ICreateNutritionGoalRequest,
  IUpdateNutritionGoalRequest,
  INutrient
} from "@/types/nutrition.type";

export const nutritionService = {
  getNutritionComponents: async (): Promise<ApiResponse<INutritionComponent[]>> => {
    return res as unknown as ApiResponse<INutritionComponent[]>;
  },

  getNutrients: async (): Promise<ApiResponse<INutrient[]>> => {
    const res = await privateAxios.get<ApiResponse<INutrient[]>>("/nutrients");
    return res as unknown as ApiResponse<INutrient[]>;
  },

  getNutritionComponentsPaginated: async (params: {
    current?: number;
    pageSize?: number;
    name?: string;
    unit?: string;
    sort?: string;
  } = {}): Promise<IBackendPaginatedResponse<INutritionComponent>> => {
    const res = await privateAxios.get<IBackendPaginatedResponse<INutritionComponent>>(
      "/nutrition-components/paginate",
      { params: { current: 1, pageSize: 10, ...params } }
    );
    return res as unknown as IBackendPaginatedResponse<INutritionComponent>;
  },

  createNutritionComponent: async (
    data: ICreateNutritionComponentRequest
  ): Promise<ApiResponse<INutritionComponent>> => {
    const res = await privateAxios.post<ApiResponse<INutritionComponent>>(
      "/nutrition-components",
      data
    );
    return res as unknown as ApiResponse<INutritionComponent>;
  },

  updateNutritionComponent: async (
    id: number,
    data: IUpdateNutritionComponentRequest
  ): Promise<ApiResponse<INutritionComponent>> => {
    const res = await privateAxios.patch<ApiResponse<INutritionComponent>>(
      `/nutrition-components/${id}`,
      data
    );
    return res as unknown as ApiResponse<INutritionComponent>;
  },

  deleteNutritionComponent: async (id: number): Promise<void> => {
    await privateAxios.delete(`/nutrition-components/${id}`);
  },

  getNutritionGoalsAdminPaginated: async (
    current: number = 1,
    pageSize: number = 10
  ): Promise<IBackendPaginatedResponse<INutritionGoal>> => {
    const res = await privateAxios.get<IBackendPaginatedResponse<INutritionGoal>>(
      "/nutrition-goals/admin",
      { params: { current, pageSize } }
    );
    return res as unknown as IBackendPaginatedResponse<INutritionGoal>;
  },

  getNutritionGoalById: async (id: number): Promise<ApiResponse<INutritionGoal>> => {
    const res = await privateAxios.get<ApiResponse<INutritionGoal>>(
      `/nutrition-goals/${id}`
    );
    return res as unknown as ApiResponse<INutritionGoal>;
  },

  createNutritionGoal: async (
    data: ICreateNutritionGoalRequest
  ): Promise<ApiResponse<INutritionGoal>> => {
    const res = await privateAxios.post<ApiResponse<INutritionGoal>>(
      "/nutrition-goals",
      data
    );
    return res as unknown as ApiResponse<INutritionGoal>;
  },

  updateNutritionGoal: async (
    id: number,
    data: IUpdateNutritionGoalRequest
  ): Promise<ApiResponse<INutritionGoal>> => {
    const res = await privateAxios.patch<ApiResponse<INutritionGoal>>(
      `/nutrition-goals/${id}`,
      data
    );
    return res as unknown as ApiResponse<INutritionGoal>;
  },

  deleteNutritionGoal: async (id: number): Promise<void> => {
    await privateAxios.delete(`/nutrition-goals/${id}`);
  },
};
