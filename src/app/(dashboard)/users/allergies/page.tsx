"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { DataTable, DataTableColumnHeader } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserAllergy {
  id: number;
  userName: string;
  allergenName: string;
  severity: string;
  note: string | null;
  createdAt: string;
}

const severityMap: Record<string, { label: string; variant: "success" | "warning" | "danger" | "info" }> = {
  SEV_LOW: { label: "Nhẹ", variant: "success" },
  SEV_MEDIUM: { label: "Trung bình", variant: "warning" },
  SEV_HIGH: { label: "Nặng", variant: "danger" },
  SEV_LIFE_THREATENING: { label: "Nguy hiểm", variant: "danger" },
};

const columns: ColumnDef<UserAllergy>[] = [
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
    accessorKey: "allergenName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Chất gây dị ứng" />,
    cell: ({ row }) => <span className="font-medium">{row.getValue("allergenName")}</span>,
  },
  {
    accessorKey: "severity",
    header: "Mức độ",
    cell: ({ row }) => {
      const sev = row.getValue("severity") as string;
      const info = severityMap[sev] ?? { label: sev, variant: "muted" as const };
      return <StatusBadge variant={info.variant}>{info.label}</StatusBadge>;
    },
    filterFn: (row, id, value) => row.getValue(id) === value,
  },
  {
    accessorKey: "note",
    header: "Ghi chú",
    cell: ({ row }) => {
      const note = row.getValue("note") as string | null;
      return note ? <span className="text-sm max-w-[200px] truncate block">{note}</span> : <span className="text-muted-foreground">—</span>;
    },
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

const mockData: UserAllergy[] = [
  { id: 1, userName: "Nguyễn Văn An", allergenName: "Đậu phộng", severity: "SEV_HIGH", note: "Phản ứng nặng, cần mang EpiPen", createdAt: "2024-01-15T08:00:00Z" },
  { id: 2, userName: "Trần Thị Bích", allergenName: "Sữa", severity: "SEV_MEDIUM", note: "Không dung nạp lactose", createdAt: "2024-02-20T10:00:00Z" },
  { id: 3, userName: "Lê Minh Cường", allergenName: "Gluten", severity: "SEV_LOW", note: null, createdAt: "2024-03-10T14:00:00Z" },
  { id: 4, userName: "Phạm Thùy Dung", allergenName: "Hải sản", severity: "SEV_LIFE_THREATENING", note: "Sốc phản vệ", createdAt: "2024-04-05T09:00:00Z" },
  { id: 5, userName: "Hoàng Đức Em", allergenName: "Trứng", severity: "SEV_LOW", note: null, createdAt: "2024-05-12T16:00:00Z" },
];

export default function UserAllergiesPage() {
  return (
    <div className="flex flex-col gap-6">
      <DataTable
        columns={columns}
        data={mockData}
        searchKey="userName"
        searchPlaceholder="Tìm theo tên người dùng..."
        filterableColumns={[
          {
            id: "severity",
            title: "Mức độ",
            options: [
              { label: "Nhẹ", value: "SEV_LOW" },
              { label: "Trung bình", value: "SEV_MEDIUM" },
              { label: "Nặng", value: "SEV_HIGH" },
              { label: "Nguy hiểm", value: "SEV_LIFE_THREATENING" },
            ],
          },
        ]}
      />
    </div>
  );
}
