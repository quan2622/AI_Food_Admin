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
import { foodService } from "@/services/foodService";
import { Loader2 } from "lucide-react";

export function FoodFormDialog({
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
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    if (open) {
      // Tải danh sách category
      foodService.getFoodCategories().then(res => {
        if (res.data && Array.isArray(res.data)) {
          setCategories(res.data);
        } else {
          const d = res.data as any;
          if (d?.EC === 0 && Array.isArray(d?.result)) {
             setCategories(d.result);
          }
        }
      }).catch(err => console.error(err));
    }
  }, [open]);

  const formSchema = z.object({
    foodName: z.string().min(1, "Vui lòng nhập tên món ăn").max(255, "Tên món ăn quá dài"),
    description: z.string().max(1000, "Mô tả tối đa 1000 ký tự").optional().nullable(),
    imageUrl: z.string().max(500, "URL quá dài").optional().nullable(),
    categoryId: z.coerce.number().positive("Vui lòng chọn danh mục hợp lệ").optional().nullable(),
    defaultServingGrams: z.coerce.number({ message: "Vui lòng nhập khẩu phần (số)" }).min(0, "Khẩu phần phải ≥ 0"),
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
      foodName: "",
      description: "",
      imageUrl: "",
      categoryId: null,
      defaultServingGrams: 0,
    },
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        reset({
          foodName: initialData.foodName || "",
          description: initialData.description || "",
          imageUrl: initialData.imageUrl || "",
          categoryId: initialData.categoryId || initialData.foodCategory?.id || null,
          defaultServingGrams: initialData.defaultServingGrams ?? null,
        });
      } else {
        reset({
          foodName: "",
          description: "",
          imageUrl: "",
          categoryId: null,
          defaultServingGrams: 0,
        });
      }
    }
  }, [open, initialData, reset]);

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);

      const payload = {
        foodName: data.foodName,
        description: data.description || undefined,
        imageUrl: data.imageUrl || undefined,
        categoryId: data.categoryId || undefined,
        defaultServingGrams: data.defaultServingGrams ?? undefined,
      };

      if (initialData?.id) {
        await foodService.updateFood(initialData.id, payload);
        toast.success("Cập nhật món ăn thành công");
      } else {
        await foodService.createFood(payload as any);
        toast.success("Thêm mới món ăn thành công");
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || error?.response?.data?.EM || "Thao tác thất bại",
      );
    } finally {
      setLoading(false);
    }
  };

  const selectedCategory = watch("categoryId");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Cập nhật Món ăn" : "Thêm mới Món ăn"}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit as any)}
          className="space-y-4 px-1 pb-1"
        >
          <div className="space-y-2">
            <Label htmlFor="foodName">Tên món ăn <span className="text-red-500">*</span></Label>
            <Input id="foodName" placeholder="Ví dụ: Phở bò" {...register("foodName")} />
            {errors.foodName && <p className="text-sm text-red-500">{errors.foodName.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoryId">Danh mục</Label>
            <Select
              value={selectedCategory ? String(selectedCategory) : undefined}
              onValueChange={(value) => setValue("categoryId", parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoryId && <p className="text-sm text-red-500">{errors.categoryId.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">URL Ảnh</Label>
            <Input id="imageUrl" placeholder="https://..." {...register("imageUrl")} />
            {errors.imageUrl && <p className="text-sm text-red-500">{errors.imageUrl.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="defaultServingGrams">Khẩu phần mặc định (gram) <span className="text-red-500">*</span></Label>
            <Input
              id="defaultServingGrams"
              type="number"
              min={0}
              step={0.1}
              placeholder="Ví dụ: 450"
              {...register("defaultServingGrams")}
            />
            {errors.defaultServingGrams && <p className="text-sm text-red-500">{errors.defaultServingGrams.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <textarea
              id="description"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Nhập mô tả về món ăn..."
              rows={3}
              {...register("description")}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
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
              {initialData ? "Cập nhật" : "Tạo mới"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
