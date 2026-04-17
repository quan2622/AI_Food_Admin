"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/status-badge";
import { userService } from "@/services/userService";
import type { IAdminUserDetail } from "@/types/user.type";
import {
  Loader2,
  ShieldCheck,
  ShieldOff,
  UserCheck,
  UserX,
  Ruler,
  Weight,
  Activity,
  Target,
  Flame,
  Wheat,
  Beef,
  Droplets,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ── label maps ── */
const ACTIVITY_LABELS: Record<string, string> = {
  SEDENTARY: "Ít vận động",
  LIGHTLY_ACTIVE: "Nhẹ nhàng",
  MODERATELY_ACTIVE: "Vừa phải",
  VERY_ACTIVE: "Năng động",
  SUPER_ACTIVE: "Cường độ cao",
};

const GOAL_TYPE_LABELS: Record<string, string> = {
  MAINTAIN: "Duy trì cân nặng",
  LOSE: "Giảm cân",
  GAIN: "Tăng cân / cơ",
  CUSTOM: "Tuỳ chỉnh",
};

/* ── small helpers ── */
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[120px_1fr] items-start gap-2">
      <span className="text-xs font-medium text-muted-foreground pt-0.5">{label}</span>
      <span className="text-sm">{children}</span>
    </div>
  );
}

function MacroChip({
  icon: Icon,
  label,
  value,
  unit = "g",
  color,
}: {
  icon: React.ElementType;
  label: string;
  value?: number | null;
  unit?: string;
  color: string;
}) {
  return (
    <div className={cn("flex flex-col items-center gap-0.5 rounded-lg border p-2 min-w-[64px]", color)}>
      <Icon className="h-3.5 w-3.5" />
      <span className="text-xs font-bold">{value ?? "—"}{value != null ? unit : ""}</span>
      <span className="text-[10px] text-muted-foreground">{label}</span>
    </div>
  );
}

