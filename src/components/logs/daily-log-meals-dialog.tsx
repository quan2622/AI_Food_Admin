"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { StatusBadge } from "@/components/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { logsService } from "@/services/logsService";
import type {
  IDailyLogDetail,
  IMealByDailyLog,
  IMealGroup,
  IMealInGroup,
} from "@/types/logs.type";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { ceilGoalMetric, cn } from "@/lib/utils";

const mealTypeMap: Record<string, { label: string; variant: "info" | "success" | "warning" | "danger" | "default" }> = {
  MEAL_BREAKFAST: { label: "Sáng", variant: "info" },
  MEAL_LUNCH: { label: "Trưa", variant: "success" },
  MEAL_DINNER: { label: "Tối", variant: "warning" },
  MEAL_SNACK: { label: "Ăn vặt", variant: "danger" },
};

const dailyStatusMap: Record<string, { label: string; variant: "success" | "warning" | "danger" | "info" }> = {
  STATUS_BELOW: { label: "Dưới mục tiêu", variant: "warning" },
  STATUS_MET: { label: "Đạt mục tiêu", variant: "success" },
  STATUS_ABOVE: { label: "Vượt mục tiêu", variant: "danger" },
};

export type DailyLogMealsContext = {
  id: number;
  userName: string;
  logDate: string;
  userId: number;
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

function groupTypeLabel(group: IMealGroup): string {
  return (
    group.mealTypeInfo?.value ||
    group.mealTypeInfo?.description ||
    mealTypeMap[group.mealType]?.label ||
    group.mealType
  );
}

function groupTypeVariant(
  group: IMealGroup
): "info" | "success" | "warning" | "danger" | "default" {
  return mealTypeMap[group.mealType]?.variant ?? "default";
}

function groupTotalKcal(group: IMealGroup): number {
  return group.meals.reduce(
    (s, m) =>
      s +
      (m.totalCalories != null && !Number.isNaN(Number(m.totalCalories))
        ? Number(m.totalCalories)
        : 0),
    0
  );
}

/** Một bảng duy nhất cho toàn bộ món trong nhóm buổi ăn */
function MealGroupItemsTable({ group }: { group: IMealGroup }) {
  const showMealColumn = group.meals.length > 1;
  const rows = group.meals.flatMap((meal) =>
    (meal.mealItems ?? []).map((item, idx) => ({
      meal,
      item,
      key: `${meal.id}-${item.id ?? idx}`,
    }))
  );

  const groupKcal = group.meals.reduce(
    (s, m) => s + (m.totalCalories != null && !Number.isNaN(Number(m.totalCalories))
      ? Number(m.totalCalories)
      : 0),
    0
  );

  if (rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground px-3 py-4 rounded-lg border border-border bg-card/50">
        Không có món trong nhóm này.
      </p>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card/50 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            {showMealColumn && (
              <TableHead className="w-[104px] align-middle text-xs font-normal text-muted-foreground">
                Giờ / Meal
              </TableHead>
            )}
            <TableHead className="w-12" />
            <TableHead>Món</TableHead>
            <TableHead className="text-right w-16">SL</TableHead>
            <TableHead className="text-right w-20">g</TableHead>
            <TableHead className="text-right w-20">kcal</TableHead>
            <TableHead className="text-right w-14">P</TableHead>
            <TableHead className="text-right w-14">C</TableHead>
            <TableHead className="text-right w-14">F</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(({ meal, item, key }) => (
            <TableRow key={key}>
              {showMealColumn && (
                <TableCell className="align-middle text-muted-foreground">
                  <div className="flex flex-col gap-0.5 text-xs">
                    {meal.mealDateTime ? (
                      <span>
                        {new Date(meal.mealDateTime).toLocaleString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    ) : (
                      <span>—</span>
                    )}
                    <span className="font-mono text-[10px] opacity-80">#{meal.id}</span>
                    {meal.totalCalories != null &&
                      !Number.isNaN(Number(meal.totalCalories)) && (
                      <span className="text-primary font-medium">
                        {ceilGoalMetric(meal.totalCalories)} kcal
                      </span>
                    )}
                  </div>
                </TableCell>
              )}
              <TableCell className="align-middle">
                {item.food?.imageUrl ? (
                  <img
                    src={item.food.imageUrl}
                    alt=""
                    className="h-9 w-9 rounded-md object-cover border border-border"
                  />
                ) : (
                  <div className="h-9 w-9 rounded-md bg-muted" />
                )}
              </TableCell>
              <TableCell className="font-medium">
                {item.food?.foodName ?? "—"}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {item.quantity != null ? ceilGoalMetric(item.quantity) : "—"}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {item.grams != null ? ceilGoalMetric(item.grams) : "—"}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {item.calories != null ? ceilGoalMetric(item.calories) : "—"}
              </TableCell>
              <TableCell className="text-right tabular-nums text-blue-600">
                {item.protein != null ? ceilGoalMetric(item.protein) : "—"}
              </TableCell>
              <TableCell className="text-right tabular-nums text-amber-600">
                {item.carbs != null ? ceilGoalMetric(item.carbs) : "—"}
              </TableCell>
              <TableCell className="text-right tabular-nums text-red-600">
                {item.fat != null ? ceilGoalMetric(item.fat) : "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {groupKcal > 0 && (
        <div className="px-3 py-2 border-t bg-muted/20 text-xs text-muted-foreground">
          Tổng nhóm:{" "}
          <span className="font-medium text-foreground">
            {ceilGoalMetric(groupKcal)} kcal
          </span>
        </div>
      )}
    </div>
  );
}

function MealItemsTable({ meal }: { meal: IMealInGroup | IMealByDailyLog }) {
  const items = meal.mealItems ?? [];
  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground px-3 py-4">
        Không có món trong bữa này.
      </p>
    );
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12" />
          <TableHead>Món</TableHead>
          <TableHead className="text-right w-16">SL</TableHead>
          <TableHead className="text-right w-20">g</TableHead>
          <TableHead className="text-right w-20">kcal</TableHead>
          <TableHead className="text-right w-14">P</TableHead>
          <TableHead className="text-right w-14">C</TableHead>
          <TableHead className="text-right w-14">F</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item, idx) => (
          <TableRow key={item.id ?? idx}>
            <TableCell className="align-middle">
              {item.food?.imageUrl ? (
                <img
                  src={item.food.imageUrl}
                  alt=""
                  className="h-9 w-9 rounded-md object-cover border border-border"
                />
              ) : (
                <div className="h-9 w-9 rounded-md bg-muted" />
              )}
            </TableCell>
            <TableCell className="font-medium">
              {item.food?.foodName ?? "—"}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {item.quantity != null ? ceilGoalMetric(item.quantity) : "—"}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {item.grams != null ? ceilGoalMetric(item.grams) : "—"}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {item.calories != null ? ceilGoalMetric(item.calories) : "—"}
            </TableCell>
            <TableCell className="text-right tabular-nums text-blue-600">
              {item.protein != null ? ceilGoalMetric(item.protein) : "—"}
            </TableCell>
            <TableCell className="text-right tabular-nums text-amber-600">
              {item.carbs != null ? ceilGoalMetric(item.carbs) : "—"}
            </TableCell>
            <TableCell className="text-right tabular-nums text-red-600">
              {item.fat != null ? ceilGoalMetric(item.fat) : "—"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function hasMealContent(detail: IDailyLogDetail): boolean {
  const g = detail.mealGroups?.length ?? 0;
  if (g > 0) return true;
  const m = detail.meals?.length ?? 0;
  return m > 0;
}

export function DailyLogMealsDialog({
  open,
  onOpenChange,
  dailyLog,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dailyLog: DailyLogMealsContext | null;
}) {
  const [loading, setLoading] = React.useState(false);
  const [detail, setDetail] = React.useState<IDailyLogDetail | null>(null);

  React.useEffect(() => {
    if (!open || !dailyLog) {
      setDetail(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const data = await logsService.getDailyLogDetailForUser(
          dailyLog.userId,
          dailyLog.id
        );
        if (!cancelled) setDetail(data);
      } catch (e: unknown) {
        if (!cancelled) {
          setDetail(null);
          const { statusCode, message } = getErrorPayload(e);
          if (statusCode === 404) {
            toast.error(
              message || `Daily log #${dailyLog.id} không tồn tại.`
            );
          } else if (statusCode === 403) {
            toast.error(
              message ||
                "Daily log này không thuộc user đã chỉ định."
            );
          } else {
            toast.error(message || "Không thể tải chi tiết daily log.");
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, dailyLog?.id, dailyLog?.userId]);

  if (!dailyLog && !open) return null;

  const titleLog = dailyLog
    ? new Date(dailyLog.logDate).toLocaleDateString("vi-VN", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "";

  const headerStatusLabel =
    detail?.statusInfo?.description ||
    detail?.statusInfo?.value ||
    (detail?.status ? dailyStatusMap[detail.status]?.label : null) ||
    detail?.status;

  const headerStatusVariant =
    (detail?.status && dailyStatusMap[detail.status]?.variant) || "default";

  const useGroups = (detail?.mealGroups?.length ?? 0) > 0;

  const infoRowClass =
    "flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm leading-relaxed";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex! max-h-[90vh] min-h-0 w-[min(96vw,960px)] flex-col gap-0 overflow-hidden p-0 sm:max-w-[960px]">
        <DialogHeader className="min-h-0 max-h-[min(55vh,28rem)] shrink-0 overflow-y-auto border-b border-border px-6 pt-6 pb-4 space-y-0">
          <DialogTitle asChild>
            <div className="flex flex-wrap items-center gap-3 text-left text-lg font-semibold tracking-tight">
              <span>Chi tiết Daily log</span>
              <span
                className="hidden h-4 w-px bg-border sm:inline-block"
                aria-hidden
              />
              <span className="font-mono text-base font-normal text-muted-foreground">
                #{dailyLog?.id ?? "—"}
              </span>
            </div>
          </DialogTitle>

          {dailyLog && (
            <div className="mt-6 space-y-4 text-sm">
              <div className={infoRowClass}>
                <span className="text-muted-foreground shrink-0">Người dùng:</span>
                <span className="font-medium">{dailyLog.userName}</span>
                <span className="text-muted-foreground">
                  · User ID {dailyLog.userId}
                </span>
              </div>
              <div className={infoRowClass}>
                <span className="text-muted-foreground shrink-0">Ngày:</span>
                <span className="font-medium">{titleLog}</span>
              </div>
              {!loading && detail && (
                <>
                  {headerStatusLabel && (
                    <div className={`${infoRowClass} items-center`}>
                      <span className="text-muted-foreground shrink-0">
                        Trạng thái ngày:
                      </span>
                      <StatusBadge variant={headerStatusVariant}>
                        {headerStatusLabel}
                      </StatusBadge>
                    </div>
                  )}
                  {detail.totalCalories != null &&
                    !Number.isNaN(Number(detail.totalCalories)) && (
                    <div className={infoRowClass}>
                      <span className="text-muted-foreground shrink-0">
                        Tổng calories (ngày):
                      </span>
                      <span className="font-medium tabular-nums">
                        {ceilGoalMetric(detail.totalCalories)} kcal
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </DialogHeader>

        <div
          className={cn(
            "flex min-h-0 flex-col overflow-hidden",
            (loading || (detail != null && hasMealContent(detail))) && "flex-1"
          )}
        >
          {loading ? (
            <div className="flex flex-1 items-center justify-center gap-2 py-12 text-muted-foreground px-6">
              <Loader2 className="h-5 w-5 animate-spin" />
              Đang tải chi tiết…
            </div>
          ) : !detail ? (
            <p className="text-sm text-muted-foreground py-8 text-center px-6">
              Không có dữ liệu chi tiết.
            </p>
          ) : !hasMealContent(detail) ? (
            <p className="text-sm text-muted-foreground py-8 text-center px-6">
              Không có bữa ăn nào trong daily log này.
            </p>
          ) : (
            <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden px-6 pb-6 pt-4">
              <h3 className="shrink-0 text-sm font-semibold text-foreground">
                Danh sách buổi ăn
              </h3>
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 [scrollbar-gutter:stable]">
                {useGroups ? (
                  <Accordion
                    type="multiple"
                    className="w-full rounded-lg border border-border bg-card/40"
                  >
                    {detail.mealGroups!.map((group: IMealGroup, gi: number) => {
                      const gKcal = groupTotalKcal(group);
                      const label = groupTypeLabel(group);
                      return (
                        <AccordionItem
                          key={`${group.mealType}-${gi}`}
                          value={`meal-group-${gi}`}
                          className="px-3"
                        >
                          <AccordionTrigger className="items-center py-3 hover:no-underline">
                            <div className="flex flex-1 flex-wrap items-center gap-2 pr-2 text-left">
                              <StatusBadge variant={groupTypeVariant(group)}>
                                {label}
                              </StatusBadge>
                              {gKcal > 0 && (
                                <span className="text-xs font-medium tabular-nums text-primary">
                                  {ceilGoalMetric(gKcal)} kcal
                                </span>
                              )}
                              <span className="text-xs text-muted-foreground">
                                {group.meals.length} bữa
                              </span>
                              {group.mealTypeInfo?.description &&
                                group.mealTypeInfo.description !== label && (
                                <span className="text-xs text-muted-foreground line-clamp-2 max-w-[min(100%,20rem)]">
                                  {group.mealTypeInfo.description}
                                </span>
                              )}
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pb-3 pt-0">
                            {group.meals.length === 0 ? (
                              <p className="text-sm text-muted-foreground py-2">
                                Chưa có bản ghi bữa ăn trong nhóm này.
                              </p>
                            ) : (
                              <MealGroupItemsTable group={group} />
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                ) : (
                  <Accordion
                    type="multiple"
                    className="w-full rounded-lg border border-border bg-card/40"
                  >
                    {(detail.meals ?? []).map((meal: IMealByDailyLog) => {
                      const mt =
                        mealTypeMap[meal.mealType] ?? {
                          label: meal.mealType,
                          variant: "default" as const,
                        };
                      const dt =
                        meal.mealDateTime != null
                          ? new Date(meal.mealDateTime).toLocaleString(
                              "vi-VN",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )
                          : null;
                      return (
                        <AccordionItem
                          key={meal.id}
                          value={`meal-flat-${meal.id}`}
                          className="px-3"
                        >
                          <AccordionTrigger className="items-center py-3 hover:no-underline">
                            <div className="flex flex-1 flex-wrap items-center gap-2 pr-2 text-left">
                              <StatusBadge variant={mt.variant}>{mt.label}</StatusBadge>
                              {dt && (
                                <span className="text-xs text-muted-foreground">
                                  {dt}
                                </span>
                              )}
                              {meal.totalCalories != null &&
                                !Number.isNaN(Number(meal.totalCalories)) && (
                                <span className="text-xs font-medium tabular-nums text-primary">
                                  {ceilGoalMetric(meal.totalCalories)} kcal
                                </span>
                              )}
                              <span className="text-xs font-mono text-muted-foreground">
                                Meal #{meal.id}
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pb-3 pt-0">
                            <div className="overflow-hidden rounded-lg border border-border">
                              <MealItemsTable meal={meal} />
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
