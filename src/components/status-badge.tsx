"use client";

import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  variant?: "success" | "warning" | "danger" | "info" | "default" | "muted";
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<string, string> = {
  success:
    "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
  warning:
    "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
  danger: "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400",
  info: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400",
  default:
    "bg-primary/10 text-primary border-primary/20",
  muted:
    "bg-muted text-muted-foreground border-muted-foreground/20",
};

export function StatusBadge({
  variant = "default",
  children,
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
