"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { DataTable, DataTableColumnHeader } from "@/components/data-table";
import { MoreHorizontal, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FoodImage {
  id: number;
  imageUrl: string;
  fileName: string | null;
  mimeType: string | null;
  fileSize: number | null;
  userName: string;
  mealType: string;
  uploadedAt: string;
}

const columns: ColumnDef<FoodImage>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    cell: ({ row }) => <span className="text-muted-foreground font-mono text-xs">#{row.getValue("id")}</span>,
    enableHiding: false,
  },
  {
    accessorKey: "imageUrl",
    header: "Ảnh",
    cell: ({ row }) => (
      <img src={row.getValue("imageUrl")} alt="" className="h-12 w-12 rounded-lg object-cover border" />
    ),
    enableSorting: false,
  },
  {
    accessorKey: "fileName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tên file" />,
    cell: ({ row }) => {
      const name = row.getValue("fileName") as string | null;
      return name ? <span className="text-sm font-mono">{name}</span> : <span className="text-muted-foreground">—</span>;
    },
  },
  {
    accessorKey: "userName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Người upload" />,
    cell: ({ row }) => <span className="font-medium">{row.getValue("userName")}</span>,
  },
  {
    accessorKey: "mimeType",
    header: "Loại file",
    cell: ({ row }) => <span className="text-muted-foreground text-xs font-mono">{row.getValue("mimeType") ?? "—"}</span>,
  },
  {
    accessorKey: "fileSize",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Kích thước" />,
    cell: ({ row }) => {
      const size = row.getValue("fileSize") as number | null;
      if (!size) return <span className="text-muted-foreground">—</span>;
      return <span className="text-sm">{(size / 1024).toFixed(1)} KB</span>;
    },
  },
  {
    accessorKey: "uploadedAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày upload" />,
    cell: ({ row }) => <span className="text-muted-foreground text-sm">{new Date(row.getValue("uploadedAt")).toLocaleDateString("vi-VN")}</span>,
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

const mockData: FoodImage[] = [
  { id: 1, imageUrl: "/placeholder.jpg", fileName: "pho-bo-001.jpg", mimeType: "image/jpeg", fileSize: 245000, userName: "Nguyễn Văn An", mealType: "MEAL_LUNCH", uploadedAt: "2024-03-10T12:30:00Z" },
  { id: 2, imageUrl: "/placeholder.jpg", fileName: "com-tam-002.jpg", mimeType: "image/jpeg", fileSize: 312000, userName: "Trần Thị Bích", mealType: "MEAL_DINNER", uploadedAt: "2024-03-12T18:00:00Z" },
  { id: 3, imageUrl: "/placeholder.jpg", fileName: "banh-mi-003.png", mimeType: "image/png", fileSize: 180000, userName: "Lê Minh Cường", mealType: "MEAL_BREAKFAST", uploadedAt: "2024-03-15T07:30:00Z" },
  { id: 4, imageUrl: "/placeholder.jpg", fileName: "goi-cuon-004.jpg", mimeType: "image/jpeg", fileSize: 290000, userName: "Phạm Thùy Dung", mealType: "MEAL_SNACK", uploadedAt: "2024-03-20T15:00:00Z" },
];

export default function FoodImagesPage() {
  return (
    <div className="flex flex-col gap-6">
      <DataTable columns={columns} data={mockData} searchKey="fileName" searchPlaceholder="Tìm theo tên file..." />
    </div>
  );
}
