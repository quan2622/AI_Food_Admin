"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { DataTable, DataTableColumnHeader } from "@/components/data-table";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Nutrient {
  id: number;
  name: string;
  unit: string;
}

const columns: ColumnDef<Nutrient>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    cell: ({ row }) => <span className="text-muted-foreground font-mono text-xs">#{row.getValue("id")}</span>,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tên chất dinh dưỡng" />,
    cell: ({ row }) => <span className="font-medium">{row.getValue("name")}</span>,
  },
  {
    accessorKey: "unit",
    header: "Đơn vị",
    cell: ({ row }) => (
      <span className="inline-flex items-center rounded-md bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 text-xs font-medium">
        {row.getValue("unit")}
      </span>
    ),
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

const mockData: Nutrient[] = [
  { id: 1, name: "Calories", unit: "kcal" },
  { id: 2, name: "Protein", unit: "g" },
  { id: 3, name: "Carbohydrates", unit: "g" },
  { id: 4, name: "Fat", unit: "g" },
  { id: 5, name: "Fiber", unit: "g" },
  { id: 6, name: "Vitamin A", unit: "µg" },
  { id: 7, name: "Vitamin C", unit: "mg" },
  { id: 8, name: "Calcium", unit: "mg" },
  { id: 9, name: "Iron", unit: "mg" },
  { id: 10, name: "Sodium", unit: "mg" },
  { id: 11, name: "Potassium", unit: "mg" },
  { id: 12, name: "Vitamin D", unit: "µg" },
];

export default function NutrientsPage() {
  return (
    <div className="flex flex-col gap-6">
      <DataTable columns={columns} data={mockData} searchKey="name" searchPlaceholder="Tìm chất dinh dưỡng..." />
    </div>
  );
}
