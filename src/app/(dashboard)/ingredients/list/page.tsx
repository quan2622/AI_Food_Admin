"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { DataTable, DataTableColumnHeader } from "@/components/data-table";
import { MoreHorizontal, Pencil, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Ingredient {
  id: number;
  ingredientName: string;
  description: string | null;
  imageUrl: string | null;
  allergensCount: number;
  foodsCount: number;
  createdAt: string;
}

const columns: ColumnDef<Ingredient>[] = [
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
    accessorKey: "ingredientName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tên nguyên liệu" />,
    cell: ({ row }) => <span className="font-medium">{row.getValue("ingredientName")}</span>,
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
    accessorKey: "allergensCount",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Chất gây dị ứng" />,
    cell: ({ row }) => {
      const count = row.getValue("allergensCount") as number;
      return count > 0 ? (
        <span className="inline-flex items-center rounded-md bg-amber-500/10 text-amber-600 border border-amber-500/20 px-2 py-0.5 text-xs font-medium">{count} allergen</span>
      ) : (
        <span className="text-muted-foreground text-sm">Không có</span>
      );
    },
  },
  {
    accessorKey: "foodsCount",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Số món ăn" />,
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

const mockData: Ingredient[] = [
  { id: 1, ingredientName: "Thịt bò", description: "Thịt bò tươi", imageUrl: null, allergensCount: 0, foodsCount: 8, createdAt: "2024-01-05T08:00:00Z" },
  { id: 2, ingredientName: "Bánh phở", description: "Bánh phở tươi", imageUrl: null, allergensCount: 1, foodsCount: 4, createdAt: "2024-01-05T08:00:00Z" },
  { id: 3, ingredientName: "Hành lá", description: "Hành lá tươi", imageUrl: null, allergensCount: 0, foodsCount: 15, createdAt: "2024-01-06T09:00:00Z" },
  { id: 4, ingredientName: "Tôm", description: "Tôm sú tươi", imageUrl: null, allergensCount: 2, foodsCount: 6, createdAt: "2024-01-07T10:00:00Z" },
  { id: 5, ingredientName: "Đậu phộng", description: "Đậu phộng rang", imageUrl: null, allergensCount: 1, foodsCount: 5, createdAt: "2024-01-08T11:00:00Z" },
  { id: 6, ingredientName: "Trứng gà", description: "Trứng gà ta", imageUrl: null, allergensCount: 1, foodsCount: 12, createdAt: "2024-01-09T08:00:00Z" },
  { id: 7, ingredientName: "Sữa tươi", description: "Sữa tươi không đường", imageUrl: null, allergensCount: 1, foodsCount: 3, createdAt: "2024-01-10T09:00:00Z" },
  { id: 8, ingredientName: "Bột mì", description: "Bột mì đa dụng", imageUrl: null, allergensCount: 1, foodsCount: 7, createdAt: "2024-01-11T10:00:00Z" },
];

export default function IngredientsListPage() {
  return (
    <div className="flex flex-col gap-6">
      <DataTable columns={columns} data={mockData} searchKey="ingredientName" searchPlaceholder="Tìm theo tên nguyên liệu..." />
    </div>
  );
}
