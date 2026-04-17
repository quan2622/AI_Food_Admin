"use client";

import * as React from "react";
import { type ColumnDef, type PaginationState } from "@tanstack/react-table";
import { DataTable, DataTableColumnHeader } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddButton } from "@/components/ui/add-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { foodService } from "@/services/foodService";
import { toast } from "sonner";
import type { IFoodCategoryAdmin } from "@/types/food.type";
import { CategoryFormDialog } from "@/components/foods/category-form-dialog";

const columns: ColumnDef<IFoodCategoryAdmin>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    cell: ({ row }) => (
      <span className="text-muted-foreground font-mono text-xs">
        #{row.getValue("id")}
      </span>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên danh mục" />
    ),
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("name")}</span>
    ),
  },
  {
    // Hiển thị danh mục cha dựa vào trường `parent` trong row.original
    id: "parentName",
    header: "Danh mục cha",
    cell: ({ row }) => {
      const parent = row.original.parent;
      return parent ? (
        <StatusBadge variant="info">{parent.name}</StatusBadge>
      ) : (
        <StatusBadge variant="muted">Gốc</StatusBadge>
      );
    },
  },
  {
    // Hiển thị số danh mục con từ mảng children[]
    id: "childrenCount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Danh mục con" />
    ),
    cell: ({ row }) => (
      <span className="tabular-nums">{row.original.children.length}</span>
    ),
  },
  {
    accessorKey: "foodCount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Số món ăn" />
    ),
    cell: ({ row }) => (
      <span className="tabular-nums">{row.getValue("foodCount")}</span>
    ),
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
        {new Date(row.getValue("createdAt")).toLocaleDateString("vi-VN")}
      </span>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cập nhật" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {row.getValue("updatedAt")
          ? new Date(row.getValue("updatedAt")).toLocaleDateString("vi-VN")
          : "—"}
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
            <DropdownMenuItem onClick={() => meta?.onAction("edit", row.original)}>
              <Pencil className="mr-2 h-4 w-4 text-orange-500" /> Sửa
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

export default function FoodCategoriesPage() {
  const [data, setData] = React.useState<IFoodCategoryAdmin[]>([]);
  const [, setLoading] = React.useState(true);
  const [total, setTotal] = React.useState(0);
  const [pages, setPages] = React.useState(1);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // State cho dialog form
  const [formOpen, setFormOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState<IFoodCategoryAdmin | null>(null);
  const [formMode, setFormMode] = React.useState<"create" | "edit">("create");

  const fetchCategories = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await foodService.getCategoriesPaginated(
        pagination.pageIndex + 1,
        pagination.pageSize,
      );
      if (res.metadata?.EC === 0 && res.data) {
        setData(res.data.result);
        setTotal(res.data.meta.total);
        setPages(res.data.meta.pages);
      } else {
        toast.error(res.metadata?.message || "Không thể tải danh mục món ăn");
      }
    } catch (error) {
      console.error("Fetch categories error:", error);
      toast.error("Đã xảy ra lỗi khi kết nối máy chủ");
    } finally {
      setLoading(false);
    }
  }, [pagination.pageIndex, pagination.pageSize]);

  React.useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAction = React.useCallback(
    async (action: "edit" | "delete", payload: IFoodCategoryAdmin) => {
      if (action === "edit") {
        setSelectedCategory(payload);
        setFormMode("edit");
        setFormOpen(true);
      }
      if (action === "delete") {
        if (
          window.confirm(`Bạn có chắc chắn muốn xóa danh mục: ${payload.name}?`)
        ) {
          try {
            const res = await foodService.deleteCategory(payload.id);
            if (res.metadata?.EC === 0) {
              toast.success("Xóa thành công");
              fetchCategories();
            } else {
              toast.error(res.metadata?.message || "Xóa thất bại");
            }
          } catch (e: any) {
            toast.error(
              e?.message ||
                "Xóa thất bại. Danh mục này có thể đang chứa món ăn hoặc danh mục con.",
            );
          }
        }
      }
    },
    [fetchCategories],
  );

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <DataTable
        toolbarActions={
          <AddButton
            onClick={() => {
              setSelectedCategory(null);
              setFormMode("create");
              setFormOpen(true);
            }}
            label="Thêm danh mục mới"
          />
        }
        columns={columns}
        data={data}
        defaultColumnVisibility={{ description: false, createdAt: false }}
        searchKey="name"
        searchPlaceholder="Tìm danh mục..."
        pageCount={pages}
        rowCount={total}
        pagination={pagination}
        setPagination={setPagination}
        meta={{ onAction: handleAction }}
      />

      <CategoryFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        initialData={selectedCategory}
        categoryOptions={data.map((c) => ({ id: c.id, name: c.name }))}
        onSuccess={fetchCategories}
      />
    </div>
  );
}

