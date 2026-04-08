"use client";

import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DataTableDetailButtonProps = {
  onClick: () => void;
  /** Mặc định: "Chi tiết" */
  label?: string;
  /** `aria-label` — mặc định trùng `label` */
  "aria-label"?: string;
  className?: string;
};

/** Nút xem chi tiết thống nhất cho các bảng admin (logs, nutrition, …) */
export function DataTableDetailButton({
  onClick,
  label = "Chi tiết",
  "aria-label": ariaLabel,
  className,
}: DataTableDetailButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={cn("shrink-0 gap-0 font-normal", className)}
      aria-label={ariaLabel ?? label}
      onClick={onClick}
    >
      <Eye className="mr-1.5 h-4 w-4 shrink-0" aria-hidden />
      <span>{label}</span>
    </Button>
  );
}
