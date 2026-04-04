"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { DataTable, DataTableColumnHeader } from "@/components/data-table";
import { MoreHorizontal, Pencil, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Food {
  id: number;
  foodName: string;
  description: string | null;
  imageUrl: string | null;
  categoryName: string | null;
  defaultServingGrams: number | null;
  createdAt: string;
}

const columns: ColumnDef<Food>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    cell: ({ row }) => <span className="text-muted-foreground font-mono text-xs">#{row.getValue("id")}</span>,
    enableHiding: false,
  },
  {
    accessorKey: "imageUrl",
    header: "Ảnh",
    cell: ({ row }) => {
      const url = row.getValue("imageUrl") as string | null;
      return url ? (
        <img src={url} alt="" className="h-10 w-10 rounded-lg object-cover" />
      ) : (
        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground text-xs">N/A</div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "foodName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tên món ăn" />,
    cell: ({ row }) => <span className="font-medium">{row.getValue("foodName")}</span>,
  },
  {
    accessorKey: "categoryName",
    header: "Danh mục",
    cell: ({ row }) => {
      const cat = row.getValue("categoryName") as string | null;
      return cat ? <span className="text-sm">{cat}</span> : <span className="text-muted-foreground">—</span>;
    },
    filterFn: (row, id, value) => row.getValue(id) === value,
  },
  {
    accessorKey: "defaultServingGrams",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Khẩu phần (g)" />,
    cell: ({ row }) => {
      const g = row.getValue("defaultServingGrams") as number | null;
      return g ? <span>{g}g</span> : <span className="text-muted-foreground">—</span>;
    },
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
          <DropdownMenuItem><Eye className="mr-2 h-4 w-4" /> Xem</DropdownMenuItem>
          <DropdownMenuItem><Pencil className="mr-2 h-4 w-4" /> Sửa</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Xóa</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

const mockData: Food[] = [
  { id: 1, foodName: "Phở bò", description: "Phở bò truyền thống Hà Nội", imageUrl: null, categoryName: "Món nước", defaultServingGrams: 500, createdAt: "2024-01-10T08:00:00Z" },
  { id: 2, foodName: "Bún bò Huế", description: "Bún bò đặc sản Huế", imageUrl: null, categoryName: "Món nước", defaultServingGrams: 450, createdAt: "2024-01-12T09:00:00Z" },
  { id: 3, foodName: "Cơm tấm sườn", description: "Cơm tấm sườn nướng", imageUrl: null, categoryName: "Cơm", defaultServingGrams: 400, createdAt: "2024-01-15T10:00:00Z" },
  { id: 4, foodName: "Bánh mì thịt", description: "Bánh mì Sài Gòn", imageUrl: null, categoryName: "Bánh", defaultServingGrams: 250, createdAt: "2024-02-01T08:00:00Z" },
  { id: 5, foodName: "Gỏi cuốn", description: "Gỏi cuốn tôm thịt", imageUrl: null, categoryName: "Khai vị", defaultServingGrams: 200, createdAt: "2024-02-10T11:00:00Z" },
  { id: 6, foodName: "Bò lúc lắc", description: "Bò xào khoai tây", imageUrl: null, categoryName: "Món khô", defaultServingGrams: 350, createdAt: "2024-03-05T14:00:00Z" },
];

export default function FoodsListPage() {
  return (
    <div className="flex flex-col gap-6">
      <DataTable
        columns={columns}
        data={mockData}
        searchKey="foodName"
        searchPlaceholder="Tìm theo tên món ăn..."
      />
    </div>
  );
}
