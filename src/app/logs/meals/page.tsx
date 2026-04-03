"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { DataTable, DataTableColumnHeader } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";
import { MoreHorizontal, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Meal {
  id: number;
  userName: string;
  mealType: string;
  mealDateTime: string;
  itemsCount: number;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

const mealTypeMap: Record<string, { label: string; variant: "info" | "success" | "warning" | "danger" }> = {
  MEAL_BREAKFAST: { label: "Sáng", variant: "info" },
  MEAL_LUNCH: { label: "Trưa", variant: "success" },
  MEAL_DINNER: { label: "Tối", variant: "warning" },
  MEAL_SNACK: { label: "Ăn vặt", variant: "danger" },
};

const columns: ColumnDef<Meal>[] = [
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
    accessorKey: "mealType",
    header: "Bữa ăn",
    cell: ({ row }) => {
      const t = row.getValue("mealType") as string;
      const info = mealTypeMap[t] ?? { label: t, variant: "muted" as const };
      return <StatusBadge variant={info.variant}>{info.label}</StatusBadge>;
    },
    filterFn: (row, id, value) => row.getValue(id) === value,
  },
  {
    accessorKey: "mealDateTime",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Thời gian" />,
    cell: ({ row }) => <span className="text-sm">{new Date(row.getValue("mealDateTime")).toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}</span>,
  },
  {
    accessorKey: "itemsCount",
    header: "Số món",
  },
  {
    accessorKey: "totalCalories",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Calories" />,
    cell: ({ row }) => <span className="font-medium">{row.getValue("totalCalories")} kcal</span>,
  },
  {
    accessorKey: "totalProtein",
    header: "Protein",
    cell: ({ row }) => <span className="text-blue-600">{row.getValue("totalProtein")}g</span>,
  },
  {
    accessorKey: "totalCarbs",
    header: "Carbs",
    cell: ({ row }) => <span className="text-amber-600">{row.getValue("totalCarbs")}g</span>,
  },
  {
    accessorKey: "totalFat",
    header: "Fat",
    cell: ({ row }) => <span className="text-red-500">{row.getValue("totalFat")}g</span>,
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

const mockData: Meal[] = [
  { id: 1, userName: "Nguyễn Văn An", mealType: "MEAL_BREAKFAST", mealDateTime: "2024-04-01T07:00:00Z", itemsCount: 2, totalCalories: 450, totalProtein: 20, totalCarbs: 55, totalFat: 15 },
  { id: 2, userName: "Nguyễn Văn An", mealType: "MEAL_LUNCH", mealDateTime: "2024-04-01T12:00:00Z", itemsCount: 3, totalCalories: 700, totalProtein: 35, totalCarbs: 80, totalFat: 25 },
  { id: 3, userName: "Nguyễn Văn An", mealType: "MEAL_DINNER", mealDateTime: "2024-04-01T18:30:00Z", itemsCount: 2, totalCalories: 600, totalProtein: 30, totalCarbs: 65, totalFat: 20 },
  { id: 4, userName: "Trần Thị Bích", mealType: "MEAL_BREAKFAST", mealDateTime: "2024-04-01T06:30:00Z", itemsCount: 1, totalCalories: 350, totalProtein: 15, totalCarbs: 40, totalFat: 12 },
  { id: 5, userName: "Trần Thị Bích", mealType: "MEAL_LUNCH", mealDateTime: "2024-04-01T11:30:00Z", itemsCount: 2, totalCalories: 550, totalProtein: 25, totalCarbs: 60, totalFat: 18 },
  { id: 6, userName: "Lê Minh Cường", mealType: "MEAL_SNACK", mealDateTime: "2024-04-01T15:00:00Z", itemsCount: 1, totalCalories: 200, totalProtein: 10, totalCarbs: 25, totalFat: 8 },
  { id: 7, userName: "Lê Minh Cường", mealType: "MEAL_DINNER", mealDateTime: "2024-04-01T19:00:00Z", itemsCount: 4, totalCalories: 900, totalProtein: 50, totalCarbs: 100, totalFat: 30 },
];

export default function MealsPage() {
  return (
    <div className="flex flex-col gap-6">
      <DataTable
        columns={columns}
        data={mockData}
        searchKey="userName"
        searchPlaceholder="Tìm theo tên người dùng..."
        filterableColumns={[
          {
            id: "mealType",
            title: "Bữa ăn",
            options: [
              { label: "Sáng", value: "MEAL_BREAKFAST" },
              { label: "Trưa", value: "MEAL_LUNCH" },
              { label: "Tối", value: "MEAL_DINNER" },
              { label: "Ăn vặt", value: "MEAL_SNACK" },
            ],
          },
        ]}
      />
    </div>
  );
}