export function UserDetailDialog({
  open,
  onOpenChange,
  userId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** ID được truyền vào để fetch API ngay trong dialog */
  userId?: number | null;
}) {
  const [data, setData] = useState<IAdminUserDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !userId) {
      setData(null);
      setError(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await userService.getAdminUserById(userId);
        if (!cancelled) {
          // Trích xuất metadata và data từ response (giả sử res là object được axios trả về từ response.data)
          const metadata = (res as any)?.metadata;
          const userData = (res as any)?.data;

          if (metadata?.EC === 0 && userData) {
            setData(userData);
          } else {
            setError(metadata?.message || "Không thể tải thông tin người dùng");
          }
        }
      } catch {
        if (!cancelled) setError("Lỗi kết nối máy chủ");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [open, userId]);

  const isActive = data?.status === true;
  const isAdmin  = data?.isAdmin === true;
  const profile  = data?.userProfile;
  const goal     = data?.currentGoal;

  const genderLabel =
    data?.genderCode === "MALE" ? "Nam"
    : data?.genderCode === "FEMALE" ? "Nữ"
    : "Khác";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] md:max-w-[800px] lg:max-w-[900px] w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thông tin người dùng</DialogTitle>
          {data && (
            <DialogDescription>ID #{data.id} · {data.email}</DialogDescription>
          )}
        </DialogHeader>

        {/* ── Loading ── */}
        {loading && (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Đang tải...
          </div>
        )}

        {/* ── Error ── */}
        {!loading && error && (
          <p className="text-sm text-red-500 text-center py-8">{error}</p>
        )}

        {/* ── Content ── */}
        {!loading && data && (
          <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6 pt-2">
            {/* ── Cột trái: Avatar + Thông tin cơ bản ── */}
            <div className="flex flex-col gap-5 md:border-r md:pr-6">
              {/* Avatar + tên + badges */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  <Avatar className="h-24 w-24 shadow-sm border">
                    <AvatarImage src={data.avatarUrl ?? undefined} />
                    <AvatarFallback className="text-3xl">
                      {data.fullName?.charAt(0).toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <span
                    className={cn(
                      "absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-background",
                      isActive ? "bg-emerald-500" : "bg-red-500"
                    )}
                    title={isActive ? "Đang hoạt động" : "Đã bị khóa"}
                  />
                </div>
                <div className="text-center">
                  <p className="font-bold text-lg leading-tight">{data.fullName || "—"}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{data.email}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap justify-center mt-1">
                  <StatusBadge variant={isActive ? "success" : "danger"} showDot>
                    {isActive ? "Hoạt động" : "Bị khóa"}
                  </StatusBadge>
                  <StatusBadge variant={isAdmin ? "info" : "muted"}>
                    {isAdmin ? (
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3" /> Admin
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <ShieldOff className="h-3 w-3" /> User
                      </span>
                    )}
                  </StatusBadge>
                </div>
              </div>

              <div className="border-t" />

              {/* Thông tin cơ bản */}
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Thông tin cơ bản
                </p>
                <div className="space-y-2.5">
                  <Row label="Giới tính">{genderLabel}</Row>
                  <Row label="Ngày sinh">
                    {(data.birthOfDate || data.dateOfBirth)
                      ? new Date((data.birthOfDate || data.dateOfBirth)!).toLocaleDateString("vi-VN")
                      : "—"}
                  </Row>
                  <Row label="Ngày tạo">
                    {data.createdAt
                      ? new Date(data.createdAt).toLocaleDateString("vi-VN")
                      : "—"}
                  </Row>
                  <Row label="Trạng thái">
                    <span className={cn("flex items-center gap-1.5 font-medium", isActive ? "text-emerald-600" : "text-red-500")}>
                      {isActive
                        ? <><UserCheck className="h-3.5 w-3.5" /> Đang hoạt động</>
                        : <><UserX className="h-3.5 w-3.5" /> Tài khoản bị khóa</>
                      }
                    </span>
                  </Row>
                </div>
              </div>
            </div>

            {/* ── Cột phải: Sức khỏe & Mục tiêu ── */}
            <div className="flex flex-col gap-6">
              {/* Hồ sơ sức khỏe */}
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                  <Activity className="h-4 w-4 text-purple-500" />
                  Hồ sơ sức khỏe
                </p>
                
                {profile ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="flex flex-col items-center gap-1 rounded-lg border bg-muted/20 p-3 shadow-sm">
                        <Ruler className="h-4 w-4 text-blue-500" />
                        <span className="text-base font-bold">{profile.height ?? "—"}<span className="text-xs font-normal text-muted-foreground"> cm</span></span>
                        <span className="text-xs text-muted-foreground font-medium">Chiều cao</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 rounded-lg border bg-muted/20 p-3 shadow-sm">
                        <Weight className="h-4 w-4 text-orange-500" />
                        <span className="text-base font-bold">{profile.weight ?? "—"}<span className="text-xs font-normal text-muted-foreground"> kg</span></span>
                        <span className="text-xs text-muted-foreground font-medium">Cân nặng</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 rounded-lg border bg-muted/20 p-3 shadow-sm">
                        <Activity className="h-4 w-4 text-purple-500" />
                        <span className="text-base font-bold">{profile.bmi != null ? profile.bmi.toFixed(1) : "—"}</span>
                        <span className="text-xs text-muted-foreground font-medium">Chỉ số BMI</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 rounded-lg border p-4 bg-muted/10">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Mức độ vận động</p>
                        <p className="text-sm font-semibold">
                          {profile.activityLevel ? (ACTIVITY_LABELS[profile.activityLevel] ?? profile.activityLevel) : "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">TDEE (Năng lượng tiêu hao)</p>
                        <p className="text-sm font-semibold">
                          {profile.tdee != null ? Math.round(profile.tdee) : "—"} <span className="text-xs text-muted-foreground font-normal">kcal/ngày</span>
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed p-6 text-center">
                    <p className="text-sm text-muted-foreground italic">Người dùng chưa thiết lập hồ sơ sức khỏe</p>
                  </div>
                )}
              </div>

              <div className="border-t" />

              {/* Mục tiêu dinh dưỡng đang chạy */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    Mục tiêu dinh dưỡng
                  </p>
                  {goal && <StatusBadge variant="success" showDot>Đang chạy</StatusBadge>}
                </div>
                
                {goal ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 rounded-lg border p-4 bg-muted/10">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Loại mục tiêu</p>
                        <p className="text-sm font-semibold flex items-center gap-1.5">
                          {GOAL_TYPE_LABELS[goal.goalType] ?? goal.goalType}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Thời gian áp dụng</p>
                        <p className="text-sm font-semibold">
                          {new Date(goal.startDate).toLocaleDateString("vi-VN")}
                          {" → "}
                          {new Date(goal.endDate).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">Chỉ tiêu mỗi ngày (Macros)</p>
                      <div className="grid grid-cols-4 gap-2">
                        <MacroChip icon={Flame}   label="Calo"    value={goal.targetCalories} unit=" kcal" color="text-orange-600 border-orange-200 bg-orange-50 dark:bg-orange-950/30 dark:border-orange-800" />
                        <MacroChip icon={Beef}    label="Protein" value={goal.targetProtein}  color="text-blue-600 border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-800" />
                        <MacroChip icon={Wheat}   label="Carbs"   value={goal.targetCarbs}    color="text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800" />
                        <MacroChip icon={Droplets} label="Fat"    value={goal.targetFat}       color="text-rose-600 border-rose-200 bg-rose-50 dark:bg-rose-950/30 dark:border-rose-800" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed p-6 text-center">
                    <p className="text-sm text-muted-foreground italic">Không có mục tiêu dinh dưỡng nào đang chạy</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
