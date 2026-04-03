"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { DataTable, DataTableColumnHeader } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FoodCategory {
  id: number;
  name: string;
  description: string | null;
  parentName: string | null;
  childrenCount: number;
  foodCount: number;
}

const columns: ColumnDef<FoodCategory>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    cell: ({ row }) => <span className="text-muted-foreground font-mono text-xs">#{row.getValue("id")}</span>,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tên danh mục" />,
    cell: ({ row }) => <span className="font-medium">{row.getValue("name")}</span>,
  },
  {
    accessorKey: "parentName",
    header: "Danh mục cha",
    cell: ({ row }) => {
      const p = row.getValue("parentName") as string | null;
      return p ? <StatusBadge variant="info">{p}</StatusBadge> : <StatusBadge variant="muted">Gốc</StatusBadge>;
    },
  },
  {
    accessorKey: "childrenCount",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Số danh mục con" />,
  },
  {
    accessorKey: "foodCount",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Số món ăn" />,
  },
  {
    accessorKey: "description",
    header: "Mô tả",
    cell: ({ row }) => {
      const d = row.getValue("description") as string | null;
      return d ? <span className="text-sm max-w-[250px] truncate block">{d}</span> : <span className="text-muted-foreground">—</span>;
    },
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

const mockData: FoodCategory[] = [
  { id: 1, name: "Món nước", description: "Các loại phở, bún, mì, hủ tiếu", parentName: null, childrenCount: 3, foodCount: 12 },
  { id: 2, name: "Cơm", description: "Các loại cơm", parentName: null, childrenCount: 2, foodCount: 8 },
  { id: 3, name: "Bánh", description: "Bánh mì, bánh cuốn, bánh xèo", parentName: null, childrenCount: 4, foodCount: 15 },
  { id: 4, name: "Khai vị", description: "Các món ăn nhẹ, gỏi, salad", parentName: null, childrenCount: 0, foodCount: 6 },
  { id: 5, name: "Món khô", description: "Các món xào, chiên", parentName: null, childrenCount: 2, foodCount: 10 },
  { id: 6, name: "Phở", description: "Phở bò, phở gà", parentName: "Món nước", childrenCount: 0, foodCount: 3 },
  { id: 7, name: "Bún", description: "Bún bò, bún riêu, bún chả", parentName: "Món nước", childrenCount: 0, foodCount: 5 },
];

export default function FoodCategoriesPage() {
  return (
    <div className="flex flex-col gap-6">
      <DataTable columns={columns} data={mockData} searchKey="name" searchPlaceholder="Tìm danh mục..." />
    </div>
  );
}
