"use client";

import { useEffect, useState, useCallback } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { ingredientService } from "@/services/ingredientService";
import { Loader2, ShieldAlert, Search, HandPlatter } from "lucide-react";
import type { IAllergen, IIngredient } from "@/types/ingredient.type";

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Tên không được để trống" })
    .max(255, { message: "Tên tối đa 255 ký tự" }),
  description: z.string().max(1000, { message: "Mô tả tối đa 1000 ký tự" }).optional(),
  ingredientIds: z.array(z.number()).optional(),
});

type FormValues = z.infer<typeof formSchema>;
type Mode = "create" | "edit";

interface AllergenFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  mode?: Mode;
  initialData?: IAllergen | any | null;
}

export function AllergenFormDialog({
  open,
  onOpenChange,
  onSuccess,
  mode = "create",
  initialData,
}: AllergenFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [ingredients, setIngredients] = useState<IIngredient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", description: "", ingredientIds: [] },
  });

  const selectedIngredientIds = watch("ingredientIds") || [];

  // Default fetch Top Allergens
  const fetchTopIngredients = useCallback(async () => {
    try {
      setFetching(true);
      const res = await ingredientService.getTopAllergenIngredients();
      if (res.metadata.EC === 0) {
        setIngredients(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch top ingredients");
    } finally {
      setFetching(false);
    }
  }, []);

  // Search logic with debounce
  useEffect(() => {
    if (!open) return;

    if (!searchTerm.trim()) {
      fetchTopIngredients();
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setFetching(true);
        const res = await ingredientService.searchIngredients(searchTerm);
        if (res.metadata.EC === 0) {
          setIngredients(res.data);
        }
      } catch (error) {
        console.error("Search failed");
      } finally {
        setFetching(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchTerm, open, fetchTopIngredients]);

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && initialData) {
      const mappedIds = initialData.ingredientAllergens?.map((ia: any) => ia.ingredientId) || [];
      
      reset({
        name: initialData.name,
        description: initialData.description ?? "",
        ingredientIds: mappedIds
      });
    } else {
      reset({ name: "", description: "", ingredientIds: [] });
    }
    setSearchTerm("");
  }, [open, mode, initialData, reset]);

  const toggleIngredient = (id: number) => {
    const current = [...selectedIngredientIds];
    const index = current.indexOf(id);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(id);
    }
    setValue("ingredientIds", current);
  };

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);

      const payload = {
        name: values.name,
        description: values.description || undefined,
        ingredientIds: values.ingredientIds
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
      const msg = error?.metadata?.message || error?.message || (mode === "create" ? "Tạo thất bại" : "Cập nhật thất bại");
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[620px] max-h-[90vh] flex flex-col p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="p-6 pb-2">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10 shadow-sm border border-orange-100">
              <ShieldAlert className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-slate-900 tracking-tight">
                {mode === "create" ? "Tạo chất gây dị ứng" : "Cập nhật chất gây dị ứng"}
              </DialogTitle>
              <DialogDescription className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-0.5">
                {mode === "create"
                  ? "Quản lý các chất gây dị ứng và liên kết nguyên liệu"
                  : `Chỉnh sửa: ${initialData?.name}`}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col overflow-hidden">
          <ScrollArea className="flex-1 px-6 pb-2">
            <div className="space-y-6 pt-2 pb-4">
              <div className="grid grid-cols-1 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="al-name" className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Tên chất gây dị ứng <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="al-name"
                    placeholder="VD: Đậu phộng, Sữa, Gluten..."
                    className="rounded-xl h-11 border-slate-200 shadow-sm transition-all focus:border-orange-200"
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-[11px] font-bold text-rose-500 pl-1">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="al-description" className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Mô tả</Label>
                  <Textarea
                    id="al-description"
                    placeholder="Thông tin về các biểu hiện dị ứng hoặc lưu ý..."
                    rows={2}
                    className="resize-none rounded-xl border-slate-200 shadow-sm transition-all focus:border-orange-200"
                    {...register("description")}
                  />
                </div>
              </div>

              {/* Ingredient Linkage Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <HandPlatter className="w-4 h-4 text-orange-500" />
                    <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">
                      Liên kết nguyên liệu ({selectedIngredientIds.length})
                    </span>
                  </div>
                  {fetching && <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-500" />}
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Tìm nhanh nguyên liệu..."
                    className="pl-9 h-10 rounded-xl border-slate-100 bg-slate-50/50 text-xs shadow-inner"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5 max-h-[220px] overflow-y-auto p-1 rounded-xl border border-slate-50 bg-slate-50/10">
                  {ingredients.length > 0 ? (
                    ingredients.map((ing) => (
                      <div 
                        key={ing.id} 
                        className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer hover:shadow-sm ${
                          selectedIngredientIds.includes(ing.id) 
                            ? "bg-orange-50 border-orange-200" 
                            : "bg-white border-slate-100 hover:border-slate-200"
                        }`}
                        onClick={() => toggleIngredient(ing.id)}
                      >
                        <Checkbox 
                          id={`ing-${ing.id}`} 
                          checked={selectedIngredientIds.includes(ing.id)}
                          onCheckedChange={() => toggleIngredient(ing.id)}
                          className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-700 truncate">{ing.ingredientName}</p>
                          <p className="text-[9px] font-medium text-slate-400">ID: #{ing.id}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 py-10 flex flex-col items-center justify-center text-slate-400 italic text-[11px]">
                      {fetching ? "Đang tìm kiếm..." : "Không tìm thấy nguyên liệu nào"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>

          <div className="flex justify-end gap-3 p-6 border-t border-slate-50 bg-white/50 backdrop-blur-sm shrink-0">
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
              className="rounded-xl h-11 px-10 font-black text-[11px] uppercase tracking-widest bg-orange-500 text-white hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-200 transition-all active:scale-[0.97]"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />}
              {mode === "create" ? "Xác nhận tạo" : "Lưu thay đổi"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
