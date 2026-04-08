import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Làm tròn lên số nguyên cho chỉ số mục tiêu dinh dưỡng (không hiển thị phần thập phân). */
export function ceilGoalMetric(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(n)) return 0;
  return Math.ceil(n);
}
