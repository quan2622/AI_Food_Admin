/* ============================================================================
 * USER SERVICE
 * APIs: GET /users | GET /users/:id | POST /users | ...
 * ========================================================================== */

import privateAxios from "@/lib/privateAxios";
import { ApiResponse, IBackendPaginatedResponse } from "@/types/backend.type";
import {
  ICreateUserRequest,
  IUpdateUserPasswordRequest,
  IUpdateUserRequest,
  IUpdateUserStatusRequest,
  IUserDetail,
} from "@/types/user.type";
import { IUser } from "@/types/authen.type";

export const userService = {
  /**
   * Lấy danh sách tất cả Users (phân trang cho admin)
   * @param current Trang hiện tại
   * @param pageSize Số lượng user trên 1 trang
   * @returns IBackendPaginatedResponse<IUser>
   */
  getUsersPaginated: async (
    current: number = 1,
    pageSize: number = 10
  ): Promise<IBackendPaginatedResponse<IUser>> => {
    const res = await privateAxios.get<IBackendPaginatedResponse<IUser>>(
      `/users/admin`,
      {
        params: {
          current,
          pageSize,
        },
      }
    );
    return res as unknown as IBackendPaginatedResponse<IUser>;
  },

  /**
   * Lấy danh sách tất cả Users
   * @returns ApiResponse<IUserDetail[]>
   */
  getAllUsers: async (): Promise<ApiResponse<IUserDetail[]>> => {
    const res = await privateAxios.get<ApiResponse<IUserDetail[]>>("/users");
    return res as unknown as ApiResponse<IUserDetail[]>;
  },

  /**
   * Lấy thông tin chi tiết một User
   * @param id ID cúa User
   * @returns ApiResponse<IUserDetail>
   */
  getUserById: async (id: number): Promise<ApiResponse<IUserDetail>> => {
    const res = await privateAxios.get<ApiResponse<IUserDetail>>(`/users/${id}`);
    return res as unknown as ApiResponse<IUserDetail>;
  },

  /**
   * Tạo User mới
   * @param data Dữ liệu tạo user mới
   * @returns ApiResponse<IUser>
   */
  createUser: async (data: ICreateUserRequest): Promise<ApiResponse<IUser>> => {
    const res = await privateAxios.post<ApiResponse<IUser>>("/users", data);
    return res as unknown as ApiResponse<IUser>;
  },

  /**
   * Cập nhật thông tin User
   * @param id ID của User
   * @param data Dữ liệu cập nhật
   * @returns ApiResponse<Partial<IUser>>
   */
  updateUser: async (
    id: number,
    data: IUpdateUserRequest
  ): Promise<ApiResponse<Partial<IUser>>> => {
    const res = await privateAxios.patch<ApiResponse<Partial<IUser>>>(
      `/users/${id}`,
      data
    );
    return res as unknown as ApiResponse<Partial<IUser>>;
  },

  /**
   * Cập nhật mật khẩu User
   * @param id ID của User
   * @param data { newPassword }
   * @returns ApiResponse<{ message: string }>
   */
  updatePassword: async (
    id: number,
    data: IUpdateUserPasswordRequest
  ): Promise<ApiResponse<{ message: string }>> => {
    const res = await privateAxios.patch<ApiResponse<{ message: string }>>(
      `/users/${id}/password`,
      data
    );
    return res as unknown as ApiResponse<{ message: string }>;
  },

  /**
   * Cập nhật trạng thái User (Active/Inactive)
   * @param id ID của User
   * @param data { status }
   * @returns ApiResponse<Partial<IUser>>
   */
  updateStatus: async (
    id: number,
    data: IUpdateUserStatusRequest
  ): Promise<ApiResponse<Partial<IUser>>> => {
    const res = await privateAxios.patch<ApiResponse<Partial<IUser>>>(
      `/users/${id}/status`,
      data
    );
    return res as unknown as ApiResponse<Partial<IUser>>;
  },

  /**
   * Xóa User
   * @param id ID của User
   * @returns ApiResponse<null>
   */
  deleteUser: async (id: number): Promise<ApiResponse<null>> => {
    const res = await privateAxios.delete<ApiResponse<null>>(`/users/${id}`);
    return res as unknown as ApiResponse<null>;
  },
};
