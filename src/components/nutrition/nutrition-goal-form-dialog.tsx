"use client";

import { useEffect, useState } from "react";
import { useForm, type UseFormRegisterReturn, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { nutritionService } from "@/services/nutritionService";
import { ceilGoalMetric } from "@/lib/utils";
import { Loader2, Target } from "lucide-react";
import type {
  GoalType,
  INutritionGoal,
  NutritionGoalStatus,
} from "@/types/nutrition.type";

/** Row từ bảng admin có thể kèm userName để search */
export type NutritionGoalFormInitial = INutritionGoal & { userName?: string };

const goalTypes: { value: GoalType; label: string }[] = [
  { value: "GOAL_LOSS", label: "Giảm cân" },
  { value: "GOAL_GAIN", label: "Tăng cân" },
  { value: "GOAL_MAINTAIN", label: "Duy trì" },
  { value: "GOAL_STRICT", label: "Nghiêm ngặt" },
];

const statusTypes: { value: NutritionGoalStatus; label: string }[] = [
  { value: "NUTR_GOAL_ONGOING", label: "Đang thực hiện" },
  { value: "NUTR_GOAL_COMPLETED", label: "Hoàn thành" },
  { value: "NUTR_GOAL_PAUSED", label: "Tạm dừng" },
  { value: "NUTR_GOAL_FAILED", label: "Thất bại" },
];

const numeric = z
  .union([z.string(), z.number()])
  .transform((v) => (typeof v === "string" ? Number(v) : v))
  .refine((n) => typeof n === "number" && !Number.isNaN(n), "Phải là số");

const intMetric = (minMsg: string) =>
  numeric
    .pipe(z.number().min(0, minMsg))
    .transform((n) => ceilGoalMetric(n));

const createSchema = z.object({
  goalType: z.enum(["GOAL_LOSS", "GOAL_GAIN", "GOAL_MAINTAIN", "GOAL_STRICT"]),
  status: z.enum([
    "NUTR_GOAL_ONGOING",
    "NUTR_GOAL_COMPLETED",
    "NUTR_GOAL_PAUSED",
    "NUTR_GOAL_FAILED",
  ]).optional(),
  targetWeight: intMetric("Cân nặng ≥ 0"),
  targetCalories: intMetric("Calories ≥ 0"),
  targetProtein: intMetric("Protein ≥ 0"),
  targetCarbs: intMetric("Carbs ≥ 0"),
  targetFat: intMetric("Fat ≥ 0"),
  targetFiber: intMetric("Chất xơ ≥ 0"),
  startDate: z.string().min(1, "Chọn ngày bắt đầu"),
  endDate: z.string().min(1, "Chọn ngày kết thúc"),
});

const editSchema = createSchema.partial();

type CreateForm = z.infer<typeof createSchema>;
type EditForm = z.infer<typeof editSchema>;
type Mode = "create" | "edit";

function toDateInput(iso: string | undefined): string {
  if (!iso) return "";
  try {
    return new Date(iso).toISOString().split("T")[0];
  } catch {
    return "";
  }
}

interface NutritionGoalFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  mode?: Mode;
  initialData?: NutritionGoalFormInitial | null;
}

