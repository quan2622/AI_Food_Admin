"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StatusBadge } from "@/components/status-badge";
import { MealItemsTable } from "@/components/logs/daily-log-meals-dialog";
import { logsService } from "@/services/logsService";
import type { IMealDetailAdmin } from "@/types/logs.type";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { ceilGoalMetric, cn } from "@/lib/utils";

const mealTypeMap: Record<
  string,
  { label: string; variant: "info" | "success" | "warning" | "danger" | "default" }
> = {
  MEAL_BREAKFAST: { label: "Sáng", variant: "info" },
  MEAL_LUNCH: { label: "Trưa", variant: "success" },
  MEAL_DINNER: { label: "Tối", variant: "warning" },
  MEAL_SNACK: { label: "Ăn vặt", variant: "danger" },
};

function getErrorPayload(e: unknown): { statusCode?: number; message?: string } {
  if (e && typeof e === "object") {
    const o = e as Record<string, unknown>;
    const statusCode =
      typeof o.statusCode === "number"
        ? o.statusCode
        : typeof o.status === "number"
          ? o.status
          : undefined;
    const message = typeof o.message === "string" ? o.message : undefined;
    return { statusCode, message };
  }
  return {};
}

export type MealDetailContext = {
  userId: number;
  mealId: number;
  userName: string;
};

/** Nhãn nhỏ + giá trị — dùng trong lưới 2 cột */
function InfoField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-0">
      <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <div className="min-w-0 text-sm leading-snug">{children}</div>
    </div>
  );
}

export function MealDetailDialog({
  open,
  onOpenChange,
  context,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  context: MealDetailContext | null;
}) {
  const [loading, setLoading] = React.useState(false);
  const [meal, setMeal] = React.useState<IMealDetailAdmin | null>(null);

  React.useEffect(() => {
    if (!open || !context) {
      setMeal(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const data = await logsService.getMealDetailForUser(
          context.userId,
          context.mealId
        );
        if (!cancelled) setMeal(data);
      } catch (e: unknown) {
        if (!cancelled) {
          setMeal(null);
          const { statusCode, message } = getErrorPayload(e);
          if (statusCode === 404) {
            toast.error(
              message || `Meal #${context.mealId} không tồn tại.`
            );
          } else if (statusCode === 403) {
            toast.error(
              message ||
                "Bữa ăn này không thuộc user đã chỉ định."
            );
          } else {
            toast.error(message || "Không thể tải chi tiết bữa ăn.");
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, context?.mealId, context?.userId]);

  if (!context && !open) return null;

  const typeLabel =
    meal?.mealTypeInfo?.value ||
    meal?.mealTypeInfo?.description ||
    mealTypeMap[meal?.mealType ?? ""]?.label ||
    meal?.mealType;

  const typeVariant = mealTypeMap[meal?.mealType ?? ""]?.variant ?? "default";

  const logDateStr =
    meal?.dailyLog?.logDate != null
      ? new Date(meal.dailyLog.logDate).toLocaleDateString("vi-VN", {
          weekday: "long",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : null;

  const mealTimeStr =
    meal?.mealDateTime != null
      ? new Date(meal.mealDateTime).toLocaleString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })
      : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex! max-h-[min(88vh,800px)] min-h-0 w-[min(95vw,42rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
        <DialogHeader className="min-h-0 max-h-[min(42vh,24rem)] shrink-0 overflow-y-auto border-b border-border px-5 pt-4 pb-3 space-y-0">
          <DialogTitle asChild>
            <div className="flex flex-wrap items-center gap-2 text-left text-base font-semibold tracking-tight">
              <span>Chi tiết bữa ăn</span>
              <span
                className="hidden h-3.5 w-px bg-border sm:inline-block"
                aria-hidden
              />
              <span className="font-mono text-sm font-normal text-muted-foreground">
                #{context?.mealId ?? "—"}
              </span>
            </div>
          </DialogTitle>

          {context && (
            <div className="mt-3 text-sm">
              <div className="grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
                <InfoField label="Người dùng">
                  <span className="font-medium">{context.userName}</span>
                  <span className="text-muted-foreground">
                    {" "}
                    · ID {context.userId}
                  </span>
                </InfoField>
                {!loading && meal?.dailyLog != null && (
                  <InfoField label="Daily log">
                    <span className="font-medium">#{meal.dailyLog.id}</span>
                    {logDateStr && (
                      <span className="text-muted-foreground">
                        {" "}
                        · {logDateStr}
                      </span>
                    )}
                  </InfoField>
                )}
                {!loading && mealTimeStr && (
                  <InfoField label="Thời gian bữa">
                    <span className="font-medium tabular-nums">{mealTimeStr}</span>
                  </InfoField>
                )}
                {!loading && typeLabel && (
                  <InfoField label="Loại bữa">
                    <StatusBadge variant={typeVariant}>{typeLabel}</StatusBadge>
                  </InfoField>
                )}
              </div>
              {!loading &&
                meal &&
                (meal.totalCalories != null ||
                  meal.totalProtein != null ||
                  meal.totalCarbs != null ||
                  meal.totalFat != null) && (
                <div className="mt-2.5 border-t border-border pt-2.5">
                  <InfoField label="Tổng macro">
                    <span className="font-medium tabular-nums">
                      {meal.totalCalories != null &&
                      !Number.isNaN(Number(meal.totalCalories))
                        ? `${ceilGoalMetric(meal.totalCalories)} kcal`
                        : "—"}
                      {meal.totalProtein != null &&
                        !Number.isNaN(Number(meal.totalProtein)) && (
                        <span className="text-blue-600">
                          {" "}
                          · P {ceilGoalMetric(meal.totalProtein)}g
                        </span>
                      )}
                      {meal.totalCarbs != null &&
                        !Number.isNaN(Number(meal.totalCarbs)) && (
                        <span className="text-amber-600">
                          {" "}
                          · C {ceilGoalMetric(meal.totalCarbs)}g
                        </span>
                      )}
                      {meal.totalFat != null &&
                        !Number.isNaN(Number(meal.totalFat)) && (
                        <span className="text-red-600">
                          {" "}
                          · F {ceilGoalMetric(meal.totalFat)}g
                        </span>
                      )}
                    </span>
                  </InfoField>
                </div>
              )}
            </div>
          )}
        </DialogHeader>

        <div
          className={cn(
            "flex min-h-0 flex-col overflow-hidden",
            (loading || meal != null) && "flex-1"
          )}
        >
          {loading ? (
            <div className="flex flex-1 items-center justify-center gap-2 py-10 text-sm text-muted-foreground px-5">
              <Loader2 className="h-5 w-5 animate-spin" />
              Đang tải chi tiết…
            </div>
          ) : !meal ? (
            <p className="text-sm text-muted-foreground py-8 text-center px-5">
              Không có dữ liệu chi tiết.
            </p>
          ) : (
            <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden px-5 pb-5 pt-3">
              <h3 className="shrink-0 text-sm font-semibold text-foreground">
                Món ăn
              </h3>
              <div className="min-h-0 flex-1 overflow-y-auto overflow-x-auto overscroll-contain [scrollbar-gutter:stable]">
                <div className="rounded-lg border border-border text-sm [&_img]:h-8 [&_img]:w-8 [&_td]:py-1.5 [&_th]:h-9 [&_th]:py-1.5 [&_th]:text-xs">
                  <MealItemsTable meal={meal} />
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
