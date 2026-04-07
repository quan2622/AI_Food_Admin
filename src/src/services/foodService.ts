import privateAxios from "@/lib/privateAxios";
import { ApiResponse, IBackendPaginatedResponse } from "@/types/backend.type";
import {
  IFood,
  IFoodCategoryAdmin,
  ICreateFoodRequest,
  IUpdateFoodRequest,
  ICreateCategoryRequest,
  IUpdateCategoryRequest,
} from "@/types/food.type";

export const foodService = {
  /**
   * Lấy danh sách Món ăn cho Admin có phân trang
   */
  getAdminFoodsPaginated: async (
    current: number = 1,
    pageSize: number = 10
  ): Promise<IBackendPaginatedResponse<IFood>> => {
    const res = await privateAxios.get<IBackendPaginatedResponse<IFood>>(
      `/foods/admin?current=${current}&pageSize=${pageSize}`
    );
    return res as unknown as IBackendPaginatedResponse<IFood>;
  },

  /**
   * Lấy chi tiết 1 Món ăn
   */
  getFoodById: async (id: number): Promise<ApiResponse<IFood>> => {
    const res = await privateAxios.get<ApiResponse<IFood>>(`/foods/${id}`);
    return res as unknown as ApiResponse<IFood>;
  },

  /**
   * Tạo Món ăn mới
   */
  createFood: async (data: ICreateFoodRequest): Promise<ApiResponse<IFood>> => {
    const res = await privateAxios.post<ApiResponse<IFood>>("/foods", data);
    return res as unknown as ApiResponse<IFood>;
  },

  /**
   * Cập nhật Món ăn
   */
  updateFood: async (
    id: number,
    data: IUpdateFoodRequest
  ): Promise<ApiResponse<IFood>> => {
    const res = await privateAxios.patch<ApiResponse<IFood>>(`/foods/${id}`, data);
    return res as unknown as ApiResponse<IFood>;
  },

  /**
   * Xóa Món ăn
   */
  deleteFood: async (id: number): Promise<ApiResponse<null>> => {
    const res = await privateAxios.delete<ApiResponse<null>>(`/foods/${id}`);
    return res as unknown as ApiResponse<null>;
  },
  
  /**
   * Lấy danh sách Category để chọn lúc tạo món
   */
  getFoodCategories: async (): Promise<ApiResponse<any[]>> => {
    const res = await privateAxios.get<ApiResponse<any[]>>(`/food-categories`);
    return res as unknown as ApiResponse<any[]>;
  },

  /**
   * Lấy danh sách Food Categories (Admin) có phân trang
   */
  getCategoriesPaginated: async (
    current: number = 1,
    pageSize: number = 10
  ): Promise<IBackendPaginatedResponse<IFoodCategoryAdmin>> => {
    const res = await privateAxios.get<IBackendPaginatedResponse<IFoodCategoryAdmin>>(
      `/food-categories/admin?current=${current}&pageSize=${pageSize}`
    );
    return res as unknown as IBackendPaginatedResponse<IFoodCategoryAdmin>;
  },

  /**
   * Tạo danh mục mới
   */
  createCategory: async (
    data: ICreateCategoryRequest
  ): Promise<ApiResponse<IFoodCategoryAdmin>> => {
    const res = await privateAxios.post<ApiResponse<IFoodCategoryAdmin>>(
      "/food-categories",
      data
    );
    return res as unknown as ApiResponse<IFoodCategoryAdmin>;
  },

  /**
   * Cập nhật danh mục
   */
  updateCategory: async (
    id: number,
    data: IUpdateCategoryRequest
  ): Promise<ApiResponse<IFoodCategoryAdmin>> => {
    const res = await privateAxios.patch<ApiResponse<IFoodCategoryAdmin>>(
      `/food-categories/${id}`,
      data
    );
    return res as unknown as ApiResponse<IFoodCategoryAdmin>;
  },

  /**
   * Xóa danh mục
   */
  deleteCategory: async (id: number): Promise<ApiResponse<null>> => {
    const res = await privateAxios.delete<ApiResponse<null>>(
      `/food-categories/${id}`
    );
    return res as unknown as ApiResponse<null>;
  },

  /**
   * Lấy danh sách Ảnh thực phẩm (Admin) có phân trang
   */
  getFoodImagesPaginated: async (
    current: number = 1,
    pageSize: number = 10
  ): Promise<IBackendPaginatedResponse<any>> => {
    const res = await privateAxios.get<IBackendPaginatedResponse<any>>(
      `/food-images/admin?current=${current}&pageSize=${pageSize}`
    );
    return res as unknown as IBackendPaginatedResponse<any>;
  },

  /**
   * Xóa ảnh
   */
  deleteFoodImage: async (id: number): Promise<ApiResponse<null>> => {
    const res = await privateAxios.delete<ApiResponse<null>>(`/food-images/${id}`);
    return res as unknown as ApiResponse<null>;
  },
};