export function NutritionGoalFormDialog({
  open,
  onOpenChange,
  onSuccess,
  mode = "create",
  initialData,
}: NutritionGoalFormDialogProps) {
  const [loading, setLoading] = useState(false);

  const createForm = useForm<CreateForm>({
    resolver: zodResolver(createSchema) as Resolver<CreateForm>,
    defaultValues: {
      goalType: "GOAL_LOSS",
      status: "NUTR_GOAL_ONGOING",
      targetWeight: 65,
      targetCalories: 1800,
      targetProtein: 120,
      targetCarbs: 180,
      targetFat: 60,
      targetFiber: 30,
      startDate: "",
      endDate: "",
    },
  });

  const editForm = useForm<EditForm>({
    resolver: zodResolver(editSchema) as Resolver<EditForm>,
    defaultValues: {},
  });

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && initialData) {
      editForm.reset({
        goalType: initialData.goalType as GoalType,
        status: initialData.status as NutritionGoalStatus,
        targetWeight:
          initialData.targetWeight != null
            ? ceilGoalMetric(initialData.targetWeight)
            : undefined,
        targetCalories: ceilGoalMetric(initialData.targetCalories),
        targetProtein: ceilGoalMetric(initialData.targetProtein),
        targetCarbs: ceilGoalMetric(initialData.targetCarbs),
        targetFat: ceilGoalMetric(initialData.targetFat),
        targetFiber: ceilGoalMetric(initialData.targetFiber),
        startDate: toDateInput(initialData.startDate),
        endDate: toDateInput(initialData.endDate),
      });
    } else if (mode === "create") {
      const today = new Date().toISOString().split("T")[0];
      createForm.reset({
        goalType: "GOAL_LOSS",
        status: "NUTR_GOAL_ONGOING",
        targetWeight: 65,
        targetCalories: 1800,
        targetProtein: 120,
        targetCarbs: 180,
        targetFat: 60,
        targetFiber: 30,
        startDate: today,
        endDate: today,
      });
    }
  }, [open, mode, initialData, createForm, editForm]);

  const onCreate = async (values: CreateForm) => {
    try {
      setLoading(true);
      await nutritionService.createNutritionGoal({
        goalType: values.goalType,
        targetWeight: values.targetWeight,
        targetCalories: values.targetCalories,
        targetProtein: values.targetProtein,
        targetCarbs: values.targetCarbs,
        targetFat: values.targetFat,
        targetFiber: values.targetFiber,
        startDate: values.startDate,
        endDate: values.endDate,
        status: values.status,
      });
      toast.success("Đã tạo mục tiêu dinh dưỡng");
      onOpenChange(false);
      onSuccess?.();
    } catch (error: unknown) {
      toast.error(
        (error as { message?: string })?.message || "Tạo mục tiêu thất bại"
      );
    } finally {
      setLoading(false);
    }
  };

  const onEdit = async (values: EditForm) => {
    if (!initialData) return;
    try {
      setLoading(true);
      await nutritionService.updateNutritionGoal(initialData.id, {
        goalType: values.goalType,
        status: values.status,
        targetWeight: values.targetWeight,
        targetCalories: values.targetCalories,
        targetProtein: values.targetProtein,
        targetCarbs: values.targetCarbs,
        targetFat: values.targetFat,
        targetFiber: values.targetFiber,
        startDate: values.startDate,
        endDate: values.endDate,
      });
      toast.success("Đã cập nhật mục tiêu");
      onOpenChange(false);
      onSuccess?.();
    } catch (error: unknown) {
      toast.error(
        (error as { message?: string })?.message || "Cập nhật thất bại"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10">
              <Target className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <DialogTitle>
                {mode === "create" ? "Tạo mục tiêu dinh dưỡng" : "Cập nhật mục tiêu"}
              </DialogTitle>
              <DialogDescription className="text-xs">
                {mode === "create"
                  ? "Tạo mục tiêu dinh dưỡng gắn với tài khoản quản trị."
                  : `Mục tiêu #${initialData?.id ?? ""}`}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {mode === "create" ? (
          <form
            onSubmit={createForm.handleSubmit(onCreate)}
            className="space-y-3 pt-2"
          >
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Loại mục tiêu</Label>
                <Select
                  value={createForm.watch("goalType")}
                  onValueChange={(v) =>
                    createForm.setValue("goalType", v as GoalType)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {goalTypes.map((g) => (
                      <SelectItem key={g.value} value={g.value}>
                        {g.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Trạng thái (tuỳ chọn)</Label>
                <Select
                  value={createForm.watch("status") ?? "NUTR_GOAL_ONGOING"}
                  onValueChange={(v) =>
                    createForm.setValue("status", v as NutritionGoalStatus)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusTypes.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field
                label="Cân nặng mục tiêu (kg)"
                register={createForm.register("targetWeight")}
                error={createForm.formState.errors.targetWeight?.message}
              />
              <Field
                label="Calories (kcal)"
                register={createForm.register("targetCalories")}
                error={createForm.formState.errors.targetCalories?.message}
              />
              <Field
                label="Protein (g)"
                register={createForm.register("targetProtein")}
                error={createForm.formState.errors.targetProtein?.message}
              />
              <Field
                label="Carbs (g)"
                register={createForm.register("targetCarbs")}
                error={createForm.formState.errors.targetCarbs?.message}
              />
              <Field
                label="Fat (g)"
                register={createForm.register("targetFat")}
                error={createForm.formState.errors.targetFat?.message}
              />
              <Field
                label="Chất xơ (g)"
                register={createForm.register("targetFiber")}
                error={createForm.formState.errors.targetFiber?.message}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="sd">Ngày bắt đầu</Label>
                <Input id="sd" type="date" {...createForm.register("startDate")} />
                {createForm.formState.errors.startDate && (
                  <p className="text-sm text-destructive">
                    {createForm.formState.errors.startDate.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="ed">Ngày kết thúc</Label>
                <Input id="ed" type="date" {...createForm.register("endDate")} />
                {createForm.formState.errors.endDate && (
                  <p className="text-sm text-destructive">
                    {createForm.formState.errors.endDate.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                disabled={loading}
                onClick={() => onOpenChange(false)}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Tạo
              </Button>
            </div>
          </form>
        ) : (
          <form
            onSubmit={editForm.handleSubmit(onEdit)}
            className="space-y-3 pt-2"
          >
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Loại mục tiêu</Label>
                <Select
                  value={editForm.watch("goalType") ?? (initialData?.goalType as string)}
                  onValueChange={(v) => editForm.setValue("goalType", v as GoalType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {goalTypes.map((g) => (
                      <SelectItem key={g.value} value={g.value}>
                        {g.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Trạng thái</Label>
                <Select
                  value={
                    editForm.watch("status") ??
                    (initialData?.status as string) ??
                    "NUTR_GOAL_ONGOING"
                  }
                  onValueChange={(v) =>
                    editForm.setValue("status", v as NutritionGoalStatus)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusTypes.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field
                label="Cân nặng mục tiêu (kg)"
                register={editForm.register("targetWeight")}
                error={editForm.formState.errors.targetWeight?.message}
              />
              <Field
                label="Calories (kcal)"
                register={editForm.register("targetCalories")}
                error={editForm.formState.errors.targetCalories?.message}
              />
              <Field
                label="Protein (g)"
                register={editForm.register("targetProtein")}
                error={editForm.formState.errors.targetProtein?.message}
              />
              <Field
                label="Carbs (g)"
                register={editForm.register("targetCarbs")}
                error={editForm.formState.errors.targetCarbs?.message}
              />
              <Field
                label="Fat (g)"
                register={editForm.register("targetFat")}
                error={editForm.formState.errors.targetFat?.message}
              />
              <Field
                label="Chất xơ (g)"
                register={editForm.register("targetFiber")}
                error={editForm.formState.errors.targetFiber?.message}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="esd">Ngày bắt đầu</Label>
                <Input id="esd" type="date" {...editForm.register("startDate")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eed">Ngày kết thúc</Label>
                <Input id="eed" type="date" {...editForm.register("endDate")} />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                disabled={loading}
                onClick={() => onOpenChange(false)}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Lưu
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  register,
  error,
}: {
  label: string;
  register: UseFormRegisterReturn<string>;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={register.name}>{label}</Label>
      <Input type="number" step={1} min={0} {...register} />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
