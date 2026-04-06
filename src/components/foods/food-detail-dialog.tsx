import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IFood } from "@/types/food.type";

export function FoodDetailDialog({
  open,
  onOpenChange,
  food,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  food?: IFood | null;
}) {
  if (!food) return null;

  const ingredients = food.foodIngredients || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Chi tiết Món ăn</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {food.imageUrl ? (
            <div className="w-full h-[180px] rounded-lg overflow-hidden border">
              <img src={food.imageUrl} alt={food.foodName} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-full h-[180px] border rounded-lg bg-muted flex items-center justify-center text-muted-foreground text-sm">
              Không có ảnh
            </div>
          )}

          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground">Tên món:</span>
            <span className="col-span-2 text-base font-semibold">{food.foodName}</span>
          </div>

          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground">Danh mục:</span>
            <span className="col-span-2 text-sm">{food.foodCategory?.name || "—"}</span>
          </div>

          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground">Khẩu phần gốc:</span>
            <span className="col-span-2 text-sm">
              {food.defaultServingGrams ? `${food.defaultServingGrams}g` : "Chưa cập nhật"}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <span className="text-sm font-medium text-muted-foreground">Mô tả:</span>
            <span className="col-span-2 text-sm">{food.description || "—"}</span>
          </div>

          <div className="border-t pt-4">
            <h4 className="text-sm font-medium mb-3">
              Nguyên liệu ({ingredients.length}):
            </h4>
            {ingredients.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">Chưa có nguyên liệu.</p>
            ) : (
              <div className="space-y-2">
                {ingredients.map((fi) => (
                  <div
                    key={fi.id}
                    className="flex items-center justify-between rounded-md border bg-muted/40 px-3 py-2 text-sm"
                  >
                    <span className="font-medium">{fi.ingredient?.ingredientName || `Nguyên liệu #${fi.ingredientId}`}</span>
                    <span className="text-muted-foreground font-mono text-xs">{fi.quantityGrams}g</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
