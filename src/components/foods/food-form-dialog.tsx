"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ImageIcon, Loader2, Plus, Search, Trash2, X } from "lucide-react";
import { foodService } from "@/services/foodService";
import { ingredientService } from "@/services/ingredientService";
import type { IIngredient } from "@/types/ingredient.type";
import type { IFood, IFoodIngredientPayload } from "@/types/food.type";
import type { UnitType } from "@/types/nutrition.type";

const FOOD_INGREDIENT_UNITS: Array<{ value: UnitType; label: string }> = [
  { value: "UNIT_G", label: "Gram (g)" },
  { value: "UNIT_KG", label: "Kilogram (kg)" },
  { value: "UNIT_MG", label: "Milligram (mg)" },
  { value: "UNIT_OZ", label: "Ounce (oz)" },
  { value: "UNIT_LB", label: "Pound (lb)" },
];

const formSchema = z.object({
  foodName: z
    .string()
    .min(1, "Vui lòng nhập tên món ăn")
    .max(255, "Tên món ăn quá dài"),
  description: z
    .string()
    .max(1000, "Mô tả tối đa 1000 ký tự")
    .optional()
    .nullable(),
  categoryId: z.coerce
    .number()
    .positive("Vui lòng chọn danh mục hợp lệ")
    .optional()
    .nullable(),
  defaultServingGrams: z.coerce
    .number({ message: "Vui lòng nhập khẩu phần (số)" })
    .min(0, "Khẩu phần phải >= 0"),
});

type FormValues = z.infer<typeof formSchema>;
type FoodIngredientFormItem = {
  ingredientId: number;
  ingredientName?: string;
  quantity: number;
  unit: UnitType;
};

const defaultValues: FormValues = {
  foodName: "",
  description: "",
  categoryId: null,
  defaultServingGrams: 0,
};

function normalizeCollection<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) {
    return payload as T[];
  }

  if (payload && typeof payload === "object") {
    const data = payload as {
      result?: T[];
      data?: T[];
    };

    if (Array.isArray(data.result)) {
      return data.result;
    }

    if (Array.isArray(data.data)) {
      return data.data;
    }
  }

  return [];
}

function mapFoodIngredients(
  foodIngredients?: IFood["foodIngredients"],
): FoodIngredientFormItem[] {
  return (foodIngredients ?? []).map((item) => ({
    ingredientId: item.ingredientId,
    ingredientName: item.ingredient?.ingredientName,
    quantity: item.quantityGrams,
    unit: "UNIT_G" as UnitType,
  }));
}

interface FoodFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  initialData?: IFood | null;
}

