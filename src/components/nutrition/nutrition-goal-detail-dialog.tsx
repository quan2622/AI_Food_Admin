"use client";

import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { StatusBadge } from "@/components/status-badge";
import type { INutritionGoal } from "@/types/nutrition.type";
import { ceilGoalMetric } from "@/lib/utils";

const goalTypeMap: Record<string, { label: string; variant: "info" | "success" | "warning" | "danger" }> = {
  GOAL_LOSS: { label: "Giảm cân", variant: "danger" },
  GOAL_GAIN: { label: "Tăng cân", variant: "success" },
  GOAL_MAINTAIN: { label: "Duy trì", variant: "info" },
  GOAL_STRICT: { label: "Nghiêm ngặt", variant: "warning" },
};

const statusMap: Record<string, { label: string; variant: "info" | "success" | "warning" | "danger" }> = {
  NUTR_GOAL_ONGOING: { label: "Đang thực hiện", variant: "info" },
  NUTR_GOAL_COMPLETED: { label: "Hoàn thành", variant: "success" },
  NUTR_GOAL_PAUSED: { label: "Tạm dừng", variant: "warning" },
  NUTR_GOAL_FAILED: { label: "Thất bại", variant: "danger" },
};

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-2 py-1.5 text-sm border-b border-border/60 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="col-span-2 font-medium">{value}</span>
    </div>
  );
}

export function NutritionGoalDetailDialog({
  open,
  onOpenChange,
  goal,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal: INutritionGoal | null;
}) {
  if (!goal) return null;

  const gt = goalTypeMap[goal.goalType] ?? { label: goal.goalType, variant: "muted" as const };
  const st = statusMap[goal.status] ?? { label: goal.status, variant: "muted" as const };
  const userLabel =
    goal.user?.fullName || goal.user?.email || (goal.userId ? `User #${goal.userId}` : "—");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Mục tiêu dinh dưỡng #{goal.id}</DialogTitle>
          <DialogDescription>
            Chi tiết từ API (user kèm theo nếu có)
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-1 pt-2">
          <Row label="Người dùng" value={userLabel} />
          <Row
            label="Loại mục tiêu"
            value={<StatusBadge variant={gt.variant}>{gt.label}</StatusBadge>}
          />
          <Row
            label="Trạng thái"
            value={<StatusBadge variant={st.variant}>{st.label}</StatusBadge>}
          />
          <Row
            label="Cân nặng mục tiêu"
            value={
              goal.targetWeight != null ? `${ceilGoalMetric(goal.targetWeight)} kg` : "—"
            }
          />
          <Row label="Calories" value={`${ceilGoalMetric(goal.targetCalories)} kcal`} />
          <Row label="Protein" value={`${ceilGoalMetric(goal.targetProtein)} g`} />
          <Row label="Carbs" value={`${ceilGoalMetric(goal.targetCarbs)} g`} />
          <Row label="Fat" value={`${ceilGoalMetric(goal.targetFat)} g`} />
          <Row label="Chất xơ" value={`${ceilGoalMetric(goal.targetFiber)} g`} />
          <Row
            label="Bắt đầu"
            value={new Date(goal.startDate).toLocaleDateString("vi-VN")}
          />
          <Row
            label="Kết thúc"
            value={new Date(goal.endDate).toLocaleDateString("vi-VN")}
          />
          {goal.createdAt && (
            <Row
              label="Tạo lúc"
              value={new Date(goal.createdAt).toLocaleString("vi-VN")}
            />
          )}
          {goal.updatedAt && (
            <Row
              label="Cập nhật"
              value={new Date(goal.updatedAt).toLocaleString("vi-VN")}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
