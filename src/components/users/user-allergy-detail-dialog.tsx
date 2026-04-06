import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StatusBadge } from "@/components/status-badge";

const severityMap: Record<string, { label: string; variant: "success" | "warning" | "danger" | "info" }> = {
  SEV_LOW: { label: "Nhẹ", variant: "success" },
  SEV_MEDIUM: { label: "Trung bình", variant: "warning" },
  SEV_HIGH: { label: "Nặng", variant: "danger" },
  SEV_LIFE_THREATENING: { label: "Nguy hiểm", variant: "danger" },
};

export function UserAllergyDetailDialog({
  open,
  onOpenChange,
  payload,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payload?: any;
}) {
  if (!payload) return null;

  const allergies = payload.allergies || [];

  const allergyCards = allergies.map((a: any) => {
    const sev = severityMap[a.severity] ?? { label: a.severity, variant: "default" };
    return (
      <div key={a.id} className="p-3 border rounded-md bg-muted/40 text-sm">
        <div className="flex items-center justify-between mb-1">
          <span className="font-semibold">{a.allergen?.name}</span>
          <StatusBadge variant={sev.variant as any}>{sev.label}</StatusBadge>
        </div>
        {a.allergen?.description && (
          <p className="text-xs text-muted-foreground mb-2">{a.allergen.description}</p>
        )}
        
        <div className="mt-2 text-xs bg-background p-2 rounded border">
          <span className="font-medium">Ghi chú: </span>
          <span className={!a.note ? "italic text-muted-foreground" : ""}>
            {a.note || "Không có ghi chú thêm."}
          </span>
        </div>
        
        <div className="mt-2 text-[10px] text-muted-foreground font-mono flex justify-between">
            <span>Ngày tạo: {a.createdAt ? new Date(a.createdAt).toLocaleString("vi-VN") : "—"}</span>
        </div>
      </div>
    );
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Chi tiết dị ứng của người dùng</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          <div className="grid grid-cols-2 gap-4 border-b pb-4 mt-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground whitespace-nowrap">ID / Tài khoản:</p>
              <p className="text-sm font-semibold">#{payload.userId} — {payload.user?.email || "—"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground whitespace-nowrap">Tên hiển thị:</p>
              <p className="text-sm font-semibold">{payload.user?.fullName || "—"}</p>
            </div>
          </div>

          <div className="pt-2">
            <h4 className="text-sm font-medium mb-3">Danh sách chất dị ứng ({allergies.length}):</h4>
            {allergies.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">Người dùng không có thông tin dị ứng.</p>
            ) : allergies.length > 3 ? (
              <div className="h-[350px] overflow-y-auto pr-4 custom-scrollbar">
                <div className="space-y-3">{allergyCards}</div>
              </div>
            ) : (
              <div className="space-y-3">{allergyCards}</div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
