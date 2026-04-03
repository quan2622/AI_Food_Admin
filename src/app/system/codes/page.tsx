"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { DataTable, DataTableColumnHeader } from "@/components/data-table";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AllCode {
  id: number;
  keyMap: string;
  type: string;
  value: string;
  description: string | null;
  createdAt: string;
}

const columns: ColumnDef<AllCode>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    cell: ({ row }) => <span className="text-muted-foreground font-mono text-xs">#{row.getValue("id")}</span>,
    enableHiding: false,
  },
  {
    accessorKey: "keyMap",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Key" />,
    cell: ({ row }) => (
      <span className="inline-flex rounded-md bg-primary/10 px-2 py-0.5 font-mono text-xs font-medium text-primary">
        {row.getValue("keyMap")}
      </span>
    ),
  },
  {
    accessorKey: "type",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
    cell: ({ row }) => (
      <span className="inline-flex rounded-md bg-blue-500/10 text-blue-600 border border-blue-500/20 px-2 py-0.5 text-xs font-medium">
        {row.getValue("type")}
      </span>
    ),
    filterFn: (row, id, value) => row.getValue(id) === value,
  },
  {
    accessorKey: "value",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Value" />,
    cell: ({ row }) => <span className="font-medium">{row.getValue("value")}</span>,
  },
  {
    accessorKey: "description",
    header: "Mô tả",
    cell: ({ row }) => {
      const d = row.getValue("description") as string | null;
      return d ? <span className="text-sm max-w-[300px] truncate block text-muted-foreground">{d}</span> : <span className="text-muted-foreground">—</span>;
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

const mockData: AllCode[] = [
  { id: 1, keyMap: "GOAL_LOSS", type: "GoalType", value: "Giảm cân", description: "Mục tiêu giảm cân", createdAt: "2024-01-01T08:00:00Z" },
  { id: 2, keyMap: "GOAL_GAIN", type: "GoalType", value: "Tăng cân", description: "Mục tiêu tăng cân", createdAt: "2024-01-01T08:00:00Z" },
  { id: 3, keyMap: "GOAL_MAINTAIN", type: "GoalType", value: "Duy trì", description: "Mục tiêu duy trì cân nặng", createdAt: "2024-01-01T08:00:00Z" },
  { id: 4, keyMap: "MEAL_BREAKFAST", type: "MealType", value: "Bữa sáng", description: null, createdAt: "2024-01-01T08:00:00Z" },
  { id: 5, keyMap: "MEAL_LUNCH", type: "MealType", value: "Bữa trưa", description: null, createdAt: "2024-01-01T08:00:00Z" },
  { id: 6, keyMap: "MEAL_DINNER", type: "MealType", value: "Bữa tối", description: null, createdAt: "2024-01-01T08:00:00Z" },
  { id: 7, keyMap: "MEAL_SNACK", type: "MealType", value: "Ăn vặt", description: null, createdAt: "2024-01-01T08:00:00Z" },
  { id: 8, keyMap: "SEV_LOW", type: "SeverityType", value: "Nhẹ", description: "Mức độ dị ứng nhẹ", createdAt: "2024-01-01T08:00:00Z" },
  { id: 9, keyMap: "SEV_HIGH", type: "SeverityType", value: "Nặng", description: "Mức độ dị ứng nặng", createdAt: "2024-01-01T08:00:00Z" },
  { id: 10, keyMap: "ACT_MODERATE", type: "ActivityLevel", value: "Trung bình", description: "Hoạt động thể chất mức trung bình", createdAt: "2024-01-01T08:00:00Z" },
  { id: 11, keyMap: "SRC_USDA", type: "SourceType", value: "USDA", description: "Tham khảo từ USDA", createdAt: "2024-01-01T08:00:00Z" },
  { id: 12, keyMap: "STATUS_MET", type: "StatusType", value: "Đạt mục tiêu", description: null, createdAt: "2024-01-01T08:00:00Z" },
];

export default function AllCodesPage() {
  return (
    <div className="flex flex-col gap-6">
      <DataTable
        columns={columns}
        data={mockData}
        searchKey="keyMap"
        searchPlaceholder="Tìm theo key..."
        filterableColumns={[
          {
            id: "type",
            title: "Loại",
            options: [
              { label: "GoalType", value: "GoalType" },
              { label: "MealType", value: "MealType" },
              { label: "SeverityType", value: "SeverityType" },
              { label: "ActivityLevel", value: "ActivityLevel" },
              { label: "SourceType", value: "SourceType" },
              { label: "StatusType", value: "StatusType" },
            ],
          },
        ]}
      />
    </div>
  );
}
