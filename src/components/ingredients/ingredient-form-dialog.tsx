"use client";

import { useEffect, useState, useRef } from "react";
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
import { Loader2, Apple, Upload, X } from "lucide-react";
import type { IIngredient } from "@/types/ingredient.type";

const formSchema = z.object({
  ingredientName: z
    .string()
    .min(1, { message: "Tên không được để trống" })
    .max(255, { message: "Tên tối đa 255 ký tự" }),
  description: z.string().max(1000, { message: "Mô tả tối đa 1000 ký tự" }).optional(),
  image: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;
type Mode = "create" | "edit";

interface IngredientFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  mode?: Mode;
  initialData?: IIngredient | null;
}

export function IngredientFormDialog({
  open,
  onOpenChange,
  onSuccess,
  mode = "create",
  initialData,
}: IngredientFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { ingredientName: "", description: "" },
  });

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && initialData) {
      reset({
        ingredientName: initialData.ingredientName,
        description: initialData.description ?? "",
      });
      setPreview(initialData.imageUrl || null);
    } else {
      reset({ ingredientName: "", description: "" });
      setPreview(null);
    }
  }, [open, mode, initialData, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Kích thước ảnh tối đa là 5MB");
        return;
      }
      setValue("image", file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const cancelImage = () => {
    setValue("image", undefined);
    // If editing, reverting to old image or wiping depending on logic.
    // For now, wipe completely
    setPreview(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      if (mode === "create" && !(values.image instanceof File)) {
        toast.error("Vui lòng chọn ảnh nguyên liệu");
        return;
      }

      setLoading(true);

      const formData = new FormData();
      formData.append("ingredientName", values.ingredientName);
      if (values.description) formData.append("description", values.description);
      
      if (values.image instanceof File) {
        formData.append("image", values.image);
      }

      if (mode === "create") {
        await ingredientService.createIngredient(formData);
        toast.success("Tạo nguyên liệu thành công!");
      } else {
        await ingredientService.updateIngredient(initialData!.id, formData);
        toast.success("Cập nhật nguyên liệu thành công!");
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
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/10">
              <Apple className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <DialogTitle>
                {mode === "create" ? "Tạo nguyên liệu" : "Cập nhật nguyên liệu"}
              </DialogTitle>
              <DialogDescription className="text-xs">
                {mode === "create"
                  ? "Thêm nguyên liệu mới, hỗ trợ tải ảnh lên hệ thống"
                  : `Đang chỉnh sửa: ${initialData?.ingredientName}`}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Ảnh */}
          <div className="space-y-2">
            <Label>
              Hình ảnh nguyên liệu {mode === "create" && <span className="text-destructive">*</span>}
            </Label>
            <div className="flex flex-col gap-3">
              {preview ? (
                <div className="relative w-max h-32 aspect-square rounded-lg border overflow-hidden group">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button type="button" variant="destructive" size="icon-sm" onClick={cancelImage}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div 
                  className="w-32 h-32 rounded-lg border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-6 w-6 mb-2" />
                  <span className="text-xs font-medium">Tải ảnh lên</span>
                </div>
              )}
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
              />
            </div>
            {errors.image && (
                <p className="text-sm text-destructive">{errors.image.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ing-name">
              Tên nguyên liệu <span className="text-destructive">*</span>
            </Label>
            <Input
              id="ing-name"
              placeholder="VD: Thịt gà, Bún, Cà chua..."
              {...register("ingredientName")}
            />
            {errors.ingredientName && (
              <p className="text-sm text-destructive">{errors.ingredientName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ing-description">Mô tả</Label>
            <Textarea
              id="ing-description"
              placeholder="Mô tả về nguyên liệu này..."
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
