"use client";

import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  variant?: "success" | "warning" | "danger" | "info" | "default" | "muted" | "pending";
  children: React.ReactNode;
  className?: string;
  /** Hiển thị chấm trạng thái trước text */
  showDot?: boolean;
}

const variantStyles: Record<string, string> = {
  success:
    "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-400",
  warning:
    "bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400",
  danger: "bg-red-500/10 text-red-700 border-red-500/20 dark:text-red-400",
  info: "bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400",
  pending: "bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400",
  default:
    "bg-primary/10 text-primary border-primary/20",
  muted:
    "bg-muted text-muted-foreground border-muted-foreground/20",
};

const dotStyles: Record<string, string> = {
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
  info: "bg-blue-500",
  pending: "bg-amber-400",
  default: "bg-primary",
  muted: "bg-muted-foreground/50",
};

export function StatusBadge({
  variant = "default",
  children,
  className,
  showDot = false,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className,
      )}
    >
      {showDot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full flex-shrink-0",
            dotStyles[variant]
          )}
        />
      )}
      {children}
    </span>
  );
}
