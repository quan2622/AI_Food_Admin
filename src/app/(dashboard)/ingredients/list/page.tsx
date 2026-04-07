"use client";

import * as React from "react";
import { type ColumnDef, type PaginationState } from "@tanstack/react-table";
import { DataTable, DataTableColumnHeader } from "@/components/data-table";
import { Eye, MoreHorizontal, Pencil, Trash2, Apple } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { ingredientService } from "@/services/ingredientService";
import type { IIngredient } from "@/types/ingredient.type";
import { IngredientFormDialog } from "@/components/ingredients/ingredient-form-dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ImagePreviewDialog } from "@/components/image-preview-dialog";

const columns: ColumnDef<IIngredient>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    cell: ({ row }) => <span className="text-muted-foreground font-mono text-xs">#{row.getValue("id")}</span>,
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
        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground text-xs"><Apple className="w-5 h-5 opacity-20"/></div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "ingredientName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tên nguyên liệu" />,
    cell: ({ row }) => <span className="font-medium">{row.getValue("ingredientName")}</span>,
  },
  {
    accessorKey: "description",
    header: "Mô tả",
    cell: ({ row }) => {
      const d = row.getValue("description") as string | null;
      return d ? <span className="text-sm max-w-[250px] truncate block">{d}</span> : <span className="text-muted-foreground">—</span>;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày tạo" />,
    cell: ({ row }) => {
        const val = row.getValue("createdAt");
        return val ? <span className="text-muted-foreground text-sm">{new Date(val as string).toLocaleDateString("vi-VN")}</span> : <span className="text-muted-foreground text-sm">—</span>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row, table }) => {
        const meta = table.options.meta as any;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon-sm"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => meta?.onAction("edit", row.original)}><Pencil className="mr-2 h-4 w-4" /> Sửa</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => meta?.onAction("delete", row.original)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Xóa</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
  },
];

export default function IngredientsListPage() {
  const [data, setData] = React.useState<IIngredient[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [total, setTotal] = React.useState(0);
  const [pages, setPages] = React.useState(1);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [selectedItem, setSelectedItem] = React.useState<IIngredient | null>(null);
  const [formOpen, setFormOpen] = React.useState(false);
  const [formMode, setFormMode] = React.useState<"create" | "edit">("create");
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = React.useState<string | null>(null);

  const fetchIngredients = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await ingredientService.getIngredientsPaginated(
        pagination.pageIndex + 1,
        pagination.pageSize
      );
      if (res.data && res.data.EC === 0) {
        setData((res.data.result as unknown as IIngredient[]) || []);
        setTotal(res.data.meta?.total || 0);
        setPages(res.data.meta?.pages || 1);
      } else {
        // According to API docs, might not exist yet, fallback elegantly
        toast.error(res.data?.EM || "Không thể tải danh sách nguyên liệu, API có thể chưa hỗ trợ trực tiếp");
        setData([]);
      }
    } catch (error) {
      console.error("Fetch ingredients error:", error);
      toast.error("Đã xảy ra lỗi khi kết nối máy chủ");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.pageIndex, pagination.pageSize]);

  React.useEffect(() => {
    fetchIngredients();
  }, [fetchIngredients]);

  const handleAction = React.useCallback((action: "edit" | "delete", item: IIngredient) => {
    setSelectedItem(item);
    if (action === "edit") {
      setFormMode("edit");
      setFormOpen(true);
    }
    if (action === "delete") {
      setDeleteOpen(true);
    }
  }, []);

  const handleImageClick = React.useCallback((url: string) => {
    setImagePreviewUrl(url);
  }, []);

  const confirmDelete = async () => {
    if (!selectedItem) return;
    try {
      setLoading(true);
      await ingredientService.deleteIngredient(selectedItem.id);
      toast.success("Xóa thành công!");
      fetchIngredients();
    } catch (e: any) {
      toast.error(e.message || "Xóa thất bại!");
    } finally {
      setLoading(false);
      setDeleteOpen(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <DataTable
        toolbarActions={
          <Button onClick={() => {
            setSelectedItem(null);
            setFormMode("create");
            setFormOpen(true);
          }}>
            <Apple className="mr-2 h-4 w-4" />
            Tạo nguyên liệu
          </Button>
        }
        meta={{ onAction: handleAction, onImageClick: handleImageClick }}
        columns={columns}
        data={data}
        searchKey="ingredientName"
        searchPlaceholder="Tìm theo tên nguyên liệu..."
        pageCount={pages}
        rowCount={total}
        pagination={pagination}
        setPagination={setPagination}
      />
      <IngredientFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        initialData={selectedItem}
        onSuccess={fetchIngredients}
      />
      
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa nguyên liệu "{selectedItem?.ingredientName}"?
              Thao tác này là vĩnh viễn và có thể ảnh hưởng đến các món ăn sử dụng nó.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <ImagePreviewDialog 
        url={imagePreviewUrl} 
        onClose={() => setImagePreviewUrl(null)} 
      />
    </div>
  );
}
