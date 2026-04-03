"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { DataTable, DataTableColumnHeader } from "@/components/data-table";
import { MoreHorizontal, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Recommendation {
  id: number;
  userName: string;
  foodName: string;
  score: number;
  mealType: string;
  reason: string;
  createdAt: string;
}

const mealTypeLabels: Record<string, string> = {
  MEAL_BREAKFAST: "Sáng",
  MEAL_LUNCH: "Trưa",
  MEAL_DINNER: "Tối",
  MEAL_SNACK: "Ăn vặt",
};

const columns: ColumnDef<Recommendation>[] = [
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
    accessorKey: "foodName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Món gợi ý" />,
    cell: ({ row }) => <span className="font-medium">{row.getValue("foodName")}</span>,
  },
  {
    accessorKey: "mealType",
    header: "Bữa ăn",
    cell: ({ row }) => {
      const t = row.getValue("mealType") as string;
      return <span className="text-sm">{mealTypeLabels[t] ?? t}</span>;
    },
  },
  {
    accessorKey: "score",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Điểm" />,
    cell: ({ row }) => {
      const score = row.getValue("score") as number;
      const width = `${(score * 100).toFixed(0)}%`;
      return (
        <div className="flex items-center gap-2">
          <div className="h-2 w-16 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{ width }}
            />
          </div>
          <span className="text-xs font-mono">{(score * 100).toFixed(0)}%</span>
        </div>
      );
    },
  },
  {
    accessorKey: "reason",
    header: "Lý do",
    cell: ({ row }) => <span className="text-sm max-w-[250px] truncate block text-muted-foreground">{row.getValue("reason")}</span>,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày" />,
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
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Xóa</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

const mockData: Recommendation[] = [
  { id: 1, userName: "Nguyễn Văn An", foodName: "Gỏi cuốn tôm", mealType: "MEAL_LUNCH", score: 0.95, reason: "Phù hợp mục tiêu giảm cân, giàu protein", createdAt: "2024-04-01T12:00:00Z" },
  { id: 2, userName: "Nguyễn Văn An", foodName: "Salad gà", mealType: "MEAL_DINNER", score: 0.88, reason: "Ít calo, nhiều vitamin", createdAt: "2024-04-01T18:00:00Z" },
  { id: 3, userName: "Trần Thị Bích", foodName: "Cháo yến mạch", mealType: "MEAL_BREAKFAST", score: 0.92, reason: "Giàu fiber, phù hợp duy trì cân nặng", createdAt: "2024-04-02T07:00:00Z" },
  { id: 4, userName: "Lê Minh Cường", foodName: "Cơm gà nướng", mealType: "MEAL_LUNCH", score: 0.78, reason: "Giàu protein, hỗ trợ tăng cơ", createdAt: "2024-04-02T12:00:00Z" },
  { id: 5, userName: "Phạm Thùy Dung", foodName: "Bún chả cá", mealType: "MEAL_DINNER", score: 0.84, reason: "Ít béo, nhiều omega-3", createdAt: "2024-04-02T18:00:00Z" },
  { id: 6, userName: "Hoàng Đức Em", foodName: "Sữa chua Hy Lạp", mealType: "MEAL_SNACK", score: 0.91, reason: "Giàu protein, ít đường", createdAt: "2024-04-03T15:00:00Z" },
];

export default function RecommendationsPage() {
  return (
    <div className="flex flex-col gap-6">
      <DataTable columns={columns} data={mockData} searchKey="userName" searchPlaceholder="Tìm theo tên người dùng..." />
    </div>
  );
}
