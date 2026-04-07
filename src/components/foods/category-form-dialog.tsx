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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { foodService } from "@/services/foodService";
import { Loader2, FolderTree } from "lucide-react";
import type { IFoodCategoryAdmin } from "@/types/food.type";

/* ─── Schema ─────────────────────────────────────────────────────────────── */
const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Tên danh mục không được để trống" })
    .max(255, { message: "Tên tối đa 255 ký tự" }),
  description: z.string().max(1000, { message: "Mô tả tối đa 1000 ký tự" }).optional(),
  parentId: z.string().optional(), // lưu dạng string từ Select, convert về number | null khi submit
});

type FormValues = z.infer<typeof formSchema>;
type Mode = "create" | "edit";

/* ─── Props ───────────────────────────────────────────────────────────────── */
interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  mode?: Mode;
  initialData?: IFoodCategoryAdmin | null;
  /** Danh sách category để chọn category cha */
  categoryOptions?: { id: number; name: string }[];
}

const NO_PARENT = "__none__";

export function CategoryFormDialog({
  open,
  onOpenChange,
  onSuccess,
  mode = "create",
  initialData,
  categoryOptions = [],
}: CategoryFormDialogProps) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", description: "", parentId: NO_PARENT },
  });

  /* Reset form mỗi khi dialog mở */
  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && initialData) {
      reset({
        name: initialData.name,
        description: initialData.description ?? "",
        parentId: initialData.parentId ? String(initialData.parentId) : NO_PARENT,
      });
    } else {
      reset({ name: "", description: "", parentId: NO_PARENT });
    }
  }, [open, mode, initialData, reset]);

  const parentId = watch("parentId");

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);

      const parentIdNum =
        values.parentId && values.parentId !== NO_PARENT
          ? Number(values.parentId)
          : null;

      const payload = {
        name: values.name,
        description: values.description || undefined,
        parentId: parentIdNum,
      };

      if (mode === "create") {
        await foodService.createCategory(payload);
        toast.success("Tạo danh mục thành công!");
      } else {
        await foodService.updateCategory(initialData!.id, payload);
        toast.success("Cập nhật danh mục thành công!");
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      const msg =
        error?.message ||
        (mode === "create" ? "Tạo danh mục thất bại" : "Cập nhật thất bại");
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  /* Lọc bỏ chính mình khỏi danh sách cha (tránh vòng lặp khi edit) */
  const filteredOptions = categoryOptions.filter(
    (c) => c.id !== initialData?.id
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <FolderTree className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>
                {mode === "create" ? "Tạo danh mục mới" : "Cập nhật danh mục"}
              </DialogTitle>
              <DialogDescription className="text-xs">
                {mode === "create"
                  ? "Thêm danh mục món ăn vào hệ thống"
                  : `Đang chỉnh sửa: ${initialData?.name}`}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 pt-2"
        >
          {/* Tên danh mục */}
          <div className="space-y-2">
            <Label htmlFor="cat-name">
              Tên danh mục <span className="text-destructive">*</span>
            </Label>
            <Input
              id="cat-name"
              placeholder="VD: Món nước, Cơm, Bánh..."
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Danh mục cha */}
          <div className="space-y-2">
            <Label htmlFor="cat-parent">Danh mục cha</Label>
            <Select
              value={parentId ?? NO_PARENT}
              onValueChange={(val) => setValue("parentId", val)}
            >
              <SelectTrigger id="cat-parent">
                <SelectValue placeholder="Không có (danh mục gốc)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_PARENT}>
                  — Không có (danh mục gốc)
                </SelectItem>
                {filteredOptions.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.parentId && (
              <p className="text-sm text-destructive">{errors.parentId.message}</p>
            )}
          </div>

          {/* Mô tả */}
          <div className="space-y-2">
            <Label htmlFor="cat-description">Mô tả</Label>
            <Textarea
              id="cat-description"
              placeholder="Mô tả ngắn về danh mục này..."
              rows={3}
              className="resize-none"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          {/* Actions */}
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
              {mode === "create" ? "Tạo danh mục" : "Lưu thay đổi"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
