"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { DataTable, DataTableColumnHeader } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";
import { MoreHorizontal, Pencil, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NutritionGoal {
  id: number;
  userName: string;
  goalType: string;
  status: string;
  targetWeight: number | null;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  targetFiber: number;
  startDate: string;
  endDate: string;
}

const goalTypeMap: Record<string, { label: string; variant: "info" | "success" | "warning" | "danger" }> = {
  GOAL_LOSS: { label: "Giảm cân", variant: "danger" },
  GOAL_GAIN: { label: "Tăng cân", variant: "success" },
  GOAL_MAINTAIN: { label: "Duy trì", variant: "info" },
  GOAL_STRICT: { label: "Nghiêm ngặt", variant: "warning" },
};

const statusMap: Record<string, { label: string; variant: "info" | "success" | "warning" | "danger" }> = {
  NUTR_GOAL_ONGOING: { label: "Đang thực hiện", variant: "info" },
  NUTR_GOAL_COMPLETED: { label: "Hoàn thành", variant: "success" },
  NUTR_GOAL_PAUSED: { label: "Tạm dừng", variant: "warning" },
  NUTR_GOAL_FAILED: { label: "Thất bại", variant: "danger" },
};

const columns: ColumnDef<NutritionGoal>[] = [
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
    accessorKey: "goalType",
    header: "Mục tiêu",
    cell: ({ row }) => {
      const g = row.getValue("goalType") as string;
      const info = goalTypeMap[g] ?? { label: g, variant: "muted" as const };
      return <StatusBadge variant={info.variant}>{info.label}</StatusBadge>;
    },
    filterFn: (row, id, value) => row.getValue(id) === value,
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
    accessorKey: "targetCalories",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Calories" />,
    cell: ({ row }) => <span>{row.getValue("targetCalories")} kcal</span>,
  },
  {
    accessorKey: "targetProtein",
    header: "Protein",
    cell: ({ row }) => <span className="text-blue-600">{row.getValue("targetProtein")}g</span>,
  },
  {
    accessorKey: "targetCarbs",
    header: "Carbs",
    cell: ({ row }) => <span className="text-amber-600">{row.getValue("targetCarbs")}g</span>,
  },
  {
    accessorKey: "targetFat",
    header: "Fat",
    cell: ({ row }) => <span className="text-red-500">{row.getValue("targetFat")}g</span>,
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Bắt đầu" />,
    cell: ({ row }) => <span className="text-muted-foreground text-sm">{new Date(row.getValue("startDate")).toLocaleDateString("vi-VN")}</span>,
  },
  {
    accessorKey: "endDate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Kết thúc" />,
    cell: ({ row }) => <span className="text-muted-foreground text-sm">{new Date(row.getValue("endDate")).toLocaleDateString("vi-VN")}</span>,
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

const mockData: NutritionGoal[] = [
  { id: 1, userName: "Nguyễn Văn An", goalType: "GOAL_LOSS", status: "NUTR_GOAL_ONGOING", targetWeight: 65, targetCalories: 1800, targetProtein: 120, targetCarbs: 200, targetFat: 50, targetFiber: 25, startDate: "2024-03-01", endDate: "2024-06-01" },
  { id: 2, userName: "Trần Thị Bích", goalType: "GOAL_MAINTAIN", status: "NUTR_GOAL_ONGOING", targetWeight: null, targetCalories: 1600, targetProtein: 80, targetCarbs: 180, targetFat: 55, targetFiber: 20, startDate: "2024-02-15", endDate: "2024-08-15" },
  { id: 3, userName: "Lê Minh Cường", goalType: "GOAL_GAIN", status: "NUTR_GOAL_COMPLETED", targetWeight: 85, targetCalories: 2800, targetProtein: 160, targetCarbs: 320, targetFat: 80, targetFiber: 30, startDate: "2024-01-01", endDate: "2024-04-01" },
  { id: 4, userName: "Phạm Thùy Dung", goalType: "GOAL_STRICT", status: "NUTR_GOAL_PAUSED", targetWeight: 50, targetCalories: 1400, targetProtein: 90, targetCarbs: 140, targetFat: 40, targetFiber: 22, startDate: "2024-03-10", endDate: "2024-09-10" },
  { id: 5, userName: "Hoàng Đức Em", goalType: "GOAL_LOSS", status: "NUTR_GOAL_FAILED", targetWeight: 70, targetCalories: 2000, targetProtein: 110, targetCarbs: 220, targetFat: 60, targetFiber: 28, startDate: "2024-01-15", endDate: "2024-04-15" },
];

export default function NutritionGoalsPage() {
  return (
    <div className="flex flex-col gap-6">
      <DataTable
        columns={columns}
        data={mockData}
        searchKey="userName"
        searchPlaceholder="Tìm theo người dùng..."
        filterableColumns={[
          {
            id: "goalType",
            title: "Loại mục tiêu",
            options: [
              { label: "Giảm cân", value: "GOAL_LOSS" },
              { label: "Tăng cân", value: "GOAL_GAIN" },
              { label: "Duy trì", value: "GOAL_MAINTAIN" },
              { label: "Nghiêm ngặt", value: "GOAL_STRICT" },
            ],
          },
          {
            id: "status",
            title: "Trạng thái",
            options: [
              { label: "Đang thực hiện", value: "NUTR_GOAL_ONGOING" },
              { label: "Hoàn thành", value: "NUTR_GOAL_COMPLETED" },
              { label: "Tạm dừng", value: "NUTR_GOAL_PAUSED" },
              { label: "Thất bại", value: "NUTR_GOAL_FAILED" },
            ],
          },
        ]}
      />
    </div>
  );
}
