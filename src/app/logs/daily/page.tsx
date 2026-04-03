"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { DataTable, DataTableColumnHeader } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";
import { MoreHorizontal, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DailyLog {
  id: number;
  userName: string;
  logDate: string;
  status: string;
  mealsCount: number;
  totalCalories: number;
  createdAt: string;
}

const statusMap: Record<string, { label: string; variant: "success" | "warning" | "danger" }> = {
  STATUS_BELOW: { label: "Dưới mục tiêu", variant: "warning" },
  STATUS_MET: { label: "Đạt mục tiêu", variant: "success" },
  STATUS_ABOVE: { label: "Vượt mục tiêu", variant: "danger" },
};

const columns: ColumnDef<DailyLog>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    cell: ({ row }) => <span className="text-muted-foreground font-mono text-xs">#{row.getValue("id")}</span>,
    enableHiding: false,
  },
  {
    accessorKey: "userName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Người dùng" />,
    cell: ({ row }) => <span className="font-medium">{row.getValue("userName")}</span>,
  },
  {
    accessorKey: "logDate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày" />,
    cell: ({ row }) => <span className="font-medium">{new Date(row.getValue("logDate")).toLocaleDateString("vi-VN", { weekday: "short", day: "2-digit", month: "2-digit", year: "numeric" })}</span>,
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const s = row.getValue("status") as string;
      const info = statusMap[s] ?? { label: s, variant: "muted" as const };
      return <StatusBadge variant={info.variant}>{info.label}</StatusBadge>;
    },
    filterFn: (row, id, value) => row.getValue(id) === value,
  },
  {
    accessorKey: "mealsCount",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Số bữa ăn" />,
  },
  {
    accessorKey: "totalCalories",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tổng Calories" />,
    cell: ({ row }) => <span className="font-medium">{row.getValue("totalCalories")} kcal</span>,
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
          <DropdownMenuItem><Eye className="mr-2 h-4 w-4" /> Xem chi tiết</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Xóa</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

const mockData: DailyLog[] = [
  { id: 1, userName: "Nguyễn Văn An", logDate: "2024-04-01", status: "STATUS_MET", mealsCount: 3, totalCalories: 1850, createdAt: "2024-04-01T22:00:00Z" },
  { id: 2, userName: "Nguyễn Văn An", logDate: "2024-04-02", status: "STATUS_ABOVE", mealsCount: 4, totalCalories: 2300, createdAt: "2024-04-02T22:00:00Z" },
  { id: 3, userName: "Trần Thị Bích", logDate: "2024-04-01", status: "STATUS_BELOW", mealsCount: 2, totalCalories: 1200, createdAt: "2024-04-01T22:00:00Z" },
  { id: 4, userName: "Trần Thị Bích", logDate: "2024-04-02", status: "STATUS_MET", mealsCount: 3, totalCalories: 1580, createdAt: "2024-04-02T22:00:00Z" },
  { id: 5, userName: "Lê Minh Cường", logDate: "2024-04-01", status: "STATUS_MET", mealsCount: 3, totalCalories: 2750, createdAt: "2024-04-01T22:00:00Z" },
  { id: 6, userName: "Phạm Thùy Dung", logDate: "2024-04-01", status: "STATUS_BELOW", mealsCount: 2, totalCalories: 1100, createdAt: "2024-04-01T22:00:00Z" },
  { id: 7, userName: "Hoàng Đức Em", logDate: "2024-04-02", status: "STATUS_ABOVE", mealsCount: 5, totalCalories: 2600, createdAt: "2024-04-02T22:00:00Z" },
];

export default function DailyLogsPage() {
  return (
    <div className="flex flex-col gap-6">
      <DataTable
        columns={columns}
        data={mockData}
        searchKey="userName"
        searchPlaceholder="Tìm theo tên người dùng..."
        filterableColumns={[
          {
            id: "status",
            title: "Trạng thái",
            options: [
              { label: "Dưới mục tiêu", value: "STATUS_BELOW" },
              { label: "Đạt mục tiêu", value: "STATUS_MET" },
              { label: "Vượt mục tiêu", value: "STATUS_ABOVE" },
            ],
          },
        ]}
      />
    </div>
  );
}
