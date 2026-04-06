"use client";

import { type ColumnDef, type PaginationState } from "@tanstack/react-table";
import { DataTable, DataTableColumnHeader } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";
import { MoreHorizontal, Pencil, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import * as React from "react";
import { userProfileService } from "@/services/userProfileService";
import { toast } from "sonner";
import { UserProfileFormDialog } from "@/components/users/user-profile-form-dialog";
import { UserProfileDetailDialog } from "@/components/users/user-profile-detail-dialog";

interface UserProfile {
  id: number;
  userId: number;
  user?: {
    id: number;
    fullName: string;
    email: string;
    avatarUrl: string | null;
  };
  age: number;
  height: number;
  weight: number;
  bmi: number;
  bmr: number;
  tdee: number;
  gender: string | null;
  activityLevel: string | null;
  activityLevelData?: {
    id: number;
    levelName: string;
    description: string;
  } | null;
}

const activityLevelMap: Record<string, string> = {
  ACT_SEDENTARY: "Ít vận động",
  ACT_LIGHT: "Nhẹ nhàng",
  ACT_MODERATE: "Trung bình",
  ACT_VERY: "Năng động",
  ACT_SUPER: "Rất năng động",
};

const columns: ColumnDef<UserProfile>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    cell: ({ row }) => <span className="text-muted-foreground font-mono text-xs">#{row.getValue("id")}</span>,
    enableHiding: false,
  },
  {
    id: "userName",
    accessorFn: (row) => row.user?.fullName,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Người dùng" />,
    cell: ({ row }) => {
      const fullName = row.getValue("userName") as string || "—";
      return <span className="font-medium">{fullName}</span>;
    },
  },
  {
    accessorKey: "age",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tuổi" />,
  },
  {
    accessorKey: "gender",
    header: "Giới tính",
    cell: ({ row }) => {
      let g = row.getValue("gender") as string | null;
      if (!g || g === "NULL") g = "OTHER";
      return (
        <StatusBadge variant={g === "MALE" ? "info" : g === "FEMALE" ? "warning" : "default"}>
          {g === "MALE" ? "Nam" : (g === "FEMALE" ? "Nữ" : "Khác")}
        </StatusBadge>
      );
    },
  },
  {
    accessorKey: "height",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Chiều cao" />,
    cell: ({ row }) => <span>{row.getValue("height")} cm</span>,
  },
  {
    accessorKey: "weight",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Cân nặng" />,
    cell: ({ row }) => <span>{row.getValue("weight")} kg</span>,
  },
  {
    accessorKey: "bmi",
    header: ({ column }) => <DataTableColumnHeader column={column} title="BMI" />,
    cell: ({ row }) => {
      const bmi = row.getValue("bmi") as number;
      const variant = bmi < 18.5 ? "warning" : bmi < 25 ? "success" : bmi < 30 ? "warning" : "danger";
      return <StatusBadge variant={variant}>{bmi.toFixed(1)}</StatusBadge>;
    },
  },
  {
    accessorKey: "bmr",
    header: ({ column }) => <DataTableColumnHeader column={column} title="BMR" />,
    cell: ({ row }) => <span>{(row.getValue("bmr") as number).toFixed(0)} kcal</span>,
  },
  {
    accessorKey: "tdee",
    header: ({ column }) => <DataTableColumnHeader column={column} title="TDEE" />,
    cell: ({ row }) => <span>{(row.getValue("tdee") as number).toFixed(0)} kcal</span>,
  },
  {
    accessorKey: "activityLevel",
    header: "Mức vận động",
    cell: ({ row }) => {
      const level = row.getValue("activityLevel") as string | null;
      const actData = row.original.activityLevelData;
      const displayLabel = actData?.description || actData?.levelName || activityLevelMap[level || ""] || level;
      return displayLabel ? <StatusBadge variant="info">{displayLabel}</StatusBadge> : <span className="text-muted-foreground">—</span>;
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
            <DropdownMenuItem onClick={() => meta?.onAction("view", row.original)}><Eye className="mr-2 h-4 w-4" /> Xem chi tiết</DropdownMenuItem>
            <DropdownMenuItem onClick={() => meta?.onAction("edit", row.original)}><Pencil className="mr-2 h-4 w-4" /> Cập nhật</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Xóa</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function UserProfilesPage() {
  const [data, setData] = React.useState<UserProfile[]>([]);
  const [, setLoading] = React.useState(true);
  const [total, setTotal] = React.useState(0);
  const [pages, setPages] = React.useState(1);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  
  const [selectedProfile, setSelectedProfile] = React.useState<UserProfile | null>(null);
  const [formOpen, setFormOpen] = React.useState(false);
  const [detailOpen, setDetailOpen] = React.useState(false);

  const fetchProfiles = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await userProfileService.getAdminProfilesPaginated(
        pagination.pageIndex + 1,
        pagination.pageSize
      );
      if (res.data?.EC === 0) {
        setData(res.data.result as unknown as UserProfile[]);
        setTotal(res.data.meta.total);
        setPages(res.data.meta.pages);
      } else {
        toast.error(res.data?.EM || "Không thể tải danh sách profiles");
      }
    } catch (error) {
      console.error("Fetch profiles error:", error);
      toast.error("Đã xảy ra lỗi khi kết nối máy chủ");
    } finally {
      setLoading(false);
    }
  }, [pagination.pageIndex, pagination.pageSize]);

  React.useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const handleAction = React.useCallback((action: "view" | "edit", profile: UserProfile) => {
    setSelectedProfile(profile);
    if (action === "view") setDetailOpen(true);
    if (action === "edit") setFormOpen(true);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <DataTable
        columns={columns}
        data={data}
        searchKey="userName"
        searchPlaceholder="Tìm theo tên..."
        pageCount={pages}
        rowCount={total}
        pagination={pagination}
        setPagination={setPagination}
        meta={{ onAction: handleAction }}
        filterableColumns={[
          {
            id: "gender",
            title: "Giới tính",
            options: [
              { label: "Nam", value: "MALE" },
              { label: "Nữ", value: "FEMALE" },
              { label: "Khác", value: "OTHER" },
            ],
          },
          {
            id: "activityLevel",
            title: "Vận động",
            options: [
              { label: "Ít vận động", value: "SEDENTARY" },
              { label: "Nhẹ nhàng", value: "LIGHTLY_ACTIVE" },
              { label: "Trung bình", value: "MODERATELY_ACTIVE" },
              { label: "Năng động", value: "VERY_ACTIVE" },
              { label: "Rất năng động", value: "SUPER_ACTIVE" },
            ],
          },
        ]}
      />

      <UserProfileFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        initialData={selectedProfile}
        onSuccess={fetchProfiles}
      />

      <UserProfileDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        profile={selectedProfile}
      />
    </div>
  );
}