export function FoodFormDialog({
  open,
  onOpenChange,
  onSuccess,
  initialData,
}: FoodFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [bootstrapping, setBootstrapping] = useState(false);
  const [fetchingIngredients, setFetchingIngredients] = useState(false);
  const [categories, setCategories] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [allIngredients, setAllIngredients] = useState<IIngredient[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<
    FoodIngredientFormItem[]
  >([]);
  const [ingredientErrors, setIngredientErrors] = useState<
    Record<number, string>
  >({});
  const [searchTerm, setSearchTerm] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const initializedKeyRef = useRef<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues,
  });

  const resetRef = useRef(reset);
  useEffect(() => {
    resetRef.current = reset;
  }, [reset]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const loadStaticData = async () => {
      try {
        setFetchingIngredients(true);
        const [categoryRes, ingredientRes] = await Promise.all([
          foodService.getFoodCategories(),
          ingredientService.getAllIngredients(),
        ]);

        setCategories(
          normalizeCollection<{ id: number; name: string }>(categoryRes.data),
        );
        setAllIngredients(normalizeCollection<IIngredient>(ingredientRes.data));
      } catch (error) {
        console.error(error);
        toast.error("Không thể tải danh mục hoặc nguyên liệu");
      } finally {
        setFetchingIngredients(false);
      }
    };

    void loadStaticData();
  }, [open]);

  useEffect(() => {
    if (!open) {
      initializedKeyRef.current = null;
      setSelectedIngredients([]);
      setIngredientErrors({});
      setSearchTerm("");
      setImageFile(null);
      setImagePreview(null);
      return;
    }

    const dialogKey = initialData?.id ? `edit-${initialData.id}` : "create";
    if (initializedKeyRef.current === dialogKey) {
      return;
    }

    initializedKeyRef.current = dialogKey;
    let cancelled = false;

    const initializeForm = async () => {
      try {
        setBootstrapping(true);

        if (initialData?.id) {
          const food = initialData.foodIngredients
            ? initialData
            : (await foodService.getFoodById(initialData.id)).data;

          if (cancelled) {
            return;
          }

          resetRef.current({
            foodName: food.foodName || "",
            description: food.description || "",
            categoryId: food.categoryId || food.foodCategory?.id || null,
            defaultServingGrams: food.defaultServingGrams ?? 0,
          });
          setSelectedIngredients(mapFoodIngredients(food.foodIngredients));
          // Show existing image as preview
          setImagePreview(food.imageUrl || null);
          setImageFile(null);
        } else {
          resetRef.current(defaultValues);
          setSelectedIngredients([]);
          setImagePreview(null);
          setImageFile(null);
        }

        setIngredientErrors({});
        setSearchTerm("");
      } catch (error) {
        console.error(error);
        toast.error("Không thể tải dữ liệu món ăn");
      } finally {
        if (!cancelled) {
          setBootstrapping(false);
        }
      }
    };

    void initializeForm();

    return () => {
      cancelled = true;
    };
  }, [open, initialData]);

  const handleImageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      setImageFile(file);
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
    },
    [],
  );

  const handleRemoveImage = useCallback(() => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const selectedCategory = watch("categoryId");

  const selectedIngredientIds = useMemo(
    () => new Set(selectedIngredients.map((item) => item.ingredientId)),
    [selectedIngredients],
  );

  const filteredIngredients = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) {
      return allIngredients;
    }

    return allIngredients.filter((item) =>
      item.ingredientName.toLowerCase().includes(keyword),
    );
  }, [allIngredients, searchTerm]);

  const addIngredient = (ingredient: IIngredient) => {
    if (selectedIngredientIds.has(ingredient.id)) {
      return;
    }

    setSelectedIngredients((prev) => [
      ...prev,
      {
        ingredientId: ingredient.id,
        ingredientName: ingredient.ingredientName,
        quantity: 100,
        unit: "UNIT_G",
      },
    ]);
  };

  const updateIngredientQuantity = (ingredientId: number, value: string) => {
    const quantity = value === "" ? 0 : Number(value);

    setSelectedIngredients((prev) =>
      prev.map((item) =>
        item.ingredientId === ingredientId ? { ...item, quantity } : item,
      ),
    );

    setIngredientErrors((prev) => {
      if (!prev[ingredientId]) {
        return prev;
      }
      const next = { ...prev };
      delete next[ingredientId];
      return next;
    });
  };

  const updateIngredientUnit = (ingredientId: number, unit: UnitType) => {
    setSelectedIngredients((prev) =>
      prev.map((item) =>
        item.ingredientId === ingredientId ? { ...item, unit } : item,
      ),
    );
  };

  const removeIngredient = (ingredientId: number) => {
    setSelectedIngredients((prev) =>
      prev.filter((item) => item.ingredientId !== ingredientId),
    );

    setIngredientErrors((prev) => {
      const next = { ...prev };
      delete next[ingredientId];
      return next;
    });
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);

      const validationErrors = selectedIngredients.reduce<
        Record<number, string>
      >((acc, item) => {
        if (!Number.isFinite(item.quantity) || item.quantity <= 0) {
          acc[item.ingredientId] = "Số lượng phải lớn hơn 0";
        }
        return acc;
      }, {});

      if (Object.keys(validationErrors).length > 0) {
        setIngredientErrors(validationErrors);
        toast.error("Vui lòng kiểm tra lại số lượng nguyên liệu");
        return;
      }

      const formData = new FormData();
      formData.append("foodName", data.foodName);
      if (data.description) formData.append("description", data.description);
      if (data.categoryId)
        formData.append("categoryId", String(data.categoryId));
      if (data.defaultServingGrams !== undefined)
        formData.append(
          "defaultServingGrams",
          String(data.defaultServingGrams),
        );
      if (imageFile) {
        formData.append("image", imageFile);
      }
      // Append ingredients as JSON string
      const ingredientsPayload = selectedIngredients.map<IFoodIngredientPayload>(
        ({ ingredientId, quantity, unit }) => ({ ingredientId, quantity, unit }),
      );
      formData.append("ingredients", JSON.stringify(ingredientsPayload));

      if (initialData?.id) {
        await foodService.updateFoodFormData(initialData.id, formData);
        toast.success("Cập nhật món ăn thành công");
      } else {
        await foodService.createFoodFormData(formData);
        toast.success("Thêm mới món ăn thành công");
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.EM ||
          "Thao tác thất bại",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="my-6 max-h-[calc(100vh-3rem)] overflow-hidden sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Cập nhật Món ăn" : "Thêm mới Món ăn"}
          </DialogTitle>
        </DialogHeader>
        {bootstrapping ? (
          <div className="flex min-h-80 items-center justify-center text-sm text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang tải dữ liệu...
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex max-h-[75vh] flex-col gap-5 overflow-y-auto px-2 pb-4 pt-1"
          >
            <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
              <div className="space-y-4 rounded-lg border p-4">
                <div className="space-y-2">
                  <Label htmlFor="foodName">
                    Tên món ăn <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="foodName"
                    placeholder="Ví dụ: Phở bò"
                    {...register("foodName")}
                  />
                  {errors.foodName && (
                    <p className="text-sm text-red-500">
                      {errors.foodName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoryId">Danh mục</Label>
                  <Select
                    value={
                      selectedCategory ? String(selectedCategory) : undefined
                    }
                    onValueChange={(value) =>
                      setValue("categoryId", Number.parseInt(value, 10))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={String(category.id)}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.categoryId && (
                    <p className="text-sm text-red-500">
                      {errors.categoryId.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Ảnh món ăn</Label>
                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  {imagePreview ? (
                    <div className="relative w-full overflow-hidden rounded-lg border">
                      <img
                        src={imagePreview}
                        alt="Ảnh xem trước"
                        className="h-40 w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-6 text-sm text-muted-foreground transition hover:bg-muted/40"
                    >
                      <ImageIcon className="h-8 w-8 opacity-40" />
                      <span>Nhấn để chọn ảnh từ thiết bị</span>
                      <span className="text-xs opacity-60">
                        PNG, JPG, WEBP (tối đa 5MB)
                      </span>
                    </button>
                  )}
                  {imagePreview && !imageFile && (
                    <p className="text-xs text-muted-foreground">
                      Ảnh hiện tại. Nhấn vào biểu tượng thùng rác để thay ảnh mới.
                    </p>
                  )}
                  {imageFile && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs text-primary underline-offset-4 hover:underline"
                    >
                      Đổi ảnh khác
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defaultServingGrams">
                    Khẩu phần mặc định (gram){" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="defaultServingGrams"
                    type="number"
                    min={0}
                    step={0.1}
                    placeholder="Ví dụ: 450"
                    {...register("defaultServingGrams")}
                  />
                  {errors.defaultServingGrams && (
                    <p className="text-sm text-red-500">
                      {errors.defaultServingGrams.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    placeholder="Nhập mô tả về món ăn..."
                    rows={4}
                    {...register("description")}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">
                      {errors.description.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex min-h-0 flex-col space-y-4 rounded-lg border p-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label>Kho nguyên liệu</Label>
                    <span className="text-xs text-muted-foreground">
                      Đã chọn {selectedIngredients.length}
                    </span>
                  </div>
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder="Tìm nguyên liệu..."
                      className="pl-9"
                    />
                  </div>
                </div>

                <ScrollArea className="h-[300px] rounded-md border">
                  <div className="space-y-2 p-3">
                    {fetchingIngredients ? (
                      <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang tải nguyên liệu...
                      </div>
                    ) : filteredIngredients.length > 0 ? (
                      filteredIngredients.map((ingredient) => {
                        const isAdded = selectedIngredientIds.has(
                          ingredient.id,
                        );

                        return (
                          <div
                            key={ingredient.id}
                            className="flex items-center justify-between gap-2 rounded-md border px-3 py-2"
                          >
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium">
                                {ingredient.ingredientName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                ID: #{ingredient.id}
                              </p>
                            </div>
                            <Button
                              type="button"
                              size="sm"
                              variant={isAdded ? "secondary" : "outline"}
                              disabled={isAdded}
                              onClick={() => addIngredient(ingredient)}
                            >
                              <Plus className="mr-1 h-4 w-4" />
                              {isAdded ? "Đã thêm" : "Thêm"}
                            </Button>
                          </div>
                        );
                      })
                    ) : (
                      <div className="py-6 text-center text-sm text-muted-foreground">
                        Không tìm thấy nguyên liệu.
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>

            <div className="flex flex-col space-y-2 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <Label>Nguyên liệu đã chọn</Label>
              </div>

              {selectedIngredients.length === 0 ? (
                <div className="rounded-md border border-dashed px-3 py-8 text-center text-sm text-muted-foreground">
                  Chưa có nguyên liệu nào được chọn.
                </div>
              ) : (
                <ScrollArea className="h-[250px] rounded-md border">
                  <div className="grid gap-3 p-3 md:grid-cols-2">
                    {selectedIngredients.map((item) => (
                      <div
                        key={item.ingredientId}
                        className="rounded-md border p-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">
                              {item.ingredientName ||
                                `Nguyên liệu #${item.ingredientId}`}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              ID: #{item.ingredientId}
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => removeIngredient(item.ingredientId)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="mt-3 space-y-2">
                          <Label htmlFor={`quantity-${item.ingredientId}`}>
                            Số lượng
                          </Label>
                          <div className="grid grid-cols-[1fr_150px] gap-2">
                            <Input
                              id={`quantity-${item.ingredientId}`}
                              type="number"
                              min={0.1}
                              step={0.1}
                              value={item.quantity}
                              onChange={(event) =>
                                updateIngredientQuantity(
                                  item.ingredientId,
                                  event.target.value,
                                )
                              }
                            />
                            <select
                              className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                              value={item.unit}
                              onChange={(event) =>
                                updateIngredientUnit(
                                  item.ingredientId,
                                  event.target.value as UnitType,
                                )
                              }
                            >
                              {FOOD_INGREDIENT_UNITS.map((unitOption) => (
                                <option
                                  key={unitOption.value}
                                  value={unitOption.value}
                                >
                                  {unitOption.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          {ingredientErrors[item.ingredientId] && (
                            <p className="text-sm text-red-500">
                              {ingredientErrors[item.ingredientId]}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>

            <div className="mt-4 flex justify-end gap-2 pt-4 border-t">
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
        )}
      </DialogContent>
    </Dialog>
  );
}
