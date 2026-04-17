"use client";

import * as React from "react";
import { type ColumnDef, type PaginationState } from "@tanstack/react-table";
import { DataTable, DataTableColumnHeader } from "@/components/data-table";
import { FileCode2, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddButton } from "@/components/ui/add-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { allCodeService } from "@/services/allCodeService";
import type { IAllCode } from "@/types/allcode.type";
import { AllCodeFormDialog } from "@/components/system/allcode-form-dialog";

const columns: ColumnDef<IAllCode>[] = [
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
    accessorKey: "keyMap",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Key" />,
    cell: ({ row }) => (
      <span className="inline-flex rounded-md bg-primary/10 px-2 py-0.5 font-mono text-xs font-medium text-primary">
        {row.getValue("keyMap")}
      </span>
    ),
  },
  {
    accessorKey: "type",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
    cell: ({ row }) => (
      <span className="inline-flex rounded-md border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-600">
        {row.getValue("type")}
      </span>
    ),
  },
  {
    accessorKey: "value",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Value" />,
    cell: ({ row }) => <span className="font-medium">{row.getValue("value")}</span>,
  },
  {
    accessorKey: "description",
    header: "Mô tả",
    cell: ({ row }) => {
      const d = row.getValue("description") as string | null;
      return d ? (
        <span className="block max-w-[300px] truncate text-sm text-muted-foreground">
          {d}
        </span>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày tạo" />,
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {new Date(row.getValue("createdAt") as string).toLocaleDateString("vi-VN")}
      </span>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Cập nhật" />,
    cell: ({ row }) => {
      const v = row.original.updatedAt;
      return v ? (
        <span className="text-sm text-muted-foreground">
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
      const meta = table.options.meta as {
        onAction?: (action: "edit", item: IAllCode) => void;
      };
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => meta?.onAction?.("edit", row.original)}>
              <Pencil className="mr-2 h-4 w-4 text-orange-500" /> Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" /> Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function AllCodesPage() {
  const [data, setData] = React.useState<IAllCode[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [total, setTotal] = React.useState(0);
  const [pages, setPages] = React.useState(1);
  const [typeOptions, setTypeOptions] = React.useState<string[]>([]);
  const [typeFilter, setTypeFilter] = React.useState<string | undefined>(undefined);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [formOpen, setFormOpen] = React.useState(false);
  const [formMode, setFormMode] = React.useState<"create" | "edit">("create");
  const [selectedCode, setSelectedCode] = React.useState<IAllCode | null>(null);

  const handleAction = React.useCallback((action: "edit", item: IAllCode) => {
    if (action === "edit") {
      setSelectedCode(item);
      setFormMode("edit");
      setFormOpen(true);
    }
  }, []);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await allCodeService.getAllCodesList();
        if (!cancelled) {
          const types = [...new Set(list.map((x) => x.type))].sort();
          setTypeOptions(types);
        }
      } catch {
        if (!cancelled) setTypeOptions([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const fetchCodes = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await allCodeService.getAllCodesAdminPaginated(
        pagination.pageIndex + 1,
        pagination.pageSize,
        typeFilter ? { type: typeFilter } : undefined
      );
      if (res.data && res.data.EC === 0) {
        setData(res.data.result as IAllCode[]);
        setTotal(res.data.meta.total);
        setPages(res.data.meta.pages);
      } else {
        toast.error(res.data?.EM || "Không thể tải danh sách mã");
      }
    } catch (error) {
      console.error("Fetch allcodes error:", error);
      toast.error("Đã xảy ra lỗi khi kết nối máy chủ");
    } finally {
      setLoading(false);
    }
  }, [pagination.pageIndex, pagination.pageSize, typeFilter]);

  React.useEffect(() => {
    fetchCodes();
  }, [fetchCodes]);

  return (
    <div
      className={cn(
        "flex flex-col gap-6 transition-opacity",
        loading && "pointer-events-none opacity-60"
      )}
    >
      <DataTable
        meta={{ onAction: handleAction }}
        toolbarActions={
          <div className="flex flex-wrap items-center gap-2">
            <AddButton
              onClick={() => {
                setSelectedCode(null);
                setFormMode("create");
                setFormOpen(true);
              }}
              label="Tạo mã mới"
              icon={FileCode2}
            />
            <span className="whitespace-nowrap text-sm text-muted-foreground">
              Nhóm (type)
            </span>
            <Select
              value={typeFilter ?? "__all__"}
              onValueChange={(v) => {
                setTypeFilter(v === "__all__" ? undefined : v);
                setPagination((p) => ({ ...p, pageIndex: 0 }));
              }}
            >
              <SelectTrigger className="h-8 w-[220px]">
                <SelectValue placeholder="Tất cả" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">Tất cả</SelectItem>
                {typeOptions.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
        columns={columns}
        data={data}
        searchKey="keyMap"
        searchPlaceholder="Tìm theo key..."
        pageCount={pages}
        rowCount={total}
        pagination={pagination}
        setPagination={setPagination}
        defaultColumnVisibility={{ description: false }}
      />

      <AllCodeFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        initialData={selectedCode}
        typeSuggestions={typeOptions}
        onSuccess={() => {
          void (async () => {
            await fetchCodes();
            try {
              const list = await allCodeService.getAllCodesList();
              setTypeOptions([...new Set(list.map((x) => x.type))].sort());
            } catch {
              /* ignore */
            }
          })();
        }}
      />
    </div>
  );
}
