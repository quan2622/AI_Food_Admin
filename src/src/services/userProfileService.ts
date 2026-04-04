/* ============================================================================
 * USER PROFILE SERVICE
 * APIs: /user-profiles | /user-profiles/:id | /user-profiles/by-user/:userId
 * ========================================================================== */

import privateAxios from "@/lib/privateAxios";
import { ApiResponse } from "@/types/backend.type";
import {
  ICreateUserProfileRequest,
  IUpdateUserProfileRequest,
  IUserProfile,
} from "@/types/user.type";

export const userProfileService = {
  /**
   * Lấy danh sách tất cả Profiles
   * @returns ApiResponse<IUserProfile[]>
   */
  getAllProfiles: async (): Promise<ApiResponse<IUserProfile[]>> => {
    const res = await privateAxios.get<ApiResponse<IUserProfile[]>>(
      "/user-profiles/all"
    );
    return res as unknown as ApiResponse<IUserProfile[]>;
  },

  /**
   * Lấy Profile theo User ID
   * @param userId ID của User
   * @returns ApiResponse<IUserProfile>
   */
  getProfileByUserId: async (
    userId: number
  ): Promise<ApiResponse<IUserProfile>> => {
    const res = await privateAxios.get<ApiResponse<IUserProfile>>(
      `/user-profiles/by-user/${userId}`
    );
    return res as unknown as ApiResponse<IUserProfile>;
  },

  /**
   * Lấy Profile theo Profile ID
   * @param id ID của profile record
   * @returns ApiResponse<IUserProfile>
   */
  getProfileById: async (id: number): Promise<ApiResponse<IUserProfile>> => {
    const res = await privateAxios.get<ApiResponse<IUserProfile>>(
      `/user-profiles/${id}`
    );
    return res as unknown as ApiResponse<IUserProfile>;
  },

  /**
   * Tạo Profile cho User
   * @param data Dữ liệu profile
   * @returns ApiResponse<IUserProfile>
   */
  createProfile: async (
    data: ICreateUserProfileRequest
  ): Promise<ApiResponse<IUserProfile>> => {
    const res = await privateAxios.post<ApiResponse<IUserProfile>>(
      "/user-profiles",
      data
    );
    return res as unknown as ApiResponse<IUserProfile>;
  },

  /**
   * Cập nhật Profile theo ID
   * @param id ID của profile record
   * @param data Dữ liệu cập nhật
   * @returns ApiResponse<IUserProfile>
   */
  updateProfile: async (
    id: number,
    data: IUpdateUserProfileRequest
  ): Promise<ApiResponse<IUserProfile>> => {
    const res = await privateAxios.patch<ApiResponse<IUserProfile>>(
      `/user-profiles/${id}`,
      data
    );
    return res as unknown as ApiResponse<IUserProfile>;
  },

  /**
   * Xóa Profile
   * @param id ID của profile record
   * @returns ApiResponse<null>
   */
  deleteProfile: async (id: number): Promise<ApiResponse<null>> => {
    const res = await privateAxios.delete<ApiResponse<null>>(
      `/user-profiles/${id}`
    );
    return res as unknown as ApiResponse<null>;
  },

  /**
   * Admin/User tự xem profile của chính mình
   * @returns ApiResponse<IUserProfile>
   */
  getOwnProfile: async (): Promise<ApiResponse<IUserProfile>> => {
    const res = await privateAxios.get<ApiResponse<IUserProfile>>(
      "/user-profiles"
    );
    return res as unknown as ApiResponse<IUserProfile>;
  },

  /**
   * Admin/User tự cập nhật profile của chính mình
   * @param data Dữ liệu cập nhật
   * @returns ApiResponse<IUserProfile>
   */
  updateOwnProfile: async (
    data: IUpdateUserProfileRequest
  ): Promise<ApiResponse<IUserProfile>> => {
    const res = await privateAxios.patch<ApiResponse<IUserProfile>>(
      "/user-profiles",
      data
    );
    return res as unknown as ApiResponse<IUserProfile>;
  },

  /**
   * Admin/User tự xóa profile của chính mình
   * @returns ApiResponse<null>
   */
  deleteOwnProfile: async (): Promise<ApiResponse<null>> => {
    const res = await privateAxios.delete<ApiResponse<null>>("/user-profiles");
    return res as unknown as ApiResponse<null>;
  },
};
