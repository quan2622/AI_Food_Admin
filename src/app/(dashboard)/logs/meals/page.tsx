"use client";

import * as React from "react";
import { type ColumnDef, type PaginationState } from "@tanstack/react-table";
import { DataTable, DataTableColumnHeader } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";
import { toast } from "sonner";
import { logsService } from "@/services/logsService";
import type { IMealAdmin } from "@/types/logs.type";
import { ceilGoalMetric } from "@/lib/utils";

type MealRow = IMealAdmin & { userName: string; itemsCount: number };

const mealTypeMap: Record<string, { label: string; variant: "info" | "success" | "warning" | "danger" }> = {
  MEAL_BREAKFAST: { label: "Sáng", variant: "info" },
  MEAL_LUNCH: { label: "Trưa", variant: "success" },
  MEAL_DINNER: { label: "Tối", variant: "warning" },
  MEAL_SNACK: { label: "Ăn vặt", variant: "danger" },
};

function toRow(m: IMealAdmin): MealRow {
  const u = m.dailyLog?.user;
  const userName =
    u?.fullName?.trim() ||
    u?.email ||
    (u?.id ? `User #${u.id}` : "—");
  return {
    ...m,
    userName,
    itemsCount: m.mealItems?.length ?? 0,
  };
}

const columns: ColumnDef<MealRow>[] = [
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
    accessorKey: "mealType",
    header: "Bữa ăn",
    cell: ({ row }) => {
      const t = row.getValue("mealType") as string;
      const info = mealTypeMap[t] ?? { label: t, variant: "muted" as const };
      return <StatusBadge variant={info.variant}>{info.label}</StatusBadge>;
    },
    filterFn: (row, id, value) => row.getValue(id) === value,
  },
  {
    accessorKey: "mealDateTime",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Thời gian" />,
    cell: ({ row }) => (
      <span className="text-sm">
        {new Date(row.getValue("mealDateTime")).toLocaleString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    ),
  },
  {
    accessorKey: "itemsCount",
    header: "Số món",
  },
  {
    accessorKey: "totalCalories",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Calories" />,
    cell: ({ row }) => {
      const v = row.original.totalCalories;
      return v != null && !Number.isNaN(Number(v)) ? (
        <span className="font-medium">{ceilGoalMetric(v)} kcal</span>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
  {
    accessorKey: "totalProtein",
    header: "Protein",
    cell: ({ row }) => {
      const v = row.original.totalProtein;
      return v != null && !Number.isNaN(Number(v)) ? (
        <span className="text-blue-600">{ceilGoalMetric(v)}g</span>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
  {
    accessorKey: "totalCarbs",
    header: "Carbs",
    cell: ({ row }) => {
      const v = row.original.totalCarbs;
      return v != null && !Number.isNaN(Number(v)) ? (
        <span className="text-amber-600">{ceilGoalMetric(v)}g</span>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
  {
    accessorKey: "totalFat",
    header: "Fat",
    cell: ({ row }) => {
      const v = row.original.totalFat;
      return v != null && !Number.isNaN(Number(v)) ? (
        <span className="text-red-500">{ceilGoalMetric(v)}g</span>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
];

export default function MealsPage() {
  const [data, setData] = React.useState<MealRow[]>([]);
  const [total, setTotal] = React.useState(0);
  const [pages, setPages] = React.useState(1);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const fetchMeals = React.useCallback(async () => {
    try {
      const res = await logsService.getMealsAdminPaginated(
        pagination.pageIndex + 1,
        pagination.pageSize
      );
      if (res.data && res.data.EC === 0) {
        const raw = res.data.result as unknown as IMealAdmin[];
        setData(raw.map(toRow));
        setTotal(res.data.meta.total);
        setPages(res.data.meta.pages);
      } else {
        toast.error(res.data?.EM || "Không thể tải meals");
      }
    } catch (e) {
      console.error(e);
      toast.error("Đã xảy ra lỗi khi kết nối máy chủ");
    }
  }, [pagination.pageIndex, pagination.pageSize]);

  React.useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);

  return (
    <div className="flex flex-col gap-6">
      <DataTable
        columns={columns}
        data={data}
        searchKey="userName"
        searchPlaceholder="Tìm theo tên người dùng..."
        pageCount={pages}
        rowCount={total}
        pagination={pagination}
        setPagination={setPagination}
        filterableColumns={[
          {
            id: "mealType",
            title: "Bữa ăn",
            options: [
              { label: "Sáng", value: "MEAL_BREAKFAST" },
              { label: "Trưa", value: "MEAL_LUNCH" },
              { label: "Tối", value: "MEAL_DINNER" },
              { label: "Ăn vặt", value: "MEAL_SNACK" },
            ],
          },
        ]}
      />
    </div>
  );
}
