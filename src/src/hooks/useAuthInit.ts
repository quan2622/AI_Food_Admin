"use client";

import { useEffect, useState } from "react";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";

/**
 * Hook để khởi tạo trạng thái Auth khi ứng dụng bắt đầu load.
 * Nó kiểm tra xem Zustand đã hydrate (khôi phục dữ liệu từ localStorage) xong chưa,
 * sau đó gọi API /users/me để đồng bộ thông tin user mới nhất nếu có token.
 */
export const useAuthInit = () => {
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const runInit = async () => {
      const { access_token, setUser, setAccessToken, logoutAction } =
        useAuthStore.getState();

      // Trường hợp không có token trong localStorage -> Coi như chưa đăng nhập
      if (!access_token) {
        setIsInitializing(false);
        return;
      }

      // Có token -> Gọi API /users/me để lấy dữ liệu user mới nhất
      try {
        const res = await authService.getMe();
        if (res?.metadata?.EC === 0 && res.data) {
          setUser(res.data);
          // Cập nhật token mới nếu Backend có cơ chế rotate token trong header/body
          if (res.data.accessToken) {
            setAccessToken(res.data.accessToken);
          }
        } else {
          // Lỗi logic từ backend (VD: User bị khóa) -> Xóa toàn bộ session
          logoutAction();
        }
      } catch (error: any) {
        // Lỗi 401: Interceptor của privateAxios sẽ tự động xử lý refresh hoặc logout
        // Ở đây chúng ta giữ nguyên trạng thái cache nếu là lỗi Network/Server để tránh logout nhầm
        
        const errorMsg = error?.metadata?.message || error?.message || "";
        
        if (errorMsg === "Tài khoản không tồn tại") {
          logoutAction();
          toast.error("Phiên đăng nhập không hợp lệ", {
            description: "Tài khoản của bạn không tồn tại trên hệ thống. Vui lòng đăng nhập lại.",
          });
        } else if (error.isAxiosError && error.message === "Network Error") {
          console.warn("Auth init sync failed: Backend unreachable (Network Error).");
        } else {
          console.error("Auth init sync failed:", errorMsg || error);
        }
      } finally {
        setIsInitializing(false);
      }
    };

    // Kiểm tra xem Zustand đã hydrate xong chưa (đọc từ localStorage xong chưa)
    if (useAuthStore.persist.hasHydrated()) {
      runInit();
    } else {
      // Nếu chưa, đăng ký callback khi khôi phục xong
      const unsub = useAuthStore.persist.onFinishHydration(() => {
        runInit();
      });
      return unsub;
    }
  }, []);

  return { isInitializing };
};
