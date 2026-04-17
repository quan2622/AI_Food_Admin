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
import { userProfileService } from "@/services/userProfileService";
import { Loader2 } from "lucide-react";

export function UserProfileFormDialog({
  open,
  onOpenChange,
  onSuccess,
  initialData,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  initialData?: any;
}) {
  const [loading, setLoading] = useState(false);

  const formSchema = z.object({
    age: z.coerce
      .number()
      .int({ message: "Tuổi phải là số nguyên" })
      .min(1, { message: "Tuổi tối thiểu là 1" })
      .max(100, { message: "Tuổi tối đa là 100" }),
    height: z.coerce
      .number()
      .positive({ message: "Chiều cao phải là số dương" }),
    weight: z.coerce
      .number()
      .positive({ message: "Cân nặng phải là số dương" }),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional().nullable(),
    activityLevel: z
      .enum([
        "SEDENTARY",
        "LIGHTLY_ACTIVE",
        "MODERATELY_ACTIVE",
        "VERY_ACTIVE",
        "SUPER_ACTIVE",
      ])
      .optional()
      .nullable(),
  });

  type FormValues = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      age: 1,
      height: 1,
      weight: 1,
      gender: null,
      activityLevel: null,
    },
  });

  const parseActivityLevel = (data: any) => {
    if (!data) return "SEDENTARY";
    const rawVal = String(
      data.activityLevel || 
      data.activityLevelData?.levelCode || 
      data.activityLevelData?.code || 
      data.activityLevelData?.levelName || 
      data.activityLevelData?.id || 
      ""
    ).toUpperCase();

    if (rawVal.includes("SEDENTARY") || rawVal === "1") return "SEDENTARY";
    if (rawVal.includes("LIGHT") || rawVal === "2") return "LIGHTLY_ACTIVE";
    if (rawVal.includes("MODERATE") || rawVal === "3") return "MODERATELY_ACTIVE";
    if (rawVal.includes("SUPER") || rawVal === "5") return "SUPER_ACTIVE";
    if (rawVal.includes("VERY") || rawVal.includes("NĂNG ĐỘNG") || rawVal === "4") return "VERY_ACTIVE";

    return "SEDENTARY";
  };

  useEffect(() => {
    if (open && initialData) {
      reset({
        age: initialData.age || 18,
        height: initialData.height || 170,
        weight: initialData.weight || 60,
        gender:
          !initialData.gender || initialData.gender === "NULL"
            ? "OTHER"
            : initialData.gender,
        activityLevel: parseActivityLevel(initialData),
      });
    }
  }, [open, initialData, reset]);

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);

      const payload = {
        age: data.age,
        height: data.height,
        weight: data.weight,
        gender: data.gender || undefined,
        activityLevel: data.activityLevel || undefined,
      };

      if (!initialData?.id) {
        toast.error("Không tìm thấy ID người dùng để cập nhật");
        return;
      }

      await userProfileService.updateProfile(initialData.id, payload);
      toast.success("Cập nhật thông tin profile thành công");

      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Cập nhật profile thất bại",
      );
    } finally {
      setLoading(false);
    }
  };

  const gender = watch("gender") || "OTHER";
  const activityLevel = watch("activityLevel") || "SEDENTARY";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Cập nhật hồ sơ người dùng</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit as any)}
          className="space-y-4 max-h-[70vh] overflow-y-auto px-1"
        >
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Tuổi</Label>
              <Input id="age" type="number" {...register("age")} />
              {errors.age && (
                <p className="text-sm text-red-500">{errors.age.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Chiều cao (cm)</Label>
              <Input
                id="height"
                type="number"
                step="0.1"
                {...register("height")}
              />
              {errors.height && (
                <p className="text-sm text-red-500">{errors.height.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Cân nặng (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                {...register("weight")}
              />
              {errors.weight && (
                <p className="text-sm text-red-500">{errors.weight.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Giới tính</Label>
            <Select
              value={gender}
              onValueChange={(value) => setValue("gender", value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn giới tính" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MALE">Nam</SelectItem>
                <SelectItem value="FEMALE">Nữ</SelectItem>
                <SelectItem value="OTHER">Thêm/Khác</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && (
              <p className="text-sm text-red-500">{errors.gender.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="activityLevel">Mức độ vận động</Label>
            <Select
              value={activityLevel}
              onValueChange={(value) => setValue("activityLevel", value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn mức vận động" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SEDENTARY">
                  Ít vận động (Sedentary)
                </SelectItem>
                <SelectItem value="LIGHTLY_ACTIVE">
                  Nhẹ nhàng (Lightly Active)
                </SelectItem>
                <SelectItem value="MODERATELY_ACTIVE">
                  Trung bình (Moderately Active)
                </SelectItem>
                <SelectItem value="VERY_ACTIVE">
                  Năng động (Very Active)
                </SelectItem>
                <SelectItem value="SUPER_ACTIVE">
                  Rất năng động (Super Active)
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.activityLevel && (
              <p className="text-sm text-red-500">
                {errors.activityLevel.message}
              </p>
            )}
          </div>

          <div className="flex justify-end pt-4 space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Cập nhật
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
