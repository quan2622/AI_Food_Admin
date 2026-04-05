"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Loader2, UserPlus } from "lucide-react";

// DTO constraints translated to Zod
const formSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ" }),
  password: z
    .string()
    .min(6, { message: "Mật khẩu tối thiểu 6 ký tự" })
    .max(100),
  fullName: z
    .string()
    .min(1, { message: "Họ tên không được để trống" })
    .max(255),
  genderCode: z.string().max(10).optional(),
  avatarUrl: z.string().max(500).optional(),
  birthOfDate: z.string().optional(),
  isAdmin: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateUserDialog({ onSuccess }: { onSuccess?: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      // Create user
      await userService.createUser(data);

      toast.success("Tạo người dùng thành công");
      reset();
      setOpen(false);
      onSuccess?.(); // để refetch table nếu cần thiết
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Tạo người dùng thất bại");
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = watch("isAdmin");
  const genderCode = watch("genderCode");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Tạo User mới
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Tạo người dùng mới</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
          <div className="space-y-2">
            <Label htmlFor="fullName">Họ và tên</Label>
            <Input id="fullName" placeholder="Nguyễn Văn A" {...register("fullName")} />
            {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="example@aifood.vn" {...register("email")} />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu</Label>
            <Input id="password" type="password" placeholder="******" {...register("password")} />
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>

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
              {errors.genderCode && <p className="text-sm text-red-500">{errors.genderCode.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthOfDate">Ngày sinh</Label>
              <Input id="birthOfDate" type="date" {...register("birthOfDate")} />
              {errors.birthOfDate && <p className="text-sm text-red-500">{errors.birthOfDate.message}</p>}
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
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Lưu
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
