"use client";

import { type ColumnDef, type PaginationState } from "@tanstack/react-table";
import { DataTable, DataTableColumnHeader } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import * as React from "react";
import { userService } from "@/services/userService";
import { toast } from "sonner";

interface User {
  id: number;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  isAdmin: boolean;
  status: boolean;
  dateOfBirth: string | null;
  createdAt: string;
}

const columns: ColumnDef<User>[] = [
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
    accessorKey: "fullName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Họ tên" />
    ),
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatarUrl ?? undefined} />
            <AvatarFallback className="text-xs">
              {user.fullName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{user.fullName}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.getValue("email")}</span>
    ),
  },
  {
    accessorKey: "isAdmin",
    header: "Vai trò",
    cell: ({ row }) => (
      <StatusBadge variant={row.getValue("isAdmin") ? "info" : "muted"}>
        {row.getValue("isAdmin") ? "Admin" : "User"}
      </StatusBadge>
    ),
    filterFn: (row, id, value) => String(row.getValue(id)) === value,
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => (
      <StatusBadge variant={row.getValue("status") ? "success" : "danger"}>
        {row.getValue("status") ? "Hoạt động" : "Bị khóa"}
      </StatusBadge>
    ),
    filterFn: (row, id, value) => String(row.getValue(id)) === value,
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
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" /> Xem chi tiết
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Pencil className="mr-2 h-4 w-4" /> Chỉnh sửa
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

export default function UsersListPage() {
  const [data, setData] = React.useState<User[]>([]);
  const [, setLoading] = React.useState(true);
  const [total, setTotal] = React.useState(0);
  const [pages, setPages] = React.useState(1);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const fetchUsers = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await userService.getUsersPaginated(
        pagination.pageIndex + 1,
        pagination.pageSize
      );
      if (res.data.EC === 0) {
        setData(res.data.result as unknown as User[]);
        setTotal(res.data.meta.total);
        setPages(res.data.meta.pages);
      } else {
        toast.error(res.data.EM || "Không thể tải danh sách người dùng");
      }
    } catch (error) {
      console.error("Fetch users error:", error);
      toast.error("Đã xảy ra lỗi khi kết nối máy chủ");
    } finally {
      setLoading(false);
    }
  }, [pagination.pageIndex, pagination.pageSize]);

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div className="flex flex-col gap-6">
      <DataTable
        columns={columns}
        data={data}
        searchKey="fullName"
        searchPlaceholder="Tìm theo tên..."
        pageCount={pages}
        rowCount={total}
        pagination={pagination}
        setPagination={setPagination}
        filterableColumns={[
          {
            id: "status",
            title: "Trạng thái",
            options: [
              { label: "Hoạt động", value: "true" },
              { label: "Bị khóa", value: "false" },
            ],
          },
          {
            id: "isAdmin",
            title: "Vai trò",
            options: [
              { label: "Admin", value: "true" },
              { label: "User", value: "false" },
            ],
          },
        ]}
      />
    </div>
  );
}
