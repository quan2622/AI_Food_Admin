"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { DataTable, DataTableColumnHeader } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";
import { MoreHorizontal, Pencil, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface IngredientNutrition {
  id: number;
  ingredientName: string;
  servingSize: number;
  servingUnit: string;
  source: string;
  isCalculated: boolean;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  createdAt: string;
}

const sourceMap: Record<string, { label: string; variant: "info" | "warning" | "success" }> = {
  SRC_USDA: { label: "USDA", variant: "info" },
  SRC_MANUAL: { label: "Thủ công", variant: "warning" },
  SRC_CALC: { label: "Tính toán", variant: "success" },
};

const unitMap: Record<string, string> = {
  UNIT_G: "g",
  UNIT_KG: "kg",
  UNIT_MG: "mg",
  UNIT_OZ: "oz",
  UNIT_LB: "lb",
};

const columns: ColumnDef<IngredientNutrition>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    cell: ({ row }) => <span className="text-muted-foreground font-mono text-xs">#{row.getValue("id")}</span>,
    enableHiding: false,
  },
  {
    accessorKey: "ingredientName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nguyên liệu" />,
    cell: ({ row }) => <span className="font-medium">{row.getValue("ingredientName")}</span>,
  },
  {
    accessorKey: "servingSize",
    header: "Khẩu phần",
    cell: ({ row }) => {
      const unit = unitMap[row.original.servingUnit] ?? row.original.servingUnit;
      return <span>{row.getValue("servingSize")} {unit}</span>;
    },
  },
  {
    accessorKey: "calories",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Calories" />,
    cell: ({ row }) => <span className="font-medium">{row.getValue("calories")} kcal</span>,
  },
  {
    accessorKey: "protein",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Protein" />,
    cell: ({ row }) => <span className="text-blue-600">{row.getValue("protein")}g</span>,
  },
  {
    accessorKey: "carbs",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Carbs" />,
    cell: ({ row }) => <span className="text-amber-600">{row.getValue("carbs")}g</span>,
  },
  {
    accessorKey: "fat",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Fat" />,
    cell: ({ row }) => <span className="text-red-500">{row.getValue("fat")}g</span>,
  },
  {
    accessorKey: "source",
    header: "Nguồn",
    cell: ({ row }) => {
      const src = row.getValue("source") as string;
      const info = sourceMap[src] ?? { label: src, variant: "muted" as const };
      return <StatusBadge variant={info.variant}>{info.label}</StatusBadge>;
    },
    filterFn: (row, id, value) => row.getValue(id) === value,
  },
  {
    accessorKey: "isCalculated",
    header: "Loại",
    cell: ({ row }) => (
      <StatusBadge variant={row.getValue("isCalculated") ? "info" : "muted"}>
        {row.getValue("isCalculated") ? "Tự động" : "Nhập"}
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
          <DropdownMenuItem><Eye className="mr-2 h-4 w-4" /> Xem</DropdownMenuItem>
          <DropdownMenuItem><Pencil className="mr-2 h-4 w-4" /> Sửa</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Xóa</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

const mockData: IngredientNutrition[] = [
  { id: 1, ingredientName: "Thịt bò", servingSize: 100, servingUnit: "UNIT_G", source: "SRC_USDA", isCalculated: false, calories: 250, protein: 26, carbs: 0, fat: 15, createdAt: "2024-01-05T08:00:00Z" },
  { id: 2, ingredientName: "Cơm trắng", servingSize: 100, servingUnit: "UNIT_G", source: "SRC_USDA", isCalculated: false, calories: 130, protein: 2.7, carbs: 28, fat: 0.3, createdAt: "2024-01-06T09:00:00Z" },
  { id: 3, ingredientName: "Trứng gà", servingSize: 100, servingUnit: "UNIT_G", source: "SRC_MANUAL", isCalculated: false, calories: 155, protein: 13, carbs: 1.1, fat: 11, createdAt: "2024-01-07T10:00:00Z" },
  { id: 4, ingredientName: "Tôm sú", servingSize: 100, servingUnit: "UNIT_G", source: "SRC_USDA", isCalculated: false, calories: 99, protein: 24, carbs: 0.2, fat: 0.3, createdAt: "2024-01-08T11:00:00Z" },
  { id: 5, ingredientName: "Bông cải xanh", servingSize: 100, servingUnit: "UNIT_G", source: "SRC_USDA", isCalculated: false, calories: 34, protein: 2.8, carbs: 7, fat: 0.4, createdAt: "2024-01-09T08:00:00Z" },
  { id: 6, ingredientName: "Bánh phở", servingSize: 100, servingUnit: "UNIT_G", source: "SRC_CALC", isCalculated: true, calories: 110, protein: 2.5, carbs: 24, fat: 0.5, createdAt: "2024-01-10T09:00:00Z" },
];

export default function IngredientNutritionPage() {
  return (
    <div className="flex flex-col gap-6">
      <DataTable
        columns={columns}
        data={mockData}
        searchKey="ingredientName"
        searchPlaceholder="Tìm theo tên nguyên liệu..."
        filterableColumns={[
          {
            id: "source",
            title: "Nguồn dữ liệu",
            options: [
              { label: "USDA", value: "SRC_USDA" },
              { label: "Thủ công", value: "SRC_MANUAL" },
              { label: "Tính toán", value: "SRC_CALC" },
            ],
          },
        ]}
      />
    </div>
  );
}
