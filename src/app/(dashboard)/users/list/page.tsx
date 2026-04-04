"use client";

import { type ColumnDef } from "@tanstack/react-table";
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
      const user = row.original;
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

const mockUsers: User[] = [
  { id: 1, fullName: "Nguyễn Văn An", email: "an.nguyen@gmail.com", avatarUrl: null, isAdmin: true, status: true, dateOfBirth: "1990-05-15", createdAt: "2024-01-10T08:00:00Z" },
  { id: 2, fullName: "Trần Thị Bích", email: "bich.tran@gmail.com", avatarUrl: null, isAdmin: false, status: true, dateOfBirth: "1995-09-22", createdAt: "2024-02-14T10:30:00Z" },
  { id: 3, fullName: "Lê Minh Cường", email: "cuong.le@gmail.com", avatarUrl: null, isAdmin: false, status: false, dateOfBirth: "1988-12-01", createdAt: "2024-03-05T14:20:00Z" },
  { id: 4, fullName: "Phạm Thùy Dung", email: "dung.pham@gmail.com", avatarUrl: null, isAdmin: false, status: true, dateOfBirth: "1993-07-30", createdAt: "2024-03-18T09:15:00Z" },
  { id: 5, fullName: "Hoàng Đức Em", email: "em.hoang@gmail.com", avatarUrl: null, isAdmin: false, status: true, dateOfBirth: "2000-01-20", createdAt: "2024-04-01T16:45:00Z" },
  { id: 6, fullName: "Võ Thiên Phúc", email: "phuc.vo@gmail.com", avatarUrl: null, isAdmin: true, status: true, dateOfBirth: "1992-11-11", createdAt: "2024-04-22T07:00:00Z" },
  { id: 7, fullName: "Đặng Kim Oanh", email: "oanh.dang@gmail.com", avatarUrl: null, isAdmin: false, status: true, dateOfBirth: "1997-03-14", createdAt: "2024-05-10T12:30:00Z" },
  { id: 8, fullName: "Bùi Quốc Hùng", email: "hung.bui@gmail.com", avatarUrl: null, isAdmin: false, status: false, dateOfBirth: "1985-08-05", createdAt: "2024-06-01T11:00:00Z" },
];

export default function UsersListPage() {
  return (
    <div className="flex flex-col gap-6">
      <DataTable
        columns={columns}
        data={mockUsers}
        searchKey="fullName"
        searchPlaceholder="Tìm theo tên..."
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
