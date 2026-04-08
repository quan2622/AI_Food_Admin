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
import { allCodeService } from "@/services/allCodeService";
import { Loader2, FileCode2 } from "lucide-react";
import type { IAllCode } from "@/types/allcode.type";
import type { ApiErrorResponse } from "@/types/backend.type";

const formSchema = z.object({
  keyMap: z
    .string()
    .min(1, { message: "Key không được để trống" })
    .max(100, { message: "Key tối đa 100 ký tự" }),
  type: z
    .string()
    .min(1, { message: "Nhóm (type) không được để trống" })
    .max(100, { message: "Type tối đa 100 ký tự" }),
  value: z
    .string()
    .min(1, { message: "Giá trị hiển thị không được để trống" })
    .max(255, { message: "Value tối đa 255 ký tự" }),
  description: z
    .string()
    .max(500, { message: "Mô tả tối đa 500 ký tự" })
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;
type Mode = "create" | "edit";

function errMessage(e: unknown): string {
  if (e && typeof e === "object") {
    const x = e as ApiErrorResponse & { message?: string };
    if (typeof x.message === "string" && x.message) return x.message;
  }
  return "Đã xảy ra lỗi";
}

interface AllCodeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  mode?: Mode;
  initialData?: IAllCode | null;
  /** Gợi ý nhóm type (datalist) */
  typeSuggestions?: string[];
}

export function AllCodeFormDialog({
  open,
  onOpenChange,
  onSuccess,
  mode = "create",
  initialData,
  typeSuggestions = [],
}: AllCodeFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const datalistId = "allcode-type-suggestions";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      keyMap: "",
      type: "",
      value: "",
      description: "",
    },
  });

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && initialData) {
      reset({
        keyMap: initialData.keyMap,
        type: initialData.type,
        value: initialData.value,
        description: initialData.description ?? "",
      });
    } else {
      reset({
        keyMap: "",
        type: "",
        value: "",
        description: "",
      });
    }
  }, [open, mode, initialData, reset]);

  const onSubmit = async (values: FormValues) => {
    const desc = values.description?.trim();
    try {
      setLoading(true);

      if (mode === "create") {
        await allCodeService.createAllCode({
          keyMap: values.keyMap.trim(),
          type: values.type.trim(),
          value: values.value.trim(),
          ...(desc ? { description: desc } : {}),
        });
        toast.success("Tạo mã thành công!");
      } else if (initialData) {
        await allCodeService.updateAllCode(initialData.id, {
          keyMap: values.keyMap.trim(),
          type: values.type.trim(),
          value: values.value.trim(),
          description: desc ? desc : null,
        });
        toast.success("Cập nhật mã thành công!");
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (e) {
      toast.error(errMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <FileCode2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>
                {mode === "create" ? "Tạo mã tham chiếu" : "Cập nhật mã tham chiếu"}
              </DialogTitle>
              <DialogDescription className="text-xs">
                {mode === "create"
                  ? "Thêm keyMap, nhóm type và nhãn hiển thị (value)."
                  : `Chỉnh sửa: ${initialData?.keyMap ?? ""}`}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <datalist id={datalistId}>
            {typeSuggestions.map((t) => (
              <option key={t} value={t} />
            ))}
          </datalist>

          <div className="space-y-2">
            <Label htmlFor="ac-keyMap">
              keyMap <span className="text-destructive">*</span>
            </Label>
            <Input
              id="ac-keyMap"
              className="font-mono text-sm"
              placeholder="VD: MEAL_SNACK, STATUS_MET"
              autoComplete="off"
              {...register("keyMap")}
            />
            {errors.keyMap && (
              <p className="text-sm text-destructive">{errors.keyMap.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ac-type">
              Nhóm (type) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="ac-type"
              list={datalistId}
              placeholder="VD: MEAL, STATUS, SEVERITY"
              autoComplete="off"
              {...register("type")}
            />
            {errors.type && (
              <p className="text-sm text-destructive">{errors.type.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ac-value">
              Giá trị hiển thị (value) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="ac-value"
              placeholder="VD: Bữa phụ, Đạt mục tiêu"
              {...register("value")}
            />
            {errors.value && (
              <p className="text-sm text-destructive">{errors.value.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ac-description">Mô tả</Label>
            <Textarea
              id="ac-description"
              placeholder="Mô tả thêm (tùy chọn)"
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
