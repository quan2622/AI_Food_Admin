"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { DataTable, DataTableColumnHeader } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";
import { MoreHorizontal, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface WorkoutLog {
  id: number;
  userName: string;
  workoutType: string;
  durationMinute: number | null;
  burnedCalories: number;
  startedAt: string;
  endedAt: string | null;
  source: string | null;
}

const columns: ColumnDef<WorkoutLog>[] = [
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
    accessorKey: "workoutType",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Loại bài tập" />,
    cell: ({ row }) => (
      <StatusBadge variant="info">{row.getValue("workoutType")}</StatusBadge>
    ),
  },
  {
    accessorKey: "durationMinute",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Thời gian" />,
    cell: ({ row }) => {
      const mins = row.getValue("durationMinute") as number | null;
      if (!mins) return <span className="text-muted-foreground">—</span>;
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      return <span>{h > 0 ? `${h}h ` : ""}{m}m</span>;
    },
  },
  {
    accessorKey: "burnedCalories",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Calories đốt" />,
    cell: ({ row }) => {
      const cal = row.getValue("burnedCalories") as number;
      return (
        <span className="font-medium text-orange-500">-{cal} kcal</span>
      );
    },
  },
  {
    accessorKey: "startedAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Bắt đầu" />,
    cell: ({ row }) => <span className="text-sm">{new Date(row.getValue("startedAt")).toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}</span>,
  },
  {
    accessorKey: "source",
    header: "Nguồn",
    cell: ({ row }) => {
      const s = row.getValue("source") as string | null;
      return s ? <StatusBadge variant="muted">{s}</StatusBadge> : <span className="text-muted-foreground">—</span>;
    },
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

const mockData: WorkoutLog[] = [
  { id: 1, userName: "Nguyễn Văn An", workoutType: "Chạy bộ", durationMinute: 45, burnedCalories: 450, startedAt: "2024-04-01T06:00:00Z", endedAt: "2024-04-01T06:45:00Z", source: "Apple Watch" },
  { id: 2, userName: "Lê Minh Cường", workoutType: "Gym", durationMinute: 90, burnedCalories: 600, startedAt: "2024-04-01T17:00:00Z", endedAt: "2024-04-01T18:30:00Z", source: "Garmin" },
  { id: 3, userName: "Trần Thị Bích", workoutType: "Yoga", durationMinute: 60, burnedCalories: 200, startedAt: "2024-04-02T07:00:00Z", endedAt: "2024-04-02T08:00:00Z", source: null },
  { id: 4, userName: "Hoàng Đức Em", workoutType: "Bơi lội", durationMinute: 40, burnedCalories: 380, startedAt: "2024-04-02T16:00:00Z", endedAt: "2024-04-02T16:40:00Z", source: "Fitbit" },
  { id: 5, userName: "Nguyễn Văn An", workoutType: "Đạp xe", durationMinute: 120, burnedCalories: 700, startedAt: "2024-04-03T05:30:00Z", endedAt: "2024-04-03T07:30:00Z", source: "Strava" },
  { id: 6, userName: "Phạm Thùy Dung", workoutType: "HIIT", durationMinute: 30, burnedCalories: 350, startedAt: "2024-04-03T18:00:00Z", endedAt: "2024-04-03T18:30:00Z", source: null },
];

export default function WorkoutLogsPage() {
  return (
    <div className="flex flex-col gap-6">
      <DataTable columns={columns} data={mockData} searchKey="userName" searchPlaceholder="Tìm theo tên người dùng..." />
    </div>
  );
}
