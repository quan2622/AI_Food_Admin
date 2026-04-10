import privateAxios from "@/lib/privateAxios";
import { ApiResponse, IBackendPaginatedResponse } from "@/types/backend.type";
import {
  IAllergen,
  ICreateAllergenRequest,
  IUpdateAllergenRequest,
  IIngredient,
  ICreateIngredientRequest,
  IUpdateIngredientRequest,
  IIngredientNutrition
} from "@/types/ingredient.type";

export const ingredientService = {
  // ======================================
  // ALLERGENS
  // ======================================
  getAllergensPaginated: async (
    current: number = 1,
    pageSize: number = 10
  ): Promise<IBackendPaginatedResponse<IAllergen>> => {
    const res = await privateAxios.get<IBackendPaginatedResponse<IAllergen>>(
      `/allergens/admin`,
      { params: { current, pageSize } }
    );
    return res as unknown as IBackendPaginatedResponse<IAllergen>;
  },

  getAllergenById: async (id: number): Promise<ApiResponse<IAllergen>> => {
    const res = await privateAxios.get<ApiResponse<IAllergen>>(`/allergens/${id}`);
    return res as unknown as ApiResponse<IAllergen>;
  },

  createAllergen: async (data: ICreateAllergenRequest): Promise<ApiResponse<IAllergen>> => {
    const res = await privateAxios.post<ApiResponse<IAllergen>>("/allergens", data);
    return res as unknown as ApiResponse<IAllergen>;
  },

  updateAllergen: async (
    id: number,
    data: IUpdateAllergenRequest
  ): Promise<ApiResponse<IAllergen>> => {
    const res = await privateAxios.patch<ApiResponse<IAllergen>>(`/allergens/${id}`, data);
    return res as unknown as ApiResponse<IAllergen>;
  },

  deleteAllergen: async (id: number): Promise<ApiResponse<null>> => {
    const res = await privateAxios.delete<ApiResponse<null>>(`/allergens/${id}`);
    return res as unknown as ApiResponse<null>;
  },

  // ======================================
  // INGREDIENTS (Fallback/Mock endpoints)
  // Note: Docs state there is no direct CRUD for ingredients, these might fail
  // ======================================
  getIngredientsPaginated: async (
    current: number = 1,
    pageSize: number = 10
  ): Promise<IBackendPaginatedResponse<IIngredient>> => {
    const res = await privateAxios.get<IBackendPaginatedResponse<IIngredient>>(
      `/ingredients/admin`,
      { params: { current, pageSize } }
    );
    return res as unknown as IBackendPaginatedResponse<IIngredient>;
  },

  getAllIngredients: async (): Promise<ApiResponse<IIngredient[]>> => {
    const res = await privateAxios.get<ApiResponse<IIngredient[]>>("/ingredients");
    return res as unknown as ApiResponse<IIngredient[]>;
  },

  getTopAllergenIngredients: async (): Promise<ApiResponse<IIngredient[]>> => {
    const res = await privateAxios.get<ApiResponse<IIngredient[]>>("/ingredients/top-allergen");
    return res as unknown as ApiResponse<IIngredient[]>;
  },

  searchIngredients: async (name: string): Promise<ApiResponse<IIngredient[]>> => {
    const res = await privateAxios.get<ApiResponse<IIngredient[]>>("/ingredients/search", {
      params: { name }
    });
    return res as unknown as ApiResponse<IIngredient[]>;
  },

  getIngredientById: async (id: number): Promise<ApiResponse<IIngredient>> => {
    const res = await privateAxios.get<ApiResponse<IIngredient>>(`/ingredients/${id}`);
    return res as unknown as ApiResponse<IIngredient>;
  },

  createIngredient: async (data: FormData): Promise<ApiResponse<IIngredient>> => {
    const res = await privateAxios.post<ApiResponse<IIngredient>>("/ingredients", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res as unknown as ApiResponse<IIngredient>;
  },

  updateIngredient: async (
    id: number,
    data: FormData
  ): Promise<ApiResponse<IIngredient>> => {
    const res = await privateAxios.patch<ApiResponse<IIngredient>>(`/ingredients/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res as unknown as ApiResponse<IIngredient>;
  },

  deleteIngredient: async (id: number): Promise<ApiResponse<null>> => {
    const res = await privateAxios.delete<ApiResponse<null>>(`/ingredients/${id}`);
    return res as unknown as ApiResponse<null>;
  },

  // ======================================
  // NUTRITION
  // ======================================
  getIngredientNutritions: async (ingredientId: number): Promise<ApiResponse<IIngredientNutrition[]>> => {
    const res = await privateAxios.get<ApiResponse<IIngredientNutrition[]>>(`/ingredients/${ingredientId}/nutritions`);
    return res as unknown as ApiResponse<IIngredientNutrition[]>;
  }
};
