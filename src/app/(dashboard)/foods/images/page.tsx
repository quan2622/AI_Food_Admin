"use client";

import * as React from "react";
import { type ColumnDef, type PaginationState } from "@tanstack/react-table";
import { DataTable, DataTableColumnHeader } from "@/components/data-table";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { foodService } from "@/services/foodService";
import { toast } from "sonner";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

export default function FoodImagesPage() {
  const [data, setData] = React.useState<any[]>([]);
  const [, setLoading] = React.useState(true);
  const [total, setTotal] = React.useState(0);
  const [pages, setPages] = React.useState(1);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const fetchImages = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await foodService.getFoodImagesPaginated(
        pagination.pageIndex + 1,
        pagination.pageSize
      );
      if (res.metadata?.EC === 0 && res.data) {
        setData(res.data.result);
        setTotal(res.data.meta.total);
        setPages(res.data.meta.pages);
      } else {
        toast.error(res.metadata?.message || "Không thể tải danh sách ảnh");
      }
    } catch (error) {
      console.error("Fetch images error:", error);
      toast.error("Đã xảy ra lỗi khi kết nối máy chủ");
    } finally {
      setLoading(false);
    }
  }, [pagination.pageIndex, pagination.pageSize]);

  React.useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleAction = React.useCallback(
    async (action: "delete", payload: any) => {
      if (action === "delete") {
        if (
          window.confirm(`Bạn có chắc chắn muốn xóa ảnh này (ID: ${payload.id})?`)
        ) {
          try {
            const res = await foodService.deleteFoodImage(payload.id);
            if (res.metadata?.EC === 0) {
              toast.success("Xóa ảnh thành công");
              fetchImages();
            } else {
              toast.error(res.metadata?.message || "Xóa thất bại");
            }
          } catch (e: any) {
            toast.error(e?.message || "Lỗi khi xóa ảnh.");
          }
        }
      }
    },
    [fetchImages]
  );

  const columns: ColumnDef<any>[] = React.useMemo(
    () => [
      {
        accessorKey: "id",
        header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
        cell: ({ row }) => (
          <span className="text-muted-foreground font-mono text-xs">
            #{row.getValue("id")}
          </span>
        ),
        enableHiding: false,
      },
      {
        accessorKey: "imageUrl",
        header: "Ảnh",
        cell: ({ row }) => (
          <Zoom>
            <img
              src={row.getValue("imageUrl")}
              alt="Food"
              className="h-12 w-12 rounded-lg object-cover border cursor-zoom-in"
            />
          </Zoom>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "fileName",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tên file" />,
        cell: ({ row }) => {
          const name = row.getValue("fileName") as string | null;
          return name ? (
            <span className="text-sm font-mono truncate max-w-[150px] inline-block">{name}</span>
          ) : (
            <span className="text-muted-foreground">—</span>
          );
        },
      },
      {
        id: "userName",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Người upload" />,
        cell: ({ row }) => {
          const user = row.original.user;
          return (
            <span className="font-medium truncate max-w-[150px] inline-block">
              {user?.fullName || user?.email || "—"}
            </span>
          );
        },
      },
      {
        id: "mealInfo",
        header: "Bữa ăn",
        cell: ({ row }) => {
          const typeInfo = row.original.mealTypeInfo;
          return typeInfo ? (
            <span className="inline-flex items-center rounded-full border border-blue-200 px-2.5 py-0.5 text-xs font-semibold bg-blue-50/50 text-blue-700">
              {typeInfo.value}
            </span>
          ) : (
            <span className="text-muted-foreground">—</span>
          );
        },
      },
      {
        accessorKey: "mimeType",
        header: "Loại file",
        cell: ({ row }) => (
          <span className="text-muted-foreground text-xs font-mono">
            {row.getValue("mimeType") ?? "—"}
          </span>
        ),
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
        cell: ({ row }) => (
          <span className="text-muted-foreground text-sm">
            {new Date(row.getValue("uploadedAt")).toLocaleDateString("vi-VN")}
          </span>
        ),
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="text-destructive font-medium focus:bg-destructive focus:text-destructive-foreground"
                onClick={() => handleAction("delete", row.original)}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [handleAction]
  );

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <DataTable
        columns={columns}
        data={data}
        searchKey="fileName"
        searchPlaceholder="Tìm theo tên file (API chưa hỗ trợ filter mặc định, đây là UI tạm)..."
        pageCount={pages}
        rowCount={total}
        pagination={pagination}
        setPagination={setPagination}
        defaultColumnVisibility={{ mimeType: false, fileName: false }}
      />
    </div>
  );
}
