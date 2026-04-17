"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable, DataTableColumnHeader } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/status-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SubmissionDetailDialog } from "@/components/submissions/submission-detail-dialog";
import { submissionService } from "@/services/submissionService";
import type {
  IUserSubmission,
  ISubmissionStats,
  SubmissionStatus,
  SubmissionType,
} from "@/types/submission.type";
import { toast } from "sonner";
import {
  MoreHorizontal,
  Eye,
  CheckCircle2,
  XCircle,
  InboxIcon,
  Clock,
  TrendingUp,
  FileText,
  ThumbsUp,
  ThumbsDown,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Label Maps ──────────────────────────────────────────────────── */
const TYPE_LABELS: Record<string, string> = {
  REPORT: "Báo cáo",
  CONTRIBUTION: "Đóng góp",
};
const CAT_LABELS: Record<string, string> = {
  WRONG_INFO: "Thông tin sai",
  BAD_IMAGE: "Ảnh kém",
  NEW_FOOD: "Món mới",
  DUPLICATE: "Trùng lặp",
};

/* ─── Stat Card ───────────────────────────────────────────────────── */
function StatCard({
  label,
  value,
  icon: Icon,
  colorClass,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  colorClass: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-card p-4 shadow-sm">
      <div className={cn("rounded-lg p-2", colorClass)}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-xl font-bold leading-none">{value}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

/* ─── Column definitions ──────────────────────────────────────────── */
const columns: ColumnDef<IUserSubmission>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    cell: ({ row }) => (
      <span className="font-mono text-xs text-muted-foreground">
        #{row.getValue("id")}
      </span>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "user",
    header: "Người gửi",
    cell: ({ row }) => {
      const user = row.original.user;
      if (!user) return <span className="text-muted-foreground text-xs">—</span>;
      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7">
            <AvatarImage src={user.avatarUrl} />
            <AvatarFallback className="text-xs">
              {user.fullName?.charAt(0).toUpperCase() ?? "?"}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-sm font-medium leading-none truncate max-w-[120px]">
              {user.fullName}
            </p>
            <p className="text-xs text-muted-foreground truncate max-w-[120px]">
              {user.email}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Loại",
    cell: ({ row }) => {
      const t = row.getValue("type") as string;
      return (
        <span
          className={cn(
            "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
            t === "CONTRIBUTION"
              ? "bg-blue-500/10 text-blue-700 border-blue-500/20"
              : "bg-orange-500/10 text-orange-700 border-orange-500/20"
          )}
        >
          {TYPE_LABELS[t] ?? t}
        </span>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Danh mục",
    cell: ({ row }) => {
      const c = row.getValue("category") as string;
      return (
        <span className="text-xs text-muted-foreground">
          {CAT_LABELS[c] ?? c}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const s = row.getValue("status") as SubmissionStatus;
      return (
        <StatusBadge
          showDot
          variant={
            s === "APPROVED" ? "success" : s === "REJECTED" ? "danger" : "warning"
          }
        >
          {s === "APPROVED" ? "Đã duyệt" : s === "REJECTED" ? "Từ chối" : "Chờ xử lý"}
        </StatusBadge>
      );
    },
  },
  {
    id: "votes",
    header: "Votes",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-xs">
        <span className="flex items-center gap-0.5 text-emerald-600">
          <ThumbsUp className="h-3 w-3" />
          {row.original.upvotes}
        </span>
        <span className="flex items-center gap-0.5 text-red-500">
          <ThumbsDown className="h-3 w-3" />
          {row.original.downvotes}
        </span>
        <span className="flex items-center gap-0.5 text-amber-500">
          <Star className="h-3 w-3" />
          {row.original.reliabilityScore}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ngày gửi" />
    ),
    cell: ({ row }) => {
      const v = row.getValue("createdAt") as string;
      return (
        <span className="text-xs text-muted-foreground">
          {v ? new Date(v).toLocaleDateString("vi-VN") : "—"}
        </span>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row, table }) => {
      const meta = table.options.meta as {
        onView?: (s: IUserSubmission) => void;
        onApprove?: (s: IUserSubmission) => void;
        onReject?: (s: IUserSubmission) => void;
      };
      const s = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => meta?.onView?.(s)}>
              <Eye className="mr-2 h-4 w-4" /> Xem chi tiết
            </DropdownMenuItem>
            {s.status === "PENDING" && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-emerald-600"
                  onClick={() => meta?.onApprove?.(s)}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Duyệt nhanh
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => meta?.onReject?.(s)}
                >
                  <XCircle className="mr-2 h-4 w-4" /> Từ chối
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

/* ─── Page ────────────────────────────────────────────────────────── */
export default function UserSubmissionsPage() {
  const [data, setData] = React.useState<IUserSubmission[]>([]);
  const [stats, setStats] = React.useState<ISubmissionStats | null>(null);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalItems, setTotalItems] = React.useState(0);

  /* Filters */
  const [filterStatus, setFilterStatus] = React.useState<
    SubmissionStatus | "ALL"
  >("ALL");
  const [filterType, setFilterType] = React.useState<SubmissionType | "ALL">(
    "ALL"
  );

  /* Detail dialog */
  const [detailId, setDetailId] = React.useState<number | null>(null);
  const [detailOpen, setDetailOpen] = React.useState(false);

  /* ── Fetch stats ── */
  const fetchStats = React.useCallback(async () => {
    try {
      const res = await submissionService.getStats();
      const inner = res?.data;
      if (inner?.EC === 0) setStats(inner.result);
    } catch {
      /* stats non-critical */
    }
  }, []);

  /* ── Fetch list ── */
  const fetchList = React.useCallback(
    async (pageIndex: number, pageSize: number) => {
      try {
        const res = await submissionService.getAll({
          current: pageIndex + 1,
          pageSize,
          status: filterStatus !== "ALL" ? filterStatus : undefined,
          type: filterType !== "ALL" ? filterType : undefined,
        });
        const inner = res?.data;
        if (inner?.EC === 0) {
          setData(inner.result ?? []);
          setTotalPages(inner.meta?.pages ?? 1);
          setTotalItems(inner.meta?.total ?? 0);
        } else {
          toast.error(inner?.EM || "Không thể tải danh sách");
        }
      } catch {
        toast.error("Lỗi kết nối máy chủ");
      }
    },
    [filterStatus, filterType]
  );

  React.useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  React.useEffect(() => {
    fetchList(pagination.pageIndex, pagination.pageSize);
  }, [fetchList, pagination.pageIndex, pagination.pageSize]);

  /* Reset to page 0 when filters change */
  React.useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [filterStatus, filterType]);

  /* ── Quick approve (no note needed) ── */
  const handleQuickApprove = React.useCallback(
    async (s: IUserSubmission) => {
      try {
        const res = await submissionService.approve(s.id);
        const inner = res?.data;
        if (inner?.EC === 0) {
          toast.success(`Đã duyệt #${s.id}`);
          fetchList(pagination.pageIndex, pagination.pageSize);
          fetchStats();
        } else {
          toast.error(inner?.EM || "Duyệt thất bại");
        }
      } catch {
        toast.error("Lỗi kết nối máy chủ");
      }
    },
    [fetchList, fetchStats, pagination]
  );

  /* ── Open detail (for full review + reject) ── */
  const handleView = React.useCallback((s: IUserSubmission) => {
    setDetailId(s.id);
    setDetailOpen(true);
  }, []);

  const handleSuccess = () => {
    fetchList(pagination.pageIndex, pagination.pageSize);
    fetchStats();
  };

  /* ── Table meta ── */
  const tableMeta = React.useMemo(
    () => ({
      onView: handleView,
      onApprove: handleQuickApprove,
      onReject: handleView, /* open detail for reject so user can enter note */
    }),
    [handleView, handleQuickApprove]
  );

  return (
    <div className="flex flex-col gap-6">

      {/* Stats row */}
      {stats && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <StatCard
            label="Tổng cộng"
            value={stats.total}
            icon={InboxIcon}
            colorClass="bg-primary/10 text-primary"
          />
          <StatCard
            label="Chờ xử lý"
            value={stats.pending}
            icon={Clock}
            colorClass="bg-amber-500/10 text-amber-600"
          />
          <StatCard
            label="Đã duyệt"
            value={stats.approved}
            icon={CheckCircle2}
            colorClass="bg-emerald-500/10 text-emerald-600"
          />
          <StatCard
            label="Từ chối"
            value={stats.rejected}
            icon={XCircle}
            colorClass="bg-red-500/10 text-red-600"
          />
          <StatCard
            label="Báo cáo"
            value={stats.reports}
            icon={FileText}
            colorClass="bg-orange-500/10 text-orange-600"
          />
          <StatCard
            label="Đóng góp"
            value={stats.contributions}
            icon={TrendingUp}
            colorClass="bg-blue-500/10 text-blue-600"
          />
        </div>
      )}

      {/* Table */}
      <DataTable
        toolbarActions={
          <div className="flex items-center gap-2">
            {/* Status filter */}
            <Select
              value={filterStatus}
              onValueChange={(v) =>
                setFilterStatus(v as SubmissionStatus | "ALL")
              }
            >
              <SelectTrigger className="h-8 w-[140px] text-xs">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                <SelectItem value="PENDING">Chờ xử lý</SelectItem>
                <SelectItem value="APPROVED">Đã duyệt</SelectItem>
                <SelectItem value="REJECTED">Từ chối</SelectItem>
              </SelectContent>
            </Select>

            {/* Type filter */}
            <Select
              value={filterType}
              onValueChange={(v) =>
                setFilterType(v as SubmissionType | "ALL")
              }
            >
              <SelectTrigger className="h-8 w-[140px] text-xs">
                <SelectValue placeholder="Loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả loại</SelectItem>
                <SelectItem value="REPORT">Báo cáo</SelectItem>
                <SelectItem value="CONTRIBUTION">Đóng góp</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
        meta={tableMeta}
        columns={columns}
        data={data}
        searchKey="id"
        searchPlaceholder="Tìm theo ID..."
        pagination={pagination}
        setPagination={setPagination}
        pageCount={totalPages}
        rowCount={totalItems}
      />

      {/* Detail dialog */}
      <SubmissionDetailDialog
        submissionId={detailId}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
