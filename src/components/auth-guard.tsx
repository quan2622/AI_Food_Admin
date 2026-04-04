"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useAuthInit } from "@/hooks/useAuthInit";
import { ShieldAlert, Loader2 } from "lucide-react";

/**
 * Các đường dẫn không yêu cầu bảo vệ (Public Paths).
 * Thêm các route /login, /forgot-password,... nếu cần mở rộng.
 */
const publicPaths = ["/login", "/forgot-password"];

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isInitializing } = useAuthInit();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Chỉ kích hoạt redirect khi ứng dụng đã hoàn tất bước khởi tạo (hydrate xong localStorage và gọi /users/me)
    if (!isInitializing) {
      const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

      // CASE: Chưa đăng nhập cố tình vào trang yêu cầu quyền Admin
      if (!isAuthenticated && !isPublicPath) {
        console.warn(`Unauthorized access to ${pathname} -> Redirect to /login`);
        router.replace("/login");
      }

      // CASE: Đã đăng nhập cố tình quay lại trang /login -> Đẩy về Dashboard
      if (isAuthenticated && isPublicPath) {
        console.info(`Already logged in -> Redirect to dashboard from ${pathname}`);
        router.push("/");
      }
    }
  }, [isInitializing, isAuthenticated, pathname, router]);

  // Trong lúc app đang đọc dữ liệu từ cache hoặc đồng bộ token -> Hiển thị Loading chuyên nghiệp
  if (isInitializing) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background p-6">
        <div className="relative mb-4 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary opacity-20" />
          <ShieldAlert className="absolute h-6 w-6 text-primary" />
        </div>
        <p className="animate-pulse text-sm font-medium text-muted-foreground">
          Đang xác thực thông tin...
        </p>
      </div>
    );
  }

  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // Nếu chưa đăng nhập cố vào trang kín -> Chặn render component để tránh flash content không mong muốn
  if (!isAuthenticated && !isPublicPath) {
    return null;
  }

  // Cho phép render nội dung cho người dùng hợp lệ hoặc trang công khai
  return <>{children}</>;
};
