"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { DataTable, DataTableColumnHeader } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";
import { MoreHorizontal, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AIModel {
  id: number;
  version: string;
  accuracy: number;
  loss: number;
  jobsCount: number;
  createdAt: string;
}

const columns: ColumnDef<AIModel>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    cell: ({ row }) => <span className="text-muted-foreground font-mono text-xs">#{row.getValue("id")}</span>,
    enableHiding: false,
  },
  {
    accessorKey: "version",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Phiên bản" />,
    cell: ({ row }) => (
      <span className="inline-flex items-center gap-1.5 font-mono font-medium">
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        {row.getValue("version")}
      </span>
    ),
  },
  {
    accessorKey: "accuracy",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Accuracy" />,
    cell: ({ row }) => {
      const acc = row.getValue("accuracy") as number;
      const pct = (acc * 100).toFixed(2);
      const variant = acc >= 0.95 ? "success" : acc >= 0.85 ? "warning" : "danger";
      return <StatusBadge variant={variant}>{pct}%</StatusBadge>;
    },
  },
  {
    accessorKey: "loss",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Loss" />,
    cell: ({ row }) => {
      const loss = row.getValue("loss") as number;
      return <span className="font-mono text-sm">{loss.toFixed(4)}</span>;
    },
  },
  {
    accessorKey: "jobsCount",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Training Jobs" />,
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
          <DropdownMenuItem><Eye className="mr-2 h-4 w-4" /> Xem chi tiết</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Xóa</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

const mockData: AIModel[] = [
  { id: 1, version: "v1.0.0", accuracy: 0.8765, loss: 0.3421, jobsCount: 3, createdAt: "2024-01-15T08:00:00Z" },
  { id: 2, version: "v1.1.0", accuracy: 0.9120, loss: 0.2150, jobsCount: 5, createdAt: "2024-02-10T10:00:00Z" },
  { id: 3, version: "v1.2.0", accuracy: 0.9345, loss: 0.1680, jobsCount: 4, createdAt: "2024-03-01T12:00:00Z" },
  { id: 4, version: "v2.0.0", accuracy: 0.9612, loss: 0.0980, jobsCount: 8, createdAt: "2024-03-20T14:00:00Z" },
  { id: 5, version: "v2.1.0", accuracy: 0.9788, loss: 0.0654, jobsCount: 6, createdAt: "2024-04-01T16:00:00Z" },
];

export default function AIModelsPage() {
  return (
    <div className="flex flex-col gap-6">
      <DataTable columns={columns} data={mockData} searchKey="version" searchPlaceholder="Tìm theo phiên bản..." />
    </div>
  );
}
