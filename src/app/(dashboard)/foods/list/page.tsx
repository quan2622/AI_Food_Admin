"use client";

import React, { useMemo } from "react";
import { type ColumnDef, type PaginationState } from "@tanstack/react-table";
import { DataTable, DataTableColumnHeader } from "@/components/data-table";
import { MoreHorizontal, Pencil, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddButton } from "@/components/ui/add-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { foodService } from "@/services/foodService";
import { IFood } from "@/types/food.type";
import { FoodDetailDialog } from "@/components/foods/food-detail-dialog";
import { FoodFormDialog } from "@/components/foods/food-form-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ImagePreviewDialog } from "@/components/image-preview-dialog";

const columns: ColumnDef<IFood>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground font-mono text-xs">
        #{row.getValue("id")}
      </span>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "imageUrl",
    header: "Ảnh",
    cell: ({ row, table }) => {
      const url = row.getValue("imageUrl") as string | null;
      const meta = table.options.meta as any;
      return url ? (
        <img 
          src={url} 
          alt="" 
          className="h-10 w-10 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity hover:shadow-md" 
          onClick={() => meta?.onImageClick?.(url)}
        />
      ) : (
        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground text-xs text-center border">
          N/A
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "foodName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên món ăn" />
    ),
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("foodName")}</span>
    ),
  },
  {
    id: "categoryName",
    accessorFn: (row) => row.foodCategory?.name,
    header: "Danh mục",
    cell: ({ row }) => {
      const cat = row.original.foodCategory?.name;
      return cat ? (
        <span className="text-sm rounded-md bg-secondary/50 px-2 py-1">
          {cat}
        </span>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
  {
    accessorKey: "defaultServingGrams",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Khẩu phần" />
    ),
    cell: ({ row }) => {
      const g = row.getValue("defaultServingGrams") as number | null;
      return g ? (
        <span>{g}g</span>
      ) : (
        <span className="text-muted-foreground text-xs italic">0g</span>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Mô tả",
    cell: ({ row }) => {
      const d = row.getValue("description") as string | null;
      return d ? (
        <span className="text-sm max-w-[250px] truncate block text-muted-foreground">
          {d}
        </span>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ngày tạo" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {new Date(row.getValue("createdAt") || "").toLocaleDateString("vi-VN")}
      </span>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ngày chỉnh sửa" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {new Date(row.getValue("updatedAt") || "").toLocaleDateString("vi-VN")}
      </span>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row, table }) => {
      const meta = table.options.meta as any;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => meta?.onAction("view", row.original)}
            >
              <Eye className="mr-2 h-4 w-4 text-blue-500" /> Xem chi tiết
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => meta?.onAction("edit", row.original)}
            >
              <Pencil className="mr-2 h-4 w-4 text-orange-500" /> Cập nhật
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive font-medium focus:bg-destructive focus:text-destructive-foreground"
              onClick={() => meta?.onAction("delete", row.original)}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function FoodsListPage() {
  const [data, setData] = React.useState<IFood[]>([]);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [selectedFood, setSelectedFood] = React.useState<IFood | null>(null);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [formOpen, setFormOpen] = React.useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = React.useState<string | null>(null);

  const fetchFoods = React.useCallback(async () => {
    try {
      setLoading(true);
      // Backend uses current = pageIndex + 1
      const res = await foodService.getAdminFoodsPaginated(
        pagination.pageIndex + 1,
        pagination.pageSize,
      );

      if (res.data?.result) {
        setData(res.data.result);
        setTotal(res.data.meta?.total || 0);
      } else {
        setData([]);
        setTotal(0);
      }
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải danh sách thực phẩm");
    } finally {
      setLoading(false);
    }
  }, [pagination.pageIndex, pagination.pageSize]);

  React.useEffect(() => {
    fetchFoods();
  }, [fetchFoods]);

  const handleAction = React.useCallback(
    async (action: "view" | "edit" | "delete", payload: IFood) => {
      if (action === "view") {
        setSelectedFood(payload);
        setDetailOpen(true);
      }
      if (action === "edit") {
        setSelectedFood(payload);
        setFormOpen(true);
      }
      if (action === "delete") {
        if (
          window.confirm(`Bạn có chắc chắn muốn xóa món: ${payload.foodName}?`)
        ) {
          try {
            await foodService.deleteFood(payload.id);
            toast.success("Xóa thành công");
            fetchFoods();
          } catch (e: any) {
            toast.error(
              e?.response?.data?.message ||
                "Xóa thất bại. Món ăn này có thể đang ràng buộc với dữ liệu liên quan (RESTRICT).",
            );
          }
        }
      }
    },
    [fetchFoods],
  );

  const handleImageClick = React.useCallback((url: string) => {
    setImagePreviewUrl(url);
  }, []);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="bg-background rounded-lg">
        <DataTable
          columns={columns}
          data={data}
          pageCount={Math.ceil(total / pagination.pageSize)}
          pagination={pagination}
          setPagination={setPagination}
          searchKey="foodName"
          searchPlaceholder="Tìm theo tên món ăn..."
          meta={{ onAction: handleAction, onImageClick: handleImageClick }}
          defaultColumnVisibility={{ description: false, createdAt: false }}
          toolbarActions={
            <AddButton
              onClick={() => {
                setSelectedFood(null);
                setFormOpen(true);
              }}
              label="Thêm món ăn mới"
            />
          }
        />
      </div>

      <FoodDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        food={selectedFood}
      />
      <FoodFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        initialData={selectedFood}
        onSuccess={fetchFoods}
      />
      <ImagePreviewDialog 
        url={imagePreviewUrl} 
        onClose={() => setImagePreviewUrl(null)} 
      />
    </div>
  );
}
