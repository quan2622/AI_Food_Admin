"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/status-badge";
import { submissionService } from "@/services/submissionService";
import type { IUserSubmission } from "@/types/submission.type";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  ThumbsUp,
  ThumbsDown,
  Star,
  AlertCircle,
  Tag,
  FileText,
  CalendarDays,
} from "lucide-react";

/* ─── Helpers ─────────────────────────────────────────────────────── */
const TYPE_LABELS: Record<string, string> = {
  REPORT: "Báo cáo sai sót",
  CONTRIBUTION: "Đóng góp món mới",
};
const CAT_LABELS: Record<string, string> = {
  WRONG_INFO: "Thông tin sai",
  BAD_IMAGE: "Ảnh kém chất lượng",
  NEW_FOOD: "Món ăn mới",
  DUPLICATE: "Trùng lặp",
};

interface SubmissionDetailDialogProps {
  submissionId: number | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSuccess: () => void;
}

export function SubmissionDetailDialog({
  submissionId,
  open,
  onOpenChange,
  onSuccess,
}: SubmissionDetailDialogProps) {
  const [detail, setDetail] = React.useState<IUserSubmission | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [actionLoading, setActionLoading] = React.useState<
    "approve" | "reject" | null
  >(null);
  const [rejectNote, setRejectNote] = React.useState("");
  const [showRejectInput, setShowRejectInput] = React.useState(false);

  /* Fetch detail when dialog opens */
  React.useEffect(() => {
    if (!open || submissionId === null) {
      setDetail(null);
      setRejectNote("");
      setShowRejectInput(false);
      return;
    }
    setLoading(true);
    submissionService
      .getById(submissionId)
      .then((res) => {
        const inner = res?.data;
        if (inner?.EC === 0) setDetail(inner.result);
        else toast.error(inner?.EM || "Không thể tải chi tiết");
      })
      .catch(() => toast.error("Lỗi kết nối máy chủ"))
      .finally(() => setLoading(false));
  }, [open, submissionId]);

  const handleApprove = async () => {
    if (!detail) return;
    setActionLoading("approve");
    try {
      const res = await submissionService.approve(detail.id);
      const inner = res?.data;
      if (inner?.EC === 0) {
        toast.success("Đã duyệt đề xuất");
        onOpenChange(false);
        onSuccess();
      } else {
        toast.error(inner?.EM || "Duyệt thất bại");
      }
    } catch {
      toast.error("Lỗi kết nối máy chủ");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!detail) return;
    if (!rejectNote.trim()) {
      toast.error("Vui lòng nhập lý do từ chối");
      return;
    }
    setActionLoading("reject");
    try {
      const res = await submissionService.reject(detail.id, {
        adminNote: rejectNote.trim(),
      });
      const inner = res?.data;
      if (inner?.EC === 0) {
        toast.success("Đã từ chối đề xuất");
        onOpenChange(false);
        onSuccess();
      } else {
        toast.error(inner?.EM || "Từ chối thất bại");
      }
    } catch {
      toast.error("Lỗi kết nối máy chủ");
    } finally {
      setActionLoading(null);
    }
  };

  const statusVariant =
    detail?.status === "APPROVED"
      ? "success"
      : detail?.status === "REJECTED"
        ? "danger"
        : "warning";
  const statusLabel =
    detail?.status === "APPROVED"
      ? "Đã duyệt"
      : detail?.status === "REJECTED"
        ? "Đã từ chối"
        : "Chờ xử lý";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* ── Header ── */}
        <DialogHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <DialogTitle className="text-lg">
                Đề xuất #{submissionId}
              </DialogTitle>
              <DialogDescription className="mt-1">
                Xem thông tin và xử lý đề xuất từ người dùng
              </DialogDescription>
            </div>
            {detail && (
              <StatusBadge showDot variant={statusVariant}>
                {statusLabel}
              </StatusBadge>
            )}
          </div>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
          </div>
        ) : detail ? (
          <div className="mt-2 space-y-4">
            {/* ── Top info grid ── */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Submitter card */}
              <div className="rounded-xl border bg-muted/30 p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Người gửi
                </p>
                {detail.user ? (
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={detail.user.avatarUrl} />
                      <AvatarFallback>
                        {detail.user.fullName?.charAt(0).toUpperCase() ?? "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium leading-none">
                        {detail.user.fullName}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {detail.user.email}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">—</p>
                )}
              </div>

              {/* Meta card */}
              <div className="rounded-xl border bg-muted/30 p-4 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Thông tin
                </p>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Tag className="h-3.5 w-3.5" /> Loại
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
                      detail.type === "CONTRIBUTION"
                        ? "bg-blue-500/10 text-blue-700 border-blue-500/20"
                        : "bg-orange-500/10 text-orange-700 border-orange-500/20",
                    )}
                  >
                    {TYPE_LABELS[detail.type] ?? detail.type}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <FileText className="h-3.5 w-3.5" /> Danh mục
                  </span>
                  <span className="text-xs font-medium">
                    {CAT_LABELS[detail.category] ?? detail.category}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CalendarDays className="h-3.5 w-3.5" /> Ngày gửi
                  </span>
                  <span className="text-xs font-medium">
                    {new Date(detail.createdAt).toLocaleString("vi-VN")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Đánh giá
                  </span>
                  <div className="flex items-center gap-2.5 text-xs">
                    <span className="flex items-center gap-0.5 text-emerald-600">
                      <ThumbsUp className="h-3 w-3" /> {detail.upvotes}
                    </span>
                    <span className="flex items-center gap-0.5 text-red-500">
                      <ThumbsDown className="h-3 w-3" /> {detail.downvotes}
                    </span>
                    <span className="flex items-center gap-0.5 text-amber-500">
                      <Star className="h-3 w-3" /> {detail.reliabilityScore}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Target food (REPORT) ── */}
            {detail.targetFood && (
              <div className="rounded-xl border p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Món ăn bị báo cáo
                </p>
                <div className="flex items-center gap-3">
                  {detail.targetFood.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={detail.targetFood.imageUrl}
                      alt={detail.targetFood.foodName}
                      className="h-16 w-16 shrink-0 rounded-lg object-cover border"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{detail.targetFood.foodName}</p>
                    <p className="text-xs text-muted-foreground">
                      ID: {detail.targetFood.id}
                    </p>
                    {detail.targetFood.nutritionProfile?.values?.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
                        {detail.targetFood.nutritionProfile.values.map(
                          (v, i) => (
                            <span
                              key={i}
                              className="text-xs text-muted-foreground"
                            >
                              {v.nutrient.name}: {v.value}
                            </span>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── Description ── */}
            {detail.description && (
              <div className="rounded-xl border p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Ghi chú người dùng
                </p>
                <p className="text-sm leading-relaxed text-foreground">
                  {detail.description}
                </p>
              </div>
            )}

            {/* ── Payload ── */}
            <div className="rounded-xl border p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Dữ liệu đề xuất
              </p>
              <pre className="rounded-lg bg-muted p-3 text-xs overflow-x-auto leading-relaxed">
                {JSON.stringify(detail.payload, null, 2)}
              </pre>
            </div>

            {/* ── Admin note ── */}
            {detail.adminNote && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950">
                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Ghi chú quản trị viên
                </p>
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  {detail.adminNote}
                </p>
              </div>
            )}

            {/* ── Actions (only PENDING) ── */}
            {detail.status === "PENDING" && (
              <>
                <Separator />
                <div className="space-y-3">
                  {!showRejectInput ? (
                    <div className="flex gap-3">
                      <Button
                        className="flex-1"
                        onClick={handleApprove}
                        disabled={actionLoading !== null}
                      >
                        {actionLoading === "approve" ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                        )}
                        Duyệt đề xuất
                      </Button>
                      <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={() => setShowRejectInput(true)}
                        disabled={actionLoading !== null}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Từ chối
                      </Button>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 space-y-3">
                      <p className="flex items-center gap-1.5 text-sm font-semibold text-destructive">
                        <XCircle className="h-4 w-4" /> Từ chối đề xuất
                      </p>
                      <div className="space-y-1.5">
                        <Label htmlFor="rejectNote">
                          Lý do từ chối{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                          id="rejectNote"
                          placeholder="Nhập lý do từ chối để thông báo cho người dùng..."
                          rows={3}
                          value={rejectNote}
                          onChange={(e) => setRejectNote(e.target.value)}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => {
                            setShowRejectInput(false);
                            setRejectNote("");
                          }}
                          disabled={actionLoading !== null}
                        >
                          Hủy
                        </Button>
                        <Button
                          variant="destructive"
                          className="flex-1"
                          onClick={handleReject}
                          disabled={actionLoading !== null}
                        >
                          {actionLoading === "reject" ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <XCircle className="mr-2 h-4 w-4" />
                          )}
                          Xác nhận từ chối
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-16">
            <AlertCircle className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Không tìm thấy dữ liệu
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
