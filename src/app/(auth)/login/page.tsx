"use client";

import { useState } from "react";
import { Mail, Lock, EyeOff, Eye, Shield, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";

const LoginPage = () => {
  const router = useRouter();
  const loginAction = useAuthStore((state) => state.loginAction);

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setError(null);
    setIsLoading(true);
    try {
      const res = await authService.login({ email, password });

      if (res.metadata?.EC === 0 && res.data) {
        const { access_token, user } = res.data;

        // Logging structure to help debug if user is missing
        console.debug("Login successful, response data:", res.data);

        loginAction(access_token, user);
        
        toast.success(`Chào mừng trở lại!`, {
          description: user?.fullName 
            ? `Chào mừng ${user.fullName} đã quay trở lại hệ thống.` 
            : "Đăng nhập thành công vào hệ thống quản trị.",
        });

        // Gọi /users/me để lấy đầy đủ thông tin
        try {
          const meRes = await authService.getMe();
          if (meRes?.metadata?.EC === 0 && meRes.data) {
            loginAction(
              meRes.data.accessToken ?? access_token,
              meRes.data
            );
          }
        } catch {
          // fallback: dùng data từ login response
        }

        router.push("/");
      } else {
        const errorMsg = res.metadata?.message || "Đăng nhập thất bại. Vui lòng thử lại.";
        toast.error("Lỗi đăng nhập", {
          description: errorMsg,
        });
      }
    } catch (err: unknown) {
      // Tránh log lỗi nếu nó chỉ là một object rỗng (thường gặp khi serializing Axios error)
      console.error("Login process encountered an error:", err);
      
      let errorMsg = "Đã xảy ra lỗi hệ thống. Vui lòng kiểm tra lại mạng.";
      
      if (typeof err === "string") {
        errorMsg = err;
      } else if (err && typeof err === "object") {
        const anyErr = err as any;
        // Trích xuất message từ cấu hình API chuẩn { metadata: { message } }
        errorMsg = anyErr.metadata?.message || anyErr.message || errorMsg;
      } else if (err instanceof Error) {
        errorMsg = err.message;
      }
      
      toast.error("Lỗi hệ thống", {
        description: errorMsg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 font-sans login-bg">
      {/* Animated background elements */}
      <div className="login-bg-shapes">
        <div className="shape shape-1" />
        <div className="shape shape-2" />
        <div className="shape shape-3" />
        <div className="shape shape-4" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 flex w-full max-w-[1080px] overflow-hidden rounded-3xl login-card"
      >
        {/* ─── Left Panel: Admin Branding ─── */}
        <div className="hidden md:flex md:w-[45%] flex-col justify-between p-10 relative overflow-hidden login-hero">
          {/* Decorative gradient orbs */}
          <div className="login-orb login-orb-1" />
          <div className="login-orb login-orb-2" />
          <div className="login-orb login-orb-3" />

          {/* Grid pattern */}
          <div className="login-grid-pattern" />

          <div className="relative z-10 flex flex-col h-full justify-between">
            {/* Top: Branding */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex items-center gap-3 mb-12"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl login-icon-box">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black text-white tracking-tighter leading-tight">
                    Nutri<span className="text-[#CAFD00] font-extrabold italic">Life</span>
                  </span>
                  <span className="text-[9px] font-bold text-white/40 uppercase tracking-[0.2em] mt-0.5">
                    Admin Panel
                  </span>
                </div>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-[2.5rem] font-extrabold leading-[1.1] text-white tracking-tight"
              >
                Quản trị
                <br />
                hệ thống{" "}
                <span className="login-highlight-text">thông minh</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-5 text-[15px] text-white/60 max-w-[300px] leading-relaxed"
              >
                Quản lý người dùng, thực phẩm, dinh dưỡng và theo dõi hoạt động
                hệ thống từ một giao diện duy nhất.
              </motion.p>
            </div>

            {/* Bottom: Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="grid grid-cols-3 gap-3"
            >
              {[
                { label: "Người dùng", value: "2.4K+" },
                { label: "Thực phẩm", value: "15K+" },
                { label: "API Calls", value: "1.2M+" },
              ].map((stat) => (
                <div key={stat.label} className="login-stat-box">
                  <span className="text-lg font-bold text-white">
                    {stat.value}
                  </span>
                  <span className="text-[10px] font-medium text-white/40 uppercase tracking-wider">
                    {stat.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* ─── Right Panel: Login Form ─── */}
        <div className="flex w-full flex-col items-center justify-center px-8 py-12 md:w-[55%] md:px-14 lg:px-16">
          {/* Mobile Logo */}
          <div className="md:hidden mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl login-icon-box-mobile">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-foreground tracking-tighter leading-tight">
                Nutri<span className="login-brand-accent font-extrabold italic">Life</span>
              </span>
              <span className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em] mt-0.5">
                Admin Panel
              </span>
            </div>
          </div>

          <div className="w-full max-w-[380px]">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="mb-8"
            >
              <h1 className="text-[1.65rem] font-bold text-foreground tracking-tight">
                Đăng nhập Admin
              </h1>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Vui lòng đăng nhập bằng tài khoản quản trị viên để tiếp tục.
              </p>
            </motion.div>

            {/* Error Alert */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-900/50 dark:bg-red-950/30"
              >
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50">
                  <span className="text-xs text-red-600 dark:text-red-400">!</span>
                </div>
                <p className="text-sm text-red-700 dark:text-red-400 leading-relaxed">
                  {error}
                </p>
              </motion.div>
            )}

            {/* Form */}
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              onSubmit={handleSubmit}
              className="flex flex-col gap-5"
            >
              {/* Email Field */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="admin-email"
                  className="text-xs font-semibold text-muted-foreground ml-0.5 uppercase tracking-wider"
                >
                  Email
                </label>
                <div className="login-input-wrapper group">
                  <Mail className="h-[18px] w-[18px] text-muted-foreground transition-colors group-focus-within:text-foreground" />
                  <input
                    id="admin-email"
                    type="email"
                    placeholder="admin@nutrilife.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="login-input"
                    required
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="admin-password"
                  className="text-xs font-semibold text-muted-foreground ml-0.5 uppercase tracking-wider"
                >
                  Mật khẩu
                </label>
                <div className="login-input-wrapper group">
                  <Lock className="h-[18px] w-[18px] text-muted-foreground transition-colors group-focus-within:text-foreground" />
                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="login-input"
                    required
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end -mt-1">
                <Link
                  href="#"
                  className="text-sm font-semibold login-brand-accent hover:opacity-80 transition-opacity"
                >
                  Quên mật khẩu?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="login-submit-btn"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4" />
                    Đăng nhập
                  </>
                )}
              </button>
            </motion.form>

            {/* Footer */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="mt-8 text-center text-xs text-muted-foreground/60"
            >
              Bảng điều khiển quản trị dành riêng cho quản trị viên.
              <br />
              © 2026 NutriLife. All rights reserved.
            </motion.p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
