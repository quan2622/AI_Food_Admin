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
import { nutritionService } from "@/services/nutritionService";
import type { INutritionGoal } from "@/types/nutrition.type";
import { NutritionGoalDetailDialog } from "@/components/nutrition/nutrition-goal-detail-dialog";
import { ceilGoalMetric } from "@/lib/utils";

type NutritionGoalRow = INutritionGoal & { userName: string };

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

function toRow(g: INutritionGoal): NutritionGoalRow {
  const userName =
    g.user?.fullName?.trim() ||
    g.user?.email ||
    (g.userId ? `User #${g.userId}` : "—");
  return { ...g, userName };
}

const columns: ColumnDef<NutritionGoalRow>[] = [
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
    cell: ({ row }) => (
      <span>{ceilGoalMetric(row.getValue("targetCalories"))} kcal</span>
    ),
  },
  {
    accessorKey: "targetProtein",
    header: "Protein",
    cell: ({ row }) => (
      <span className="text-blue-600">{ceilGoalMetric(row.getValue("targetProtein"))}g</span>
    ),
  },
  {
    accessorKey: "targetCarbs",
    header: "Carbs",
    cell: ({ row }) => (
      <span className="text-amber-600">{ceilGoalMetric(row.getValue("targetCarbs"))}g</span>
    ),
  },
  {
    accessorKey: "targetFat",
    header: "Fat",
    cell: ({ row }) => (
      <span className="text-red-500">{ceilGoalMetric(row.getValue("targetFat"))}g</span>
    ),
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Bắt đầu" />,
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {new Date(row.getValue("startDate")).toLocaleDateString("vi-VN")}
      </span>
    ),
  },
  {
    accessorKey: "endDate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Kết thúc" />,
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {new Date(row.getValue("endDate")).toLocaleDateString("vi-VN")}
      </span>
    ),
  },
  {
    id: "actions",
    header: "",
    enableHiding: false,
    cell: ({ row, table }) => {
      const meta = table.options.meta as { onView?: (g: NutritionGoalRow) => void };
      return (
        <DataTableDetailButton
          aria-label="Xem chi tiết mục tiêu dinh dưỡng"
          onClick={() => meta?.onView?.(row.original)}
        />
      );
    },
  },
];

export default function NutritionGoalsPage() {
  const [data, setData] = React.useState<NutritionGoalRow[]>([]);
  const [total, setTotal] = React.useState(0);
  const [pages, setPages] = React.useState(1);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [selectedGoal, setSelectedGoal] = React.useState<NutritionGoalRow | null>(null);
  const [detailOpen, setDetailOpen] = React.useState(false);

  const fetchGoals = React.useCallback(async () => {
    try {
      const res = await nutritionService.getNutritionGoalsAdminPaginated(
        pagination.pageIndex + 1,
        pagination.pageSize
      );
      if (res.data && res.data.EC === 0) {
        const raw = res.data.result as unknown as INutritionGoal[];
        setData(raw.map(toRow));
        setTotal(res.data.meta.total);
        setPages(res.data.meta.pages);
      } else {
        toast.error(res.data?.EM || "Không thể tải danh sách mục tiêu");
      }
    } catch (e) {
      console.error(e);
      toast.error("Đã xảy ra lỗi khi kết nối máy chủ");
    }
  }, [pagination.pageIndex, pagination.pageSize]);

  React.useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const handleView = React.useCallback((row: NutritionGoalRow) => {
    setSelectedGoal(row);
    setDetailOpen(true);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <DataTable
        meta={{ onView: handleView }}
        columns={columns}
        data={data}
        searchKey="userName"
        searchPlaceholder="Tìm theo người dùng..."
        pageCount={pages}
        rowCount={total}
        pagination={pagination}
        setPagination={setPagination}
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

      <NutritionGoalDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        goal={selectedGoal}
      />
    </div>
  );
}
