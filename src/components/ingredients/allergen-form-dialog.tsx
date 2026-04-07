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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ingredientService } from "@/services/ingredientService";
import { Loader2, ShieldAlert } from "lucide-react";
import type { IAllergen } from "@/types/ingredient.type";

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Tên không được để trống" })
    .max(255, { message: "Tên tối đa 255 ký tự" }),
  description: z.string().max(1000, { message: "Mô tả tối đa 1000 ký tự" }).optional(),
});

type FormValues = z.infer<typeof formSchema>;
type Mode = "create" | "edit";

interface AllergenFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  mode?: Mode;
  initialData?: IAllergen | null;
}

export function AllergenFormDialog({
  open,
  onOpenChange,
  onSuccess,
  mode = "create",
  initialData,
}: AllergenFormDialogProps) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", description: "" },
  });

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && initialData) {
      reset({
        name: initialData.name,
        description: initialData.description ?? "",
      });
    } else {
      reset({ name: "", description: "" });
    }
  }, [open, mode, initialData, reset]);

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);

      const payload = {
        name: values.name,
        description: values.description || undefined,
      };

      if (mode === "create") {
        await ingredientService.createAllergen(payload);
        toast.success("Tạo chất gây dị ứng thành công!");
      } else {
        await ingredientService.updateAllergen(initialData!.id, payload);
        toast.success("Cập nhật thành công!");
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      const msg =
        error?.message ||
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
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10">
              <ShieldAlert className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <DialogTitle>
                {mode === "create" ? "Tạo chất gây dị ứng" : "Cập nhật chất gây dị ứng"}
              </DialogTitle>
              <DialogDescription className="text-xs">
                {mode === "create"
                  ? "Thêm chất gây dị ứng mới vào hệ thống"
                  : `Đang chỉnh sửa: ${initialData?.name}`}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="al-name">
              Tên chất gây dị ứng <span className="text-destructive">*</span>
            </Label>
            <Input
              id="al-name"
              placeholder="VD: Đậu phộng, Sữa, Gluten..."
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="al-description">Mô tả</Label>
            <Textarea
              id="al-description"
              placeholder="Ảnh hưởng, đối tượng dị ứng..."
              rows={3}
              className="resize-none"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
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
              {mode === "create" ? "Tạo" : "Lưu thay đổi"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
