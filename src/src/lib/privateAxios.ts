import axios, {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "@/stores/authStore";
import { ApiResponse, ApiErrorResponse } from "@/types/backend.type";
import { IAuthTokenData } from "@/types/authen.type";
import publicAxios from "./publicAxios";

const NO_RETRY_HEADER = "x-no-retry";

const privateAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BACKEND_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Singleton Promise – gộp nhiều request 401 cùng lúc chỉ gọi refresh 1 lần
let refreshPromise: Promise<string | null> | null = null;

const handleRefreshToken = async (): Promise<string | null> => {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        // Dùng publicAxios tránh loop interceptor của privateAxios
        const res = (await publicAxios.post(
          "/auth/refresh-token"
        )) as ApiResponse<IAuthTokenData>;

        if (res && res.metadata?.EC === 0 && res.data) {
          return res.data.access_token || null;
        }
        return null;
      } catch {
        return null;
      } finally {
        refreshPromise = null;
      }
    })();
  }
  return refreshPromise;
};

// ───── Request Interceptor: Gắn Bearer token ─────
privateAxios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const access_token = useAuthStore.getState().access_token;
    if (access_token && config.headers) {
      config.headers.Authorization = `Bearer ${access_token}`;
    }
    return config;
  }
);

// ───── Response Interceptor ─────
privateAxios.interceptors.response.use(
  (response: AxiosResponse) => {
    // response.data = { metadata, data } từ TransformInterceptor
    return response.data;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // ── Xử lý 401: Token hết hạn → tự động refresh ──
    if (
      originalRequest &&
      error.response &&
      +error.response.status === 401 &&
      originalRequest.url !== "/auth/login" &&
      !originalRequest.headers?.[NO_RETRY_HEADER]
    ) {
      if (originalRequest.headers) {
        originalRequest.headers[NO_RETRY_HEADER] = "true";
      }

      const new_access_token = await handleRefreshToken();

      if (new_access_token) {
        useAuthStore.getState().setAccessToken(new_access_token);
        if (originalRequest.headers) {
          originalRequest.headers["Authorization"] =
            `Bearer ${new_access_token}`;
        }
        return privateAxios.request(originalRequest);
      } else {
        const message =
          "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.";
        useAuthStore.getState().setRefreshTokenAction(true, message);
      }
    }

    // ── Xử lý 400 từ endpoint refreshToken ──
    if (
      originalRequest &&
      error.response &&
      +error.response.status === 400 &&
      originalRequest.url === "/auth/refresh-token"
    ) {
      const data = error.response.data as ApiErrorResponse;
      const message =
        data?.message ||
        "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.";
      useAuthStore.getState().setRefreshTokenAction(true, message);
    }

    // Luôn reject bằng ApiErrorResponse để component catch được
    return Promise.reject(error?.response?.data || error);
  }
);

export default privateAxios;
