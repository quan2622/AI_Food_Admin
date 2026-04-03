"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { DataTable, DataTableColumnHeader } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";
import { MoreHorizontal, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TrainingJob {
  id: number;
  modelVersion: string;
  status: string;
  startedAt: string;
  finishedAt: string | null;
  duration: string | null;
  createdAt: string;
}

const statusMap: Record<string, { label: string; variant: "info" | "success" | "warning" | "danger" }> = {
  PENDING: { label: "Chờ xử lý", variant: "warning" },
  RUNNING: { label: "Đang chạy", variant: "info" },
  COMPLETED: { label: "Hoàn thành", variant: "success" },
  FAILED: { label: "Thất bại", variant: "danger" },
};

const columns: ColumnDef<TrainingJob>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    cell: ({ row }) => <span className="text-muted-foreground font-mono text-xs">#{row.getValue("id")}</span>,
    enableHiding: false,
  },
  {
    accessorKey: "modelVersion",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Model" />,
    cell: ({ row }) => <span className="font-mono font-medium">{row.getValue("modelVersion")}</span>,
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const s = row.getValue("status") as string;
      const info = statusMap[s] ?? { label: s, variant: "muted" as const };
      return (
        <div className="flex items-center gap-2">
          {s === "RUNNING" && <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" /></span>}
          <StatusBadge variant={info.variant}>{info.label}</StatusBadge>
        </div>
      );
    },
    filterFn: (row, id, value) => row.getValue(id) === value,
  },
  {
    accessorKey: "startedAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Bắt đầu" />,
    cell: ({ row }) => <span className="text-sm">{new Date(row.getValue("startedAt")).toLocaleString("vi-VN")}</span>,
  },
  {
    accessorKey: "finishedAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Kết thúc" />,
    cell: ({ row }) => {
      const f = row.getValue("finishedAt") as string | null;
      return f ? <span className="text-sm">{new Date(f).toLocaleString("vi-VN")}</span> : <span className="text-muted-foreground">—</span>;
    },
  },
  {
    accessorKey: "duration",
    header: "Thời gian",
    cell: ({ row }) => {
      const d = row.getValue("duration") as string | null;
      return d ? <span className="font-mono text-sm">{d}</span> : <span className="text-muted-foreground">—</span>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon-sm"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem><Eye className="mr-2 h-4 w-4" /> Xem logs</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Xóa</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

const mockData: TrainingJob[] = [
  { id: 1, modelVersion: "v2.1.0", status: "RUNNING", startedAt: "2024-04-03T10:00:00Z", finishedAt: null, duration: null, createdAt: "2024-04-03T10:00:00Z" },
  { id: 2, modelVersion: "v2.0.0", status: "COMPLETED", startedAt: "2024-03-20T08:00:00Z", finishedAt: "2024-03-20T14:30:00Z", duration: "6h 30m", createdAt: "2024-03-20T08:00:00Z" },
  { id: 3, modelVersion: "v2.0.0", status: "FAILED", startedAt: "2024-03-18T09:00:00Z", finishedAt: "2024-03-18T09:15:00Z", duration: "15m", createdAt: "2024-03-18T09:00:00Z" },
  { id: 4, modelVersion: "v1.2.0", status: "COMPLETED", startedAt: "2024-03-01T06:00:00Z", finishedAt: "2024-03-01T10:00:00Z", duration: "4h 00m", createdAt: "2024-03-01T06:00:00Z" },
  { id: 5, modelVersion: "v1.1.0", status: "COMPLETED", startedAt: "2024-02-10T07:00:00Z", finishedAt: "2024-02-10T12:45:00Z", duration: "5h 45m", createdAt: "2024-02-10T07:00:00Z" },
  { id: 6, modelVersion: "v2.1.0", status: "PENDING", startedAt: "2024-04-04T08:00:00Z", finishedAt: null, duration: null, createdAt: "2024-04-03T16:00:00Z" },
];

export default function TrainingJobsPage() {
  return (
    <div className="flex flex-col gap-6">
      <DataTable
        columns={columns}
        data={mockData}
        searchKey="modelVersion"
        searchPlaceholder="Tìm theo model..."
        filterableColumns={[
          {
            id: "status",
            title: "Trạng thái",
            options: [
              { label: "Chờ xử lý", value: "PENDING" },
              { label: "Đang chạy", value: "RUNNING" },
              { label: "Hoàn thành", value: "COMPLETED" },
              { label: "Thất bại", value: "FAILED" },
            ],
          },
        ]}
      />
    </div>
  );
}
