import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "NutriLife Admin",
  description: "Quản lý NutriLife",
};

import { AuthGuard } from "@/components/auth-guard";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body
        suppressHydrationWarning
        className="font-sans antialiased min-h-screen bg-background text-foreground"
      >
        <AuthGuard>{children}</AuthGuard>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
