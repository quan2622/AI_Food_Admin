"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { userService } from "@/services/userService";
import { Loader2, ShieldCheck, UserCheck, UserX } from "lucide-react";
import { cn } from "@/lib/utils";

type Mode = "create" | "edit";

export function UserFormDialog({
  open,
  onOpenChange,
  onSuccess,
  mode = "create",
  initialData,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  mode?: Mode;
  initialData?: any;
}) {
  const [loading, setLoading] = useState(false);

  // Schema động: password là bắt buộc khi create, và bị bỏ qua khi edit
  const formSchema = z.object({
    email: z.string().email({ message: "Email không hợp lệ" }),
    password:
      mode === "create"
        ? z.string().min(6, { message: "Mật khẩu tối thiểu 6 ký tự" }).max(100)
        : z.string().optional(),
    fullName: z
      .string()
      .min(1, { message: "Họ tên không được để trống" })
      .max(255),
    genderCode: z.string().max(10).optional().nullable(),
    avatarUrl: z.string().max(500).optional().nullable(),
    birthOfDate: z.string().optional().nullable(),
    isAdmin: z.boolean(),
    status: z.boolean(),
  });

  type FormValues = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      genderCode: "UNDEFINED",
      avatarUrl: "",
      birthOfDate: "",
      isAdmin: false,
      status: true,
    },
  });

  useEffect(() => {
    if (open) {
      if (mode === "edit" && initialData) {
        // Chỉ lấy YYYY-MM-DD từ dateOfBirth hoặc birthOfDate nếu có
        let birthDate = "";
        const initDOB = initialData.birthOfDate || initialData.dateOfBirth;
        if (initDOB) {
          try {
            birthDate = new Date(initDOB).toISOString().split("T")[0];
          } catch (error) {}
        }

        reset({
          email: initialData.email || "",
          password: "",
          fullName: initialData.fullName || "",
          genderCode: initialData.genderCode || "UNDEFINED",
          avatarUrl: initialData.avatarUrl || "",
          birthOfDate: birthDate,
          isAdmin: initialData.isAdmin || false,
          status: initialData.status !== undefined ? initialData.status : true,
        });
      } else {
        reset({
          email: "",
          password: "",
          fullName: "",
          genderCode: "UNDEFINED",
          avatarUrl: "",
          birthOfDate: "",
          isAdmin: false,
          status: true,
        });
      }
    }
  }, [open, mode, initialData, reset]);

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);

      const payload: any = {
        email: data.email,
        fullName: data.fullName,
        genderCode: data.genderCode,
        avatarUrl: data.avatarUrl,
        birthOfDate: data.birthOfDate ? new Date(data.birthOfDate).toISOString() : undefined,
        isAdmin: data.isAdmin,
      };

      if (mode === "create") {
        payload.password = data.password;
        // Tài khoản mới luôn active, không cần gửi status
        await userService.createUser(payload);
        toast.success("Tạo người dùng thành công");
      } else {
        // Gửi cả status khi chỉnh sửa
        payload.status = data.status;
        await userService.updateUser(initialData.id, payload);
        toast.success("Cập nhật thông tin thành công");
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          (mode === "create" ? "Tạo người dùng thất bại" : "Cập nhật thất bại")
      );
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = watch("isAdmin");
  const status = watch("status");
  const genderCode = watch("genderCode") || "UNDEFINED";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Tạo người dùng mới" : "Cập nhật người dùng"}
          </DialogTitle>
          {mode === "edit" && initialData && (
            <DialogDescription>
              ID #{initialData.id} · {initialData.email}
            </DialogDescription>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
          {/* Họ tên */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Họ và tên</Label>
            <Input id="fullName" placeholder="Nguyễn Văn A" {...register("fullName")} />
            {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@aifood.vn"
              {...register("email")}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>

          {/* Mật khẩu — chỉ hiện khi create */}
          {mode === "create" && (
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                placeholder="Tối thiểu 6 ký tự"
                {...register("password")}
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>
          )}

          {/* Giới tính + Ngày sinh */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="genderCode">Giới tính</Label>
              <Select
                value={genderCode}
                onValueChange={(value) => setValue("genderCode", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn giới tính" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Nam</SelectItem>
                  <SelectItem value="FEMALE">Nữ</SelectItem>
                  <SelectItem value="UNDEFINED">Khác</SelectItem>
                </SelectContent>
              </Select>
              {errors.genderCode && (
                <p className="text-sm text-red-500">{errors.genderCode.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthOfDate">Ngày sinh</Label>
              <Input id="birthOfDate" type="date" {...register("birthOfDate")} />
              {errors.birthOfDate && (
                <p className="text-sm text-red-500">{errors.birthOfDate.message}</p>
              )}
            </div>
          </div>

          {/* ── Quyền hạn & Trạng thái ── */}
          <div className="rounded-md border divide-y overflow-hidden">
            {/* Quyền Admin */}
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <div className="space-y-0.5">
                  <Label htmlFor="isAdmin" className="cursor-pointer font-medium text-sm">
                    Quyền quản trị viên
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Cho phép truy cập bảng quản trị
                  </p>
                </div>
              </div>
              <Checkbox
                id="isAdmin"
                checked={isAdmin}
                onCheckedChange={(checked) => setValue("isAdmin", checked === true)}
              />
            </div>

            {/* Trạng thái tài khoản — chỉ hiện khi edit */}
            {mode === "edit" && (
              <div
                className={cn(
                  "flex items-center justify-between px-4 py-3 transition-colors duration-200",
                  status ? "bg-emerald-500/5" : "bg-red-500/5"
                )}
              >
                <div className="flex items-center gap-3">
                  {status ? (
                    <UserCheck className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <UserX className="h-4 w-4 text-red-500 flex-shrink-0" />
                  )}
                  <div className="space-y-0.5">
                    <Label htmlFor="status" className="cursor-pointer font-medium text-sm">
                      Trạng thái tài khoản
                    </Label>
                    <p
                      className={cn(
                        "text-xs font-medium",
                        status ? "text-emerald-600" : "text-red-500"
                      )}
                    >
                      {status ? "Đang hoạt động" : "Đã bị khóa"}
                    </p>
                  </div>
                </div>
                <Switch
                  id="status"
                  checked={status}
                  onCheckedChange={(checked) => setValue("status", checked)}
                  className={status ? "[&[data-checked]]:bg-emerald-500" : ""}
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end pt-2 space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === "create" ? "Tạo mới" : "Lưu thay đổi"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
