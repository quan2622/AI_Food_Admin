import type { Metadata } from "next";
import "./login/login.css";

export const metadata: Metadata = {
  title: "Đăng nhập - AI Food Admin",
  description: "Đăng nhập vào hệ thống quản trị AI Food",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
