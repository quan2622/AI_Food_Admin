"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { DataTable, DataTableColumnHeader } from "@/components/data-table";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Allergen {
  id: number;
  name: string;
  description: string | null;
  usersAffected: number;
  ingredientsCount: number;
  createdAt: string;
}

const columns: ColumnDef<Allergen>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    cell: ({ row }) => <span className="text-muted-foreground font-mono text-xs">#{row.getValue("id")}</span>,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tên chất gây dị ứng" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 text-xs font-bold">
          {(row.getValue("name") as string).charAt(0)}
        </span>
        <span className="font-medium">{row.getValue("name")}</span>
      </div>
    ),
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
    accessorKey: "usersAffected",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Số user bị ảnh hưởng" />,
    cell: ({ row }) => {
      const count = row.getValue("usersAffected") as number;
      return (
        <span className={`text-sm font-medium ${count > 5 ? "text-red-500" : "text-muted-foreground"}`}>
          {count} người
        </span>
      );
    },
  },
  {
    accessorKey: "ingredientsCount",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Số nguyên liệu" />,
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

const mockData: Allergen[] = [
  { id: 1, name: "Đậu phộng", description: "Gây dị ứng phổ biến, có thể gây sốc phản vệ", usersAffected: 8, ingredientsCount: 3, createdAt: "2024-01-01T08:00:00Z" },
  { id: 2, name: "Sữa", description: "Không dung nạp lactose hoặc dị ứng protein sữa", usersAffected: 12, ingredientsCount: 5, createdAt: "2024-01-01T08:00:00Z" },
  { id: 3, name: "Gluten", description: "Có trong lúa mì, lúa mạch, lúa mạch đen", usersAffected: 6, ingredientsCount: 4, createdAt: "2024-01-01T08:00:00Z" },
  { id: 4, name: "Hải sản (có vỏ)", description: "Tôm, cua, sò, ốc", usersAffected: 10, ingredientsCount: 6, createdAt: "2024-01-01T08:00:00Z" },
  { id: 5, name: "Trứng", description: "Trứng gà và các loại trứng gia cầm", usersAffected: 4, ingredientsCount: 2, createdAt: "2024-01-01T08:00:00Z" },
  { id: 6, name: "Đậu nành", description: "Đậu nành và các sản phẩm từ đậu nành", usersAffected: 3, ingredientsCount: 4, createdAt: "2024-01-02T08:00:00Z" },
  { id: 7, name: "Hạt cây", description: "Hạnh nhân, óc chó, hạt điều, macadamia", usersAffected: 2, ingredientsCount: 5, createdAt: "2024-01-02T08:00:00Z" },
];

export default function AllergensPage() {
  return (
    <div className="flex flex-col gap-6">
      <DataTable columns={columns} data={mockData} searchKey="name" searchPlaceholder="Tìm theo tên allergen..." />
    </div>
  );
}
