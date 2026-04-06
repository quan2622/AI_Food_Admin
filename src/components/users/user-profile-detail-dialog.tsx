import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const activityLevelMap: Record<string, string> = {
  SEDENTARY: "Ít vận động",
  LIGHTLY_ACTIVE: "Nhẹ nhàng",
  MODERATELY_ACTIVE: "Trung bình",
  VERY_ACTIVE: "Năng động",
  SUPER_ACTIVE: "Rất năng động",
};

export function UserProfileDetailDialog({
  open,
  onOpenChange,
  profile,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile?: any;
}) {
  if (!profile) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Chi tiết hồ sơ sức khỏe</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-3 items-center gap-4 border-b pb-4 mt-2">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
              Người dùng:
            </span>
            <span className="col-span-2 text-sm font-semibold truncate">
              {profile.user?.fullName || profile.userName || "—"}
            </span>
          </div>

          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
              Độ tuổi:
            </span>
            <span className="col-span-2 text-sm">
              {profile.age || "—"} tuổi
            </span>
          </div>

          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
              Chiều cao / Cân nặng:
            </span>
            <span className="col-span-2 text-sm">
              {profile.height} cm / {profile.weight} kg
            </span>
          </div>

          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
              Giới tính:
            </span>
            <span className="col-span-2 text-sm">
              {profile.gender === "MALE"
                ? "Nam"
                : profile.gender === "FEMALE"
                  ? "Nữ"
                  : "Khác"}
            </span>
          </div>

          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
              Mức độ vận động:
            </span>
            <span className="col-span-2 text-sm font-medium">
              {profile.activityLevelData?.description ||
                profile.activityLevelData?.levelName ||
                (profile.activityLevel
                  ? activityLevelMap[profile.activityLevel] ||
                    profile.activityLevel
                  : "—")}
            </span>
          </div>

          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
              Chỉ số đo lường:
            </span>
            <div className="col-span-2 grid grid-cols-3 gap-2 text-sm">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">BMI</span>
                <span className="font-semibold">
                  {profile.bmi?.toFixed(1) || "—"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">BMR</span>
                <span className="font-semibold">
                  {profile.bmr?.toFixed(0) || "—"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">TDEE</span>
                <span className="font-semibold">
                  {profile.tdee?.toFixed(0) || "—"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
