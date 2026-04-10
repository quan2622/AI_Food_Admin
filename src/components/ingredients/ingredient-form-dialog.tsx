"use client";

import { useEffect, useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { ingredientService } from "@/services/ingredientService";
import { Loader2, Apple, Upload, X, Activity, Droplets, Zap, Wheat, Database } from "lucide-react";
import type { IIngredient } from "@/types/ingredient.type";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  ingredientName: z
    .string()
    .min(1, { message: "Tên không được để trống" })
    .max(255, { message: "Tên tối đa 255 ký tự" }),
  description: z.string().max(1000, { message: "Mô tả tối đa 1000 ký tự" }).optional(),
  source: z.enum(["SRC_MANUAL", "SRC_USDA", "SRC_CALC"]).default("SRC_MANUAL"),
  image: z.any().optional(),
  // Fixed nutrition fields (Calories removed)
  protein: z.string().optional(),
  fat: z.string().optional(),
  carbs: z.string().optional(),
  fiber: z.string().optional(),
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

// Nutrient IDs mapping (Calories ID 1 removed as requested)
const NUTRIENT_IDS = {
  protein: 2,
  carbs: 3,
  fat: 4,
  fiber: 5,
};

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
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { 
      ingredientName: "", 
      description: "",
      source: "SRC_MANUAL",
      protein: "",
      fat: "",
      carbs: "",
      fiber: ""
    },
  });

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && initialData) {
      const nutri = initialData.ingredientNutritions?.[0];
      const nutriValues = nutri?.values || [];
      const getVal = (id: number) => nutriValues.find(v => v.nutrient.id === id)?.value?.toString() || "";

      reset({
        ingredientName: initialData.ingredientName,
        description: initialData.description ?? "",
        source: (nutri?.source as any) || "SRC_MANUAL",
        protein: getVal(NUTRIENT_IDS.protein),
        fat: getVal(NUTRIENT_IDS.fat),
        carbs: getVal(NUTRIENT_IDS.carbs),
        fiber: getVal(NUTRIENT_IDS.fiber),
      });
      setPreview(initialData.imageUrl || null);
    } else {
      reset({ 
        ingredientName: "", 
        description: "",
        source: "SRC_MANUAL",
        protein: "",
        fat: "",
        carbs: "",
        fiber: ""
      });
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
      formData.append("source", values.source);
      
      if (values.image instanceof File) {
        formData.append("image", values.image);
      }

      const nutritionItems = [
        { id: NUTRIENT_IDS.protein, value: values.protein },
        { id: NUTRIENT_IDS.fat, value: values.fat },
        { id: NUTRIENT_IDS.carbs, value: values.carbs },
        { id: NUTRIENT_IDS.fiber, value: values.fiber },
      ].filter(item => item.value !== "" && item.value !== undefined);

      nutritionItems.forEach((item, index) => {
        formData.append(`nutritionValues[${index}][nutrientId]`, item.id.toString());
        formData.append(`nutritionValues[${index}][value]`, item.value!);
      });

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
      const msg = error?.metadata?.message || error?.message || (mode === "create" ? "Tạo thất bại" : "Cập nhật thất bại");
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[95vh] flex flex-col p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="p-6 pb-2">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 shadow-sm">
              <Apple className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <DialogTitle className="text-xl font-black text-slate-900 tracking-tight">
                {mode === "create" ? "Tạo nguyên liệu" : "Cập nhật nguyên liệu"}
              </DialogTitle>
              <DialogDescription className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                {mode === "create"
                  ? "Cung cấp chỉ số dinh dưỡng chính xác per 100g"
                  : `ID: #${initialData?.id} — ${initialData?.ingredientName}`}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 pb-6 mt-2">
          <form className="space-y-8 pt-2">
            {/* Top Row: Responsive Image (Left) + Name/Desc (Right) */}
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Left Column: Image */}
              <div className="shrink-0 space-y-3">
                <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  Ảnh nguyên liệu {mode === "create" && <span className="text-rose-500">*</span>}
                </Label>
                <div className="flex flex-col gap-3">
                  {preview ? (
                    <div className="relative w-48 h-48 rounded-2xl border border-slate-100 overflow-hidden group shadow-sm bg-slate-50 transition-all">
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-[2px]">
                        <Button type="button" variant="destructive" size="icon" className="h-9 w-9 rounded-xl" onClick={cancelImage}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      className="w-48 h-48 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 hover:border-emerald-200 hover:text-emerald-500 transition-all cursor-pointer group"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-7 w-7 mb-2.5 group-hover:-translate-y-1 transition-transform" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Tải ảnh lên</span>
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
              </div>

              {/* Right Column: Name & Description (Shorter) */}
              <div className="flex-1 space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="ing-name" className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Tên nguyên liệu <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="ing-name"
                    placeholder="VD: Thịt gà, Bún, Cà chua..."
                    className="rounded-2xl border-slate-100 bg-slate-50/30 focus:bg-white h-11 font-bold text-[15px] transition-all px-4"
                    {...register("ingredientName")}
                  />
                  {errors.ingredientName && (
                    <p className="text-[11px] font-bold text-rose-500 pl-1">{errors.ingredientName.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Nguồn dữ liệu</Label>
                    <Controller
                      name="source"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="rounded-xl border-slate-100 bg-slate-50/30 h-10 font-bold transition-all">
                            <SelectValue placeholder="Chọn nguồn dữ liệu" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-slate-100 shadow-xl overflow-hidden">
                            <SelectItem value="SRC_MANUAL" className="py-3 px-4 focus:bg-emerald-50 focus:text-emerald-900">
                              <div className="flex items-center gap-2">
                                <Badge variant="success" className="h-1.5 w-1.5 p-0 rounded-full" />
                                <span className="font-bold text-sm tracking-tight text-slate-600">SRC_MANUAL (Nhập tay)</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="SRC_USDA" className="py-3 px-4 focus:bg-blue-50 focus:text-blue-900">
                              <div className="flex items-center gap-2">
                                <Badge variant="info" className="h-1.5 w-1.5 p-0 rounded-full" />
                                <span className="font-bold text-sm tracking-tight text-slate-600">SRC_USDA (Hệ thống USDA)</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="SRC_CALC" className="py-3 px-4 focus:bg-amber-50 focus:text-amber-900">
                              <div className="flex items-center gap-2">
                                <Badge variant="warning" className="h-1.5 w-1.5 p-0 rounded-full" />
                                <span className="font-bold text-sm tracking-tight text-slate-600">SRC_CALC (Tự động tính)</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ing-description" className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Mô tả ngắn</Label>
                    <Textarea
                      id="ing-description"
                      placeholder="Mô tả ngắn gọn về sản phẩm..."
                      className="resize-none rounded-2xl border-slate-100 bg-slate-50/30 focus:bg-white transition-all p-4 h-[86px] text-sm"
                      {...register("description")}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section: 4 Nutrition Cards */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
                <Activity className="w-4 h-4 text-emerald-500" />
                <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">
                  Thành phần dinh dưỡng chính (per 100g)
                </span>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Protein */}
                <div className="space-y-2 bg-blue-50/30 p-4 rounded-2xl border border-blue-100/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-3.5 h-3.5 text-blue-500" />
                    <Label className="text-[10px] font-black text-blue-600 uppercase tracking-wider">Protein (g)</Label>
                  </div>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="0.0"
                    className="h-10 rounded-xl border-blue-100 bg-white shadow-sm font-bold text-slate-700"
                    {...register("protein")}
                  />
                </div>

                {/* Carbs */}
                <div className="space-y-2 bg-amber-50/30 p-4 rounded-2xl border border-amber-100/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Wheat className="w-3.5 h-3.5 text-amber-500" />
                    <Label className="text-[10px] font-black text-amber-600 uppercase tracking-wider">Tinh bột (g)</Label>
                  </div>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="0.0"
                    className="h-10 rounded-xl border-amber-100 bg-white shadow-sm font-bold text-slate-700"
                    {...register("carbs")}
                  />
                </div>

                {/* Fat */}
                <div className="space-y-2 bg-rose-50/30 p-4 rounded-2xl border border-rose-100/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Droplets className="w-3.5 h-3.5 text-rose-500" />
                    <Label className="text-[10px] font-black text-rose-600 uppercase tracking-wider">Chất béo (g)</Label>
                  </div>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="0.0"
                    className="h-10 rounded-xl border-rose-100 bg-white shadow-sm font-bold text-slate-700"
                    {...register("fat")}
                  />
                </div>

                {/* Fiber */}
                <div className="space-y-2 bg-emerald-50/30 p-4 rounded-2xl border border-emerald-100/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Activity className="w-3.5 h-3.5 text-emerald-500" />
                    <Label className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">Chất xơ (g)</Label>
                  </div>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="0.0"
                    className="h-10 rounded-xl border-emerald-100 bg-white shadow-sm font-bold text-slate-700"
                    {...register("fiber")}
                  />
                </div>
              </div>
            </div>
          </form>
        </ScrollArea>

        <div className="flex justify-end gap-3 p-6 border-t border-slate-50 bg-white/50 backdrop-blur-sm">
          <Button
            type="button"
            variant="ghost"
            disabled={loading}
            onClick={() => onOpenChange(false)}
            className="rounded-xl h-11 px-6 font-bold text-[11px] uppercase tracking-widest text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
          >
            Hủy
          </Button>
          <Button 
            type="submit" 
            disabled={loading}
            onClick={handleSubmit(onSubmit)}
            className="rounded-xl h-11 px-8 font-black text-[11px] uppercase tracking-widest bg-slate-900 text-white hover:bg-emerald-600 hover:shadow-lg transition-all active:scale-[0.98]"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "create" ? "Tạo ngay" : "Lưu thay đổi"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
