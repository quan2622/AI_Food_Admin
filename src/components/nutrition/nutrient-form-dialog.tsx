"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
import { Loader2, FlaskConical } from "lucide-react";
import type { INutritionComponent, UnitType } from "@/types/nutrition.type";

const UNIT_OPTIONS: { value: UnitType; label: string }[] = [
  { value: "UNIT_G", label: "Gram (g)" },
  { value: "UNIT_KG", label: "Kilogram (kg)" },
  { value: "UNIT_MG", label: "Milligram (mg)" },
  { value: "UNIT_OZ", label: "Ounce (oz)" },
  { value: "UNIT_LB", label: "Pound (lb)" },
];

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Tên không được để trống" })
    .max(255, { message: "Tên tối đa 255 ký tự" }),
  unit: z.enum(["UNIT_G", "UNIT_KG", "UNIT_MG", "UNIT_OZ", "UNIT_LB"]),
});

type FormValues = z.infer<typeof formSchema>;
type Mode = "create" | "edit";

interface NutrientFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  mode?: Mode;
  initialData?: INutritionComponent | null;
}

export function NutrientFormDialog({
  open,
  onOpenChange,
  onSuccess,
  mode = "create",
  initialData,
}: NutrientFormDialogProps) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", unit: "UNIT_G" },
  });

  const unit = watch("unit");

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && initialData) {
      const u = initialData.unit as string;
      const valid = UNIT_OPTIONS.some((o) => o.value === u);
      reset({
        name: initialData.name,
        unit: (valid ? u : "UNIT_G") as UnitType,
      });
    } else {
      reset({ name: "", unit: "UNIT_G" });
    }
  }, [open, mode, initialData, reset]);

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      if (mode === "create") {
        await nutritionService.createNutritionComponent({
          name: values.name.trim(),
          unit: values.unit,
        });
        toast.success("Đã tạo chỉ số dinh dưỡng");
      } else {
        await nutritionService.updateNutritionComponent(initialData!.id, {
          name: values.name.trim(),
          unit: values.unit,
        });
        toast.success("Đã cập nhật chỉ số dinh dưỡng");
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (error: unknown) {
      const msg =
        (error as { message?: string })?.message ||
        (mode === "create" ? "Tạo thất bại" : "Cập nhật thất bại");
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <FlaskConical className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>
                {mode === "create" ? "Tạo chỉ số dinh dưỡng" : "Cập nhật chỉ số dinh dưỡng"}
              </DialogTitle>
              <DialogDescription className="text-xs">
                {mode === "create"
                  ? "Thêm chỉ số dinh dưỡng mới vào hệ thống"
                  : `Đang chỉnh sửa: ${initialData?.name ?? ""}`}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="nutrient-name">
              Tên <span className="text-destructive">*</span>
            </Label>
            <Input
              id="nutrient-name"
              placeholder="VD: Iron, Vitamin C..."
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Đơn vị (UnitType) <span className="text-destructive">*</span></Label>
            <Select
              value={unit}
              onValueChange={(v) => setValue("unit", v as UnitType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn đơn vị" />
              </SelectTrigger>
              <SelectContent>
                {UNIT_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.unit && (
              <p className="text-sm text-destructive">{errors.unit.message}</p>
            )}
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
              {mode === "create" ? "Tạo" : "Lưu"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
