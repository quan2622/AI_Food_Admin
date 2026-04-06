"use client";

import * as React from "react";
import { type ColumnDef, type PaginationState } from "@tanstack/react-table";
import { DataTable, DataTableColumnHeader } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";
import { MoreHorizontal, Pencil, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { userAllergyService } from "@/services/userAllergyService";
import { toast } from "sonner";
import { UserAllergyDetailDialog } from "@/components/users/user-allergy-detail-dialog";

interface UserAllergyGroup {
  userId: number;
  user: {
    id: number;
    email: string;
    fullName: string;
    avatarUrl: string | null;
  };
  allergies: Array<{
    id: number;
    severity: string;
    note: string | null;
    allergenId: number;
    allergen: {
      id: number;
      name: string;
      description: string | null;
    };
  }>;
}

const severityMap: Record<string, { label: string; variant: "success" | "warning" | "danger" | "info" }> = {
  SEV_LOW: { label: "Nhẹ", variant: "success" },
  SEV_MEDIUM: { label: "Trung bình", variant: "warning" },
  SEV_HIGH: { label: "Nặng", variant: "danger" },
  SEV_LIFE_THREATENING: { label: "Nguy hiểm", variant: "danger" },
};

const columns: ColumnDef<UserAllergyGroup>[] = [
  {
    accessorKey: "userId",
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID User" />,
    cell: ({ row }) => <span className="text-muted-foreground font-mono text-xs">#{row.getValue("userId")}</span>,
    enableHiding: false,
  },
  {
    id: "userName",
    accessorFn: (row) => row.user?.fullName || row.user?.email,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Người dùng" />,
    cell: ({ row }) => <span className="font-medium">{row.getValue("userName")}</span>,
  },
  {
    id: "allergiesList",
    header: "Danh sách dị ứng",
    cell: ({ row }) => {
      const allergies = row.original.allergies || [];
      if (allergies.length === 0) return <span className="text-muted-foreground text-sm">Không có</span>;

      const displayCount = 3;
      const visible = allergies.slice(0, displayCount);
      const hiddenCount = allergies.length - displayCount;

      return (
        <div className="flex flex-wrap gap-2">
          {visible.map((a) => {
            const sev = severityMap[a.severity] ?? { label: a.severity, variant: "muted" };
            return (
              <StatusBadge key={a.id} variant={sev.variant} className="text-xs">
                {a.allergen?.name} ({sev.label})
              </StatusBadge>
            );
          })}
          {hiddenCount > 0 && (
            <StatusBadge variant="default" className="text-xs capitalize">
              +{hiddenCount} loại khác...
            </StatusBadge>
          )}
        </div>
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
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm"><MoreHorizontal className="h-4 w-4" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => meta?.onAction("view", row.original)}>
              <Eye className="mr-2 h-4 w-4" /> Xem chi tiết
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" /> Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function UserAllergiesPage() {
  const [data, setData] = React.useState<UserAllergyGroup[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [total, setTotal] = React.useState(0);
  const [pages, setPages] = React.useState(1);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  
  const [selectedGroup, setSelectedGroup] = React.useState<UserAllergyGroup | null>(null);
  const [detailOpen, setDetailOpen] = React.useState(false);

  const fetchAllergies = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await userAllergyService.getAdminAllergiesPaginated(
        pagination.pageIndex + 1,
        pagination.pageSize
      );
      if (res.data?.EC === 0) {
        setData(res.data.result as unknown as UserAllergyGroup[]);
        setTotal(res.data.meta.total);
        setPages(res.data.meta.pages);
      } else {
        toast.error(res.data?.EM || "Không thể tải danh sách dị ứng");
      }
    } catch (error) {
      console.error("Fetch allergies error:", error);
      toast.error("Đã xảy ra lỗi kết nối");
    } finally {
      setLoading(false);
    }
  }, [pagination.pageIndex, pagination.pageSize]);

  React.useEffect(() => {
    fetchAllergies();
  }, [fetchAllergies]);

  const handleAction = React.useCallback((action: "view", payload: UserAllergyGroup) => {
    if (action === "view") {
      setSelectedGroup(payload);
      setDetailOpen(true);
    }
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <DataTable
        columns={columns}
        data={data}
        pageCount={pages}
        rowCount={total}
        pagination={pagination}
        setPagination={setPagination}
        searchKey="userName"
        searchPlaceholder="Tìm theo tên người dùng..."
        meta={{ onAction: handleAction }}
      />
      
      <UserAllergyDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        payload={selectedGroup}
      />
    </div>
  );
}
