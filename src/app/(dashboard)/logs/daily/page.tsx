"use client";

import * as React from "react";
import { type ColumnDef, type PaginationState } from "@tanstack/react-table";
import {
  DataTable,
  DataTableColumnHeader,
  DataTableDetailButton,
} from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";
import { toast } from "sonner";
import { logsService } from "@/services/logsService";
import type { IDailyLogAdmin } from "@/types/logs.type";
import { DailyLogMealsDialog } from "@/components/logs/daily-log-meals-dialog";
import { ceilGoalMetric } from "@/lib/utils";

type DailyLogRow = IDailyLogAdmin & { userName: string; mealsCount: number };

function mealCountFromRow(d: IDailyLogAdmin): number {
  if (d.meals?.length) return d.meals.length;
  if (d.mealGroups?.length) {
    return d.mealGroups.reduce((acc, g) => acc + (g.meals?.length ?? 0), 0);
  }
  return 0;
}

const statusMap: Record<string, { label: string; variant: "success" | "warning" | "danger" | "info" }> = {
  STATUS_BELOW: { label: "Dưới mục tiêu", variant: "warning" },
  STATUS_MET: { label: "Đạt mục tiêu", variant: "success" },
  STATUS_ABOVE: { label: "Vượt mục tiêu", variant: "danger" },
};

function toRow(d: IDailyLogAdmin): DailyLogRow {
  const userName =
    d.user?.fullName?.trim() ||
    d.user?.email ||
    (d.userId ? `User #${d.userId}` : "—");
  return {
    ...d,
    userName,
    mealsCount: mealCountFromRow(d),
  };
}

const columns: ColumnDef<DailyLogRow>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    cell: ({ row }) => (
      <span className="text-muted-foreground font-mono text-xs">#{row.getValue("id")}</span>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "userName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Người dùng" />,
    cell: ({ row }) => <span className="font-medium">{row.getValue("userName")}</span>,
  },
  {
    accessorKey: "logDate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày" />,
    cell: ({ row }) => (
      <span className="font-medium">
        {new Date(row.getValue("logDate")).toLocaleDateString("vi-VN", {
          weekday: "short",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}
      </span>
    ),
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
    accessorKey: "mealsCount",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Số bữa ăn" />,
  },
  {
    id: "dayTotalCalories",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tổng kcal (ngày)" />
    ),
    accessorFn: (row) => row.dayTotalCalories ?? row.totalCalories,
    cell: ({ row }) => {
      const v = row.original.dayTotalCalories ?? row.original.totalCalories;
      return v != null && !Number.isNaN(Number(v)) ? (
        <span className="font-medium">{ceilGoalMetric(v)} kcal</span>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
  {
    id: "mealGroupsKcal",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kcal theo buổi" />
    ),
    cell: ({ row }) => {
      const groups = row.original.mealGroups;
      if (!groups?.length) {
        return <span className="text-muted-foreground text-sm">—</span>;
      }
      return (
        <div className="flex flex-wrap gap-1.5 gap-y-1 text-xs max-w-[min(100%,400px)] leading-snug">
          {groups.map((g, i) => {
            const label =
              g.mealTypeInfo?.value ||
              g.mealTypeInfo?.description ||
              g.mealType;
            const kcal =
              g.totalCalories != null && !Number.isNaN(Number(g.totalCalories))
                ? ceilGoalMetric(g.totalCalories)
                : null;
            return (
              <span
                key={`${g.mealType}-${i}`}
                className="inline-flex items-baseline gap-1 rounded-md border border-border/80 bg-muted/40 px-2 py-1"
              >
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium tabular-nums text-foreground">
                  {kcal != null ? `${kcal} kcal` : "—"}
                </span>
              </span>
            );
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày tạo" />,
    cell: ({ row }) => {
      const v = row.getValue("createdAt") as string | undefined;
      return (
        <span className="text-muted-foreground text-sm">
          {v ? new Date(v).toLocaleDateString("vi-VN") : "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Cập nhật" />,
    cell: ({ row }) => {
      const v = row.getValue("updatedAt") as string | undefined;
      return (
        <span className="text-muted-foreground text-sm">
          {v ? new Date(v).toLocaleDateString("vi-VN") : "—"}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "",
    enableHiding: false,
    cell: ({ row, table }) => {
      const meta = table.options.meta as { onViewMeals?: (row: DailyLogRow) => void };
      return (
        <DataTableDetailButton
          aria-label="Xem chi tiết bữa ăn trong daily log"
          onClick={() => meta?.onViewMeals?.(row.original)}
        />
      );
    },
  },
];

export default function DailyLogsPage() {
  const [data, setData] = React.useState<DailyLogRow[]>([]);
  const [total, setTotal] = React.useState(0);
  const [pages, setPages] = React.useState(1);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [mealsDialogOpen, setMealsDialogOpen] = React.useState(false);
  const [selectedDailyLog, setSelectedDailyLog] = React.useState<DailyLogRow | null>(null);

  const handleViewMeals = React.useCallback((row: DailyLogRow) => {
    setSelectedDailyLog(row);
    setMealsDialogOpen(true);
  }, []);

  const fetchLogs = React.useCallback(async () => {
    try {
      const res = await logsService.getDailyLogsAdminPaginated(
        pagination.pageIndex + 1,
        pagination.pageSize
      );
      if (res.data && res.data.EC === 0) {
        const raw = res.data.result as unknown as IDailyLogAdmin[];
        setData(raw.map(toRow));
        setTotal(res.data.meta.total);
        setPages(res.data.meta.pages);
      } else {
        toast.error(res.data?.EM || "Không thể tải daily logs");
      }
    } catch (e) {
      console.error(e);
      toast.error("Đã xảy ra lỗi khi kết nối máy chủ");
    }
  }, [pagination.pageIndex, pagination.pageSize]);

  React.useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return (
    <div className="flex flex-col gap-6">
      <DataTable
        meta={{ onViewMeals: handleViewMeals }}
        columns={columns}
        data={data}
        searchKey="userName"
        searchPlaceholder="Tìm theo tên người dùng..."
        pageCount={pages}
        rowCount={total}
        pagination={pagination}
        setPagination={setPagination}
        defaultColumnVisibility={{ createdAt: false, updatedAt: false }}
        filterableColumns={[
          {
            id: "status",
            title: "Trạng thái",
            options: [
              { label: "Dưới mục tiêu", value: "STATUS_BELOW" },
              { label: "Đạt mục tiêu", value: "STATUS_MET" },
              { label: "Vượt mục tiêu", value: "STATUS_ABOVE" },
            ],
          },
        ]}
      />

      <DailyLogMealsDialog
        open={mealsDialogOpen}
        onOpenChange={(open) => {
          setMealsDialogOpen(open);
          if (!open) setSelectedDailyLog(null);
        }}
        dailyLog={
          selectedDailyLog
            ? {
                id: selectedDailyLog.id,
                userName: selectedDailyLog.userName,
                logDate: selectedDailyLog.logDate,
                userId: selectedDailyLog.userId,
              }
            : null
        }
      />
    </div>
  );
}
