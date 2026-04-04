"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { DataTable, DataTableColumnHeader } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";
import { MoreHorizontal, Pencil, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserProfile {
  id: number;
  userId: number;
  userName: string;
  age: number;
  height: number;
  weight: number;
  bmi: number;
  bmr: number;
  tdee: number;
  gender: string | null;
  activityLevel: string | null;
}

const activityLevelMap: Record<string, string> = {
  ACT_SEDENTARY: "Ít vận động",
  ACT_LIGHT: "Nhẹ nhàng",
  ACT_MODERATE: "Trung bình",
  ACT_VERY: "Năng động",
  ACT_SUPER: "Rất năng động",
};

const columns: ColumnDef<UserProfile>[] = [
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
    accessorKey: "age",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tuổi" />,
  },
  {
    accessorKey: "gender",
    header: "Giới tính",
    cell: ({ row }) => {
      const g = row.getValue("gender") as string | null;
      return g ? (
        <StatusBadge variant={g === "male" ? "info" : "warning"}>
          {g === "male" ? "Nam" : "Nữ"}
        </StatusBadge>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
  {
    accessorKey: "height",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Chiều cao" />,
    cell: ({ row }) => <span>{row.getValue("height")} cm</span>,
  },
  {
    accessorKey: "weight",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Cân nặng" />,
    cell: ({ row }) => <span>{row.getValue("weight")} kg</span>,
  },
  {
    accessorKey: "bmi",
    header: ({ column }) => <DataTableColumnHeader column={column} title="BMI" />,
    cell: ({ row }) => {
      const bmi = row.getValue("bmi") as number;
      const variant = bmi < 18.5 ? "warning" : bmi < 25 ? "success" : bmi < 30 ? "warning" : "danger";
      return <StatusBadge variant={variant}>{bmi.toFixed(1)}</StatusBadge>;
    },
  },
  {
    accessorKey: "bmr",
    header: ({ column }) => <DataTableColumnHeader column={column} title="BMR" />,
    cell: ({ row }) => <span>{(row.getValue("bmr") as number).toFixed(0)} kcal</span>,
  },
  {
    accessorKey: "tdee",
    header: ({ column }) => <DataTableColumnHeader column={column} title="TDEE" />,
    cell: ({ row }) => <span>{(row.getValue("tdee") as number).toFixed(0)} kcal</span>,
  },
  {
    accessorKey: "activityLevel",
    header: "Mức vận động",
    cell: ({ row }) => {
      const level = row.getValue("activityLevel") as string | null;
      return level ? <StatusBadge variant="info">{activityLevelMap[level] ?? level}</StatusBadge> : <span className="text-muted-foreground">—</span>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm"><MoreHorizontal className="h-4 w-4" /></Button>
        </DropdownMenuTrigger>
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

const mockData: UserProfile[] = [
  { id: 1, userId: 1, userName: "Nguyễn Văn An", age: 34, height: 170, weight: 68, bmi: 23.5, bmr: 1650, tdee: 2310, gender: "male", activityLevel: "ACT_MODERATE" },
  { id: 2, userId: 2, userName: "Trần Thị Bích", age: 29, height: 158, weight: 52, bmi: 20.8, bmr: 1320, tdee: 1716, gender: "female", activityLevel: "ACT_LIGHT" },
  { id: 3, userId: 3, userName: "Lê Minh Cường", age: 36, height: 175, weight: 82, bmi: 26.8, bmr: 1800, tdee: 2790, gender: "male", activityLevel: "ACT_VERY" },
  { id: 4, userId: 4, userName: "Phạm Thùy Dung", age: 31, height: 162, weight: 55, bmi: 20.9, bmr: 1380, tdee: 1932, gender: "female", activityLevel: "ACT_MODERATE" },
  { id: 5, userId: 5, userName: "Hoàng Đức Em", age: 24, height: 180, weight: 75, bmi: 23.1, bmr: 1780, tdee: 2492, gender: "male", activityLevel: "ACT_MODERATE" },
];

export default function UserProfilesPage() {
  return (
    <div className="flex flex-col gap-6">
      <DataTable
        columns={columns}
        data={mockData}
        searchKey="userName"
        searchPlaceholder="Tìm theo tên..."
      />
    </div>
  );
}
