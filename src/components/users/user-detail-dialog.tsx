import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function UserDetailDialog({
  open,
  onOpenChange,
  user,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: any;
}) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Thông tin người dùng</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.avatarUrl} />
            <AvatarFallback className="text-2xl">
              {user.fullName?.charAt(0).toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Họ và tên:</span>
            <span className="col-span-2 text-sm font-semibold">{user.fullName || "—"}</span>
          </div>
          
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Email:</span>
            <span className="col-span-2 text-sm">{user.email || "—"}</span>
          </div>
          
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Giới tính:</span>
            <span className="col-span-2 text-sm">
              {user.genderCode === "MALE"
                ? "Nam"
                : user.genderCode === "FEMALE"
                ? "Nữ"
                : "Khác"}
            </span>
          </div>

          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Ngày sinh:</span>
            <span className="col-span-2 text-sm">
              {(user.birthOfDate || user.dateOfBirth)
                ? new Date(user.birthOfDate || user.dateOfBirth).toLocaleDateString("vi-VN")
                : "—"}
            </span>
          </div>

          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Phân quyền:</span>
            <span className="col-span-2 text-sm font-medium text-primary">
              {user.isAdmin ? "Quản trị viên (Admin)" : "Người dùng (User)"}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
