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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { userService } from "@/services/userService";
import { Loader2 } from "lucide-react";

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
        });
      }
    }
  }, [open, mode, initialData, reset]);

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);

      // Lọc các giá trị null hoặc undefined
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
        await userService.createUser(payload);
        toast.success("Tạo người dùng thành công");
      } else {
        // Nếu API cần thêm fields thì truyền vào
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
  const genderCode = watch("genderCode") || "UNDEFINED";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Tạo người dùng mới" : "Cập nhật người dùng"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
          <div className="space-y-2">
            <Label htmlFor="fullName">Họ và tên</Label>
            <Input id="fullName" placeholder="Nguyễn Văn A" {...register("fullName")} />
            {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}
          </div>

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

          {mode === "create" && (
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                placeholder="******"
                {...register("password")}
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>
          )}

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

          <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
            <Checkbox
              id="isAdmin"
              checked={isAdmin}
              onCheckedChange={(checked) => setValue("isAdmin", checked === true)}
            />
            <div className="space-y-1 leading-none">
              <Label htmlFor="isAdmin" className="cursor-pointer">
                Cấp quyền Admin
              </Label>
              <p className="text-xs text-muted-foreground pt-1">
                Người dùng này sẽ có quyền truy cập trang quản trị.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-4 space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === "create" ? "Tạo mới" : "Cập nhật"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
