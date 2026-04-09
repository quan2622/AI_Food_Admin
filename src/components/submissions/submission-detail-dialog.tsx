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
import {
  CheckCircle2,
  XCircle,
  Loader2,
  ThumbsUp,
  ThumbsDown,
  Star,
  ExternalLink,
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
        toast.success("Đã duyệt submission");
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
        toast.success("Đã từ chối submission");
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Chi tiết Submission #{submissionId}
          </DialogTitle>
          <DialogDescription>
            Xem thông tin và xử lý submission từ người dùng
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : detail ? (
          <div className="space-y-5">
            {/* ── Badges row ── */}
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium text-foreground bg-muted/50">
                {TYPE_LABELS[detail.type] ?? detail.type}
              </span>
              <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium text-muted-foreground bg-muted">
                {CAT_LABELS[detail.category] ?? detail.category}
              </span>
              <StatusBadge
                variant={
                  detail.status === "APPROVED"
                    ? "success"
                    : detail.status === "REJECTED"
                      ? "danger"
                      : "warning"
                }
              >
                {detail.status === "APPROVED"
                  ? "Đã duyệt"
                  : detail.status === "REJECTED"
                    ? "Đã từ chối"
                    : "Chờ xử lý"}
              </StatusBadge>

              {/* Votes */}
              <span className="inline-flex items-center gap-1 rounded-md border bg-muted/40 px-2 py-0.5 text-xs font-medium">
                <ThumbsUp className="h-3 w-3 text-emerald-500" />
                {detail.upvotes}
              </span>
              <span className="inline-flex items-center gap-1 rounded-md border bg-muted/40 px-2 py-0.5 text-xs font-medium">
                <ThumbsDown className="h-3 w-3 text-red-500" />
                {detail.downvotes}
              </span>

              {/* Reliability score */}
              <span className="inline-flex items-center gap-1 rounded-md border bg-muted/40 px-2 py-0.5 text-xs font-medium">
                <Star className="h-3 w-3 text-amber-500" />
                {detail.reliabilityScore}
              </span>
            </div>

            {/* ── Submitter info ── */}
            {detail.user && (
              <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={detail.user.avatarUrl} />
                  <AvatarFallback>
                    {detail.user.fullName?.charAt(0).toUpperCase() ?? "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-medium leading-none">
                    {detail.user.fullName}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground truncate">
                    {detail.user.email}
                  </p>
                </div>
                <p className="ml-auto text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(detail.createdAt).toLocaleString("vi-VN")}
                </p>
              </div>
            )}

            <Separator />

            {/* ── Target food (REPORT) ── */}
            {detail.targetFood && (
              <div>
                <p className="mb-2 text-sm font-semibold">Món ăn bị báo cáo</p>
                <div className="flex items-center gap-3 rounded-lg border p-3">
                  {detail.targetFood.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={detail.targetFood.imageUrl}
                      alt={detail.targetFood.foodName}
                      className="h-14 w-14 rounded-md object-cover border"
                    />
                  )}
                  <div>
                    <p className="font-medium">{detail.targetFood.foodName}</p>
                    <p className="text-xs text-muted-foreground">
                      ID: {detail.targetFood.id}
                    </p>
                    {detail.targetFood.nutritionProfile?.values?.map((v, i) => (
                      <span key={i} className="mr-2 text-xs text-muted-foreground">
                        {v.nutrient.name}: {v.value}
                      </span>
                    ))}
                  </div>
                  <ExternalLink className="ml-auto h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            )}

            {/* ── Payload ── */}
            <div>
              <p className="mb-2 text-sm font-semibold">Dữ liệu đề xuất (Payload)</p>
              <pre className="rounded-lg bg-muted p-3 text-xs overflow-x-auto">
                {JSON.stringify(detail.payload, null, 2)}
              </pre>
            </div>

            {/* ── Description ── */}
            {detail.description && (
              <div>
                <p className="mb-1 text-sm font-semibold">Ghi chú người dùng</p>
                <p className="rounded-lg border bg-muted/30 p-3 text-sm text-muted-foreground">
                  {detail.description}
                </p>
              </div>
            )}

            {/* ── Admin note (if already processed) ── */}
            {detail.adminNote && (
              <div>
                <p className="mb-1 text-sm font-semibold">Ghi chú Admin</p>
                <p className="rounded-lg border bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-200">
                  {detail.adminNote}
                </p>
              </div>
            )}

            {/* ── Actions (only when PENDING) ── */}
            {detail.status === "PENDING" && (
              <>
                <Separator />
                <div className="space-y-3">
                  {!showRejectInput ? (
                    <div className="flex gap-2">
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
                        Duyệt
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
                    <div className="space-y-2">
                      <Label htmlFor="rejectNote">Lý do từ chối *</Label>
                      <Textarea
                        id="rejectNote"
                        placeholder="Nhập lý do từ chối để thông báo cho người dùng..."
                        rows={3}
                        value={rejectNote}
                        onChange={(e) => setRejectNote(e.target.value)}
                      />
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
          <p className="py-8 text-center text-sm text-muted-foreground">
            Không tìm thấy dữ liệu
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
