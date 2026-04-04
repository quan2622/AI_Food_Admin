import publicAxios from "@/lib/publicAxios";
import privateAxios from "@/lib/privateAxios";
import { ILoginRequest, IUser } from "@/types/authen.type";
import { ApiResponse } from "@/types/backend.type";

interface LoginResponse {
  user: IUser;
  access_token: string;
}

export const authService = {
  /**
   * Đăng nhập admin
   * @param data { email, password }
   * @returns ApiResponse<LoginResponse>
   */
  login: async (data: ILoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const res = await publicAxios.post<ApiResponse<LoginResponse>>(
      "/auth/login",
      data
    );
    return res as unknown as ApiResponse<LoginResponse>;
  },

  /**
   * Đăng xuất
   */
  logout: async (): Promise<ApiResponse<null>> => {
    const res = await privateAxios.post<ApiResponse<null>>("/auth/logout");
    return res as unknown as ApiResponse<null>;
  },

  /**
   * Lấy thông tin người dùng hiện tại
   * @returns ApiResponse<IUser>
   */
  getMe: async (): Promise<ApiResponse<IUser>> => {
    const res = await privateAxios.get<ApiResponse<IUser>>("/users/me");
    return res as unknown as ApiResponse<IUser>;
  },
};
