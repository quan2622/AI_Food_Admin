/* ============================================================================
 * USER ALLERGY SERVICE
 * APIs: /user-allergies | /user-allergies/user/:userId | ...
 * ========================================================================== */

import privateAxios from "@/lib/privateAxios";
import { ApiResponse, IBackendPaginatedResponse } from "@/types/backend.type";
import {
  ICreateUserAllergyRequest,
  IUpdateUserAllergyRequest,
  IUserAllergy,
} from "@/types/user.type";

export const userAllergyService = {
  /**
   * Lấy danh sách Allergies của một User
   * @param userId ID của User
   * @returns ApiResponse<IUserAllergy[]>
   */
  getAllergiesByUserId: async (
    userId: number
  ): Promise<ApiResponse<IUserAllergy[]>> => {
    const res = await privateAxios.get<ApiResponse<IUserAllergy[]>>(
      `/user-allergies/user/${userId}`
    );
    return res as unknown as ApiResponse<IUserAllergy[]>;
  },

  /**
   * Lấy danh sách allergies của tất cả users (Admin) có phân trang
   */
  getAdminAllergiesPaginated: async (
    current: number = 1,
    pageSize: number = 10
  ): Promise<IBackendPaginatedResponse<any>> => {
    const res = await privateAxios.get<IBackendPaginatedResponse<any>>(
      `/user-allergies/admin?current=${current}&pageSize=${pageSize}`
    );
    return res as unknown as IBackendPaginatedResponse<any>;
  },

  /**
   * Lấy chi tiết 1 User Allergy record
   * @param id ID của user allergy record
   * @returns ApiResponse<IUserAllergy>
   */
  getAllergyById: async (id: number): Promise<ApiResponse<IUserAllergy>> => {
    const res = await privateAxios.get<ApiResponse<IUserAllergy>>(
      `/user-allergies/${id}`
    );
    return res as unknown as ApiResponse<IUserAllergy>;
  },

  /**
   * Thêm Allergy cho User
   * @param data { userId, allergenId, severity, note }
   * @returns ApiResponse<IUserAllergy>
   */
  addAllergy: async (
    data: ICreateUserAllergyRequest
  ): Promise<ApiResponse<IUserAllergy>> => {
    const res = await privateAxios.post<ApiResponse<IUserAllergy>>(
      "/user-allergies",
      data
    );
    return res as unknown as ApiResponse<IUserAllergy>;
  },

  /**
   * Cập nhật User Allergy record
   * @param id ID của user allergy record
   * @param data { severity, note }
   * @returns ApiResponse<IUserAllergy>
   */
  updateAllergy: async (
    id: number,
    data: IUpdateUserAllergyRequest
  ): Promise<ApiResponse<IUserAllergy>> => {
    const res = await privateAxios.patch<ApiResponse<IUserAllergy>>(
      `/user-allergies/${id}`,
      data
    );
    return res as unknown as ApiResponse<IUserAllergy>;
  },

  /**
   * Xóa Allergy record cho User
   * @param id ID của user allergy record
   * @returns ApiResponse<null>
   */
  deleteAllergy: async (id: number): Promise<ApiResponse<null>> => {
    const res = await privateAxios.delete<ApiResponse<null>>(
      `/user-allergies/${id}`
    );
    return res as unknown as ApiResponse<null>;
  },
};
