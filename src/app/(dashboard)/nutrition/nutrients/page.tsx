"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable, DataTableColumnHeader } from "@/components/data-table";
import { MoreHorizontal, Pencil, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { nutritionService } from "@/services/nutritionService";
import type { INutritionComponent } from "@/types/nutrition.type";
import { NutrientFormDialog } from "@/components/nutrition/nutrient-form-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const UNIT_LABELS: Record<string, string> = {
  UNIT_G: "Gram (g)",
  UNIT_KG: "Kilogram (kg)",
  UNIT_MG: "Milligram (mg)",
  UNIT_OZ: "Ounce (oz)",
  UNIT_LB: "Pound (lb)",
};

function formatUnit(unit: string) {
  return UNIT_LABELS[unit] ?? unit;
}

function parseNutrientList(res: {
  metadata?: { EC?: number; message?: string };
  data?: unknown;
}): INutritionComponent[] | null {
  if (res.metadata?.EC !== undefined && res.metadata.EC !== 0) {
    toast.error(res.metadata.message || "Không thể tải danh sách chỉ số dinh dưỡng");
    return null;
  }
  const d = res.data as
    | INutritionComponent[]
    | { EC?: number; EM?: string; result?: INutritionComponent[] }
    | undefined;
  if (Array.isArray(d)) return d;
  if (d && typeof d === "object" && d.EC === 0 && Array.isArray(d.result)) return d.result;
  return [];
}

const columns: ColumnDef<INutritionComponent>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    cell: ({ row }) => (
      <span className="text-muted-foreground font-mono text-xs">#{row.getValue("id")}</span>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tên chất dinh dưỡng" />,
    cell: ({ row }) => <span className="font-medium">{row.getValue("name")}</span>,
  },
  {
    accessorKey: "unit",
    header: "Đơn vị",
    cell: ({ row }) => {
      const u = row.getValue("unit") as string;
      return (
        <span className="inline-flex items-center rounded-md bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 text-xs font-medium">
          {formatUnit(u)}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày tạo" />,
    cell: ({ row }) => {
      const v = row.getValue("createdAt") as string | undefined;
      return (
        <span className="text-muted-foreground text-sm">
          {v ? new Date(v).toLocaleDateString("vi-VN") : "—"}
        </span>
      );
    },
  },
  {
    id: "updatedAt",
    accessorFn: (row) => row.updatedAt ?? row.updateAt,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Cập nhật" />,
    cell: ({ row }) => {
      const v = row.original.updatedAt ?? row.original.updateAt;
      return (
        <span className="text-muted-foreground text-sm">
          {v ? new Date(v).toLocaleDateString("vi-VN") : "—"}
        </span>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row, table }) => {
      const meta = table.options.meta as { onAction?: (a: "edit" | "delete", n: INutritionComponent) => void };
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => meta?.onAction?.("edit", row.original)}>
              <Pencil className="mr-2 h-4 w-4" /> Sửa
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => meta?.onAction?.("delete", row.original)}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function NutrientsPage() {
  const [data, setData] = React.useState<INutritionComponent[]>([]);
  const [selected, setSelected] = React.useState<INutritionComponent | null>(null);
  const [formOpen, setFormOpen] = React.useState(false);
  const [formMode, setFormMode] = React.useState<"create" | "edit">("create");
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  const fetchList = React.useCallback(async () => {
    try {
      const res = (await nutritionService.getNutritionComponents()) as {
        metadata?: { EC?: number; message?: string };
        data?: unknown;
      };
      const list = parseNutrientList(res);
      if (list !== null) setData(list);
    } catch (e) {
      console.error(e);
      toast.error("Đã xảy ra lỗi khi kết nối máy chủ");
    }
  }, []);

  React.useEffect(() => {
    fetchList();
  }, [fetchList]);

  const handleAction = React.useCallback((action: "edit" | "delete", item: INutritionComponent) => {
    setSelected(item);
    if (action === "edit") {
      setFormMode("edit");
      setFormOpen(true);
    }
    if (action === "delete") setDeleteOpen(true);
  }, []);

  const confirmDelete = async () => {
    if (!selected) return;
    try {
      await nutritionService.deleteNutritionComponent(selected.id);
      toast.success("Đã xóa chỉ số dinh dưỡng");
      fetchList();
    } catch (err: unknown) {
      toast.error((err as { message?: string })?.message || "Xóa thất bại");
    } finally {
      setDeleteOpen(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <DataTable
        toolbarActions={
          <Button
            onClick={() => {
              setSelected(null);
              setFormMode("create");
              setFormOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Tạo chỉ số mới
          </Button>
        }
        meta={{ onAction: handleAction }}
        columns={columns}
        data={data}
        searchKey="name"
        searchPlaceholder="Tìm chất dinh dưỡng..."
      />

      <NutrientFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        initialData={selected}
        onSuccess={fetchList}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Xóa &quot;{selected?.name}&quot; có thể ảnh hưởng dữ liệu dinh dưỡng đang dùng chỉ số này.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
