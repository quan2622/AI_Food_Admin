"use client";

import * as React from "react";
import { type ColumnDef, type PaginationState } from "@tanstack/react-table";
import { DataTable, DataTableColumnHeader } from "@/components/data-table";
import { MoreHorizontal, Pencil, Trash2, ShieldPlus } from "lucide-react";
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
import { ingredientService } from "@/services/ingredientService";
import type { IAllergen } from "@/types/ingredient.type";
import { AllergenFormDialog } from "@/components/ingredients/allergen-form-dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

const columns: ColumnDef<IAllergen>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    cell: ({ row }) => <span className="text-muted-foreground font-mono text-xs">#{row.getValue("id")}</span>,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tên chất gây dị ứng" />,
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      const imageUrl = row.original.imageUrl;
      return (
        <div className="flex items-center gap-2">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="h-8 w-8 rounded-full object-cover border"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                target.nextElementSibling?.classList.remove("hidden");
              }}
            />
          ) : null}
          <span
            className={cn(
              "inline-flex h-7 w-7 items-center justify-center rounded-full bg-orange-500/10 text-orange-600 text-xs font-bold uppercase shrink-0",
              imageUrl && "hidden"
            )}
          >
            {name.charAt(0)}
          </span>
          <span className="font-medium">{name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "imageUrl",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Hình ảnh" />,
    cell: ({ row }) => {
      const imageUrl = row.original.imageUrl;
      if (!imageUrl) return <span className="text-muted-foreground text-sm">—</span>;
      return (
        <a
          href={imageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline text-sm max-w-[200px] truncate block"
        >
          Xem ảnh
        </a>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Mô tả",
    cell: ({ row }) => {
      const d = row.getValue("description") as string | null;
      return d ? <span className="text-sm max-w-[300px] truncate block">{d}</span> : <span className="text-muted-foreground">—</span>;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày tạo" />,
    cell: ({ row }) => <span className="text-muted-foreground text-sm">{new Date(row.getValue("createdAt") as string).toLocaleDateString("vi-VN")}</span>,
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Cập nhật" />,
    cell: ({ row }) => {
      const v = row.original.updatedAt;
      return v ? (
        <span className="text-muted-foreground text-sm">
          {new Date(v).toLocaleDateString("vi-VN")}
        </span>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
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
            <DropdownMenuItem onClick={() => meta?.onAction("edit", row.original)}><Pencil className="mr-2 h-4 w-4 text-orange-500" /> Chỉnh sửa</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => meta?.onAction("delete", row.original)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Xóa</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function AllergensPage() {
  const [data, setData] = React.useState<IAllergen[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [total, setTotal] = React.useState(0);
  const [pages, setPages] = React.useState(1);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [selectedAllergen, setSelectedAllergen] = React.useState<IAllergen | null>(null);
  const [formOpen, setFormOpen] = React.useState(false);
  const [formMode, setFormMode] = React.useState<"create" | "edit">("create");

  const [deleteOpen, setDeleteOpen] = React.useState(false);

  const fetchAllergens = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await ingredientService.getAllergensPaginated(
        pagination.pageIndex + 1,
        pagination.pageSize
      );
      if (res.data && res.data.EC === 0) {
        setData(res.data.result as unknown as IAllergen[]);
        setTotal(res.data.meta.total);
        setPages(res.data.meta.pages);
      } else {
        toast.error(res.data?.EM || "Không thể tải danh sách chất gây dị ứng");
      }
    } catch (error) {
      console.error("Fetch allergens error:", error);
      toast.error("Đã xảy ra lỗi khi kết nối máy chủ");
    } finally {
      setLoading(false);
    }
  }, [pagination.pageIndex, pagination.pageSize]);

  React.useEffect(() => {
    fetchAllergens();
  }, [fetchAllergens]);

  const handleAction = React.useCallback((action: "edit" | "delete", item: IAllergen) => {
    setSelectedAllergen(item);
    if (action === "edit") {
      setFormMode("edit");
      setFormOpen(true);
    }
    if (action === "delete") {
      setDeleteOpen(true);
    }
  }, []);

  const confirmDelete = async () => {
    if (!selectedAllergen) return;
    try {
      setLoading(true);
      await ingredientService.deleteAllergen(selectedAllergen.id);
      toast.success("Xóa thành công!");
      fetchAllergens();
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
          <AddButton
            onClick={() => {
              setSelectedAllergen(null);
              setFormMode("create");
              setFormOpen(true);
            }}
            label="Thêm chất gây dị ứng"
            icon={ShieldPlus}
          />
        }
        meta={{ onAction: handleAction }}
        columns={columns}
        data={data}
        searchKey="name"
        searchPlaceholder="Tìm theo tên allergen..."
        pageCount={pages}
        rowCount={total}
        pagination={pagination}
        setPagination={setPagination}
        defaultColumnVisibility={{ description: false }}
      />

      <AllergenFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        initialData={selectedAllergen}
        onSuccess={fetchAllergens}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa chất gây dị ứng "{selectedAllergen?.name}"?
              Hành động này sẽ xóa các liên kết dữ liệu liên quan ở món ăn.
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
    </div>
  );
}
