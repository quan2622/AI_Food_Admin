"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { DataTable, DataTableColumnHeader } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AdminRole {
  id: number;
  name: string;
  description: string;
  usersCount: number;
  permissions: string[];
  isActive: boolean;
  createdAt: string;
}

const columns: ColumnDef<AdminRole>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    cell: ({ row }) => <span className="text-muted-foreground font-mono text-xs">#{row.getValue("id")}</span>,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tên vai trò" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold">
          {(row.getValue("name") as string).charAt(0)}
        </span>
        <span className="font-medium">{row.getValue("name")}</span>
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: "Mô tả",
    cell: ({ row }) => <span className="text-sm text-muted-foreground max-w-[250px] truncate block">{row.getValue("description")}</span>,
  },
  {
    accessorKey: "permissions",
    header: "Quyền hạn",
    cell: ({ row }) => {
      const perms = row.getValue("permissions") as string[];
      return (
        <div className="flex flex-wrap gap-1 max-w-[250px]">
          {perms.slice(0, 3).map((p) => (
            <span key={p} className="inline-flex rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium">{p}</span>
          ))}
          {perms.length > 3 && (
            <span className="inline-flex rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">+{perms.length - 3}</span>
          )}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "usersCount",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Số người dùng" />,
  },
  {
    accessorKey: "isActive",
    header: "Trạng thái",
    cell: ({ row }) => (
      <StatusBadge variant={row.getValue("isActive") ? "success" : "danger"}>
        {row.getValue("isActive") ? "Active" : "Inactive"}
      </StatusBadge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày tạo" />,
    cell: ({ row }) => <span className="text-muted-foreground text-sm">{new Date(row.getValue("createdAt")).toLocaleDateString("vi-VN")}</span>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon-sm"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem><Pencil className="mr-2 h-4 w-4" /> Sửa</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Xóa</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

const mockData: AdminRole[] = [
  { id: 1, name: "Super Admin", description: "Toàn quyền truy cập hệ thống", usersCount: 2, permissions: ["CREATE", "READ", "UPDATE", "DELETE", "MANAGE_USERS", "MANAGE_SYSTEM"], isActive: true, createdAt: "2024-01-01T08:00:00Z" },
  { id: 2, name: "Content Manager", description: "Quản lý nội dung thực phẩm và dinh dưỡng", usersCount: 5, permissions: ["CREATE", "READ", "UPDATE"], isActive: true, createdAt: "2024-01-01T08:00:00Z" },
  { id: 3, name: "Viewer", description: "Chỉ xem dữ liệu", usersCount: 10, permissions: ["READ"], isActive: true, createdAt: "2024-01-01T08:00:00Z" },
  { id: 4, name: "AI Engineer", description: "Quản lý mô hình AI và training", usersCount: 3, permissions: ["READ", "MANAGE_AI", "TRAIN_MODEL"], isActive: true, createdAt: "2024-02-01T10:00:00Z" },
  { id: 5, name: "Deprecated Role", description: "Vai trò cũ không còn sử dụng", usersCount: 0, permissions: ["READ"], isActive: false, createdAt: "2024-01-01T08:00:00Z" },
];

export default function AdminRolesPage() {
  return (
    <div className="flex flex-col gap-6">
      <DataTable columns={columns} data={mockData} searchKey="name" searchPlaceholder="Tìm theo tên vai trò..." />
    </div>
  );
}
