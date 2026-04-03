"use client";

import { UserTable, UserRow } from "@/components/users/user-table";
import { userColumns } from "@/components/users/user-columns";

const users: UserRow[] = [
  {
    id: 1,
    fullName: "Nguyễn Văn A",
    email: "a@aifood.vn",
    dateOfBirth: "1990-01-15",
    isAdmin: true,
    status: true,
    createdAt: "2025-12-01T09:20:00Z",
    updatedAt: "2026-03-20T08:15:23Z",
  },
  {
    id: 2,
    fullName: "Trần Thị B",
    email: "b@aifood.vn",
    dateOfBirth: "1995-03-10",
    isAdmin: false,
    status: true,
    createdAt: "2025-12-05T10:35:57Z",
    updatedAt: "2026-03-18T14:42:11Z",
  },
  {
    id: 3,
    fullName: "Lê Văn C",
    email: "c@aifood.vn",
    dateOfBirth: "1985-07-22",
    isAdmin: false,
    status: false,
    createdAt: "2026-01-08T13:11:34Z",
    updatedAt: "2026-03-19T16:59:03Z",
  },
  {
    id: 4,
    fullName: "Phạm Thị D",
    email: "d@aifood.vn",
    dateOfBirth: "1992-06-02",
    isAdmin: false,
    status: true,
    createdAt: "2026-02-01T08:02:12Z",
    updatedAt: "2026-03-17T09:20:45Z",
  },
  {
    id: 5,
    fullName: "Hoàng Minh E",
    email: "e@aifood.vn",
    dateOfBirth: "1998-11-11",
    isAdmin: false,
    status: true,
    createdAt: "2026-03-01T11:22:10Z",
    updatedAt: "2026-03-21T07:30:16Z",
  },
];

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

export default function UsersListPage() {
  return (
    <main className="mx-auto w-full max-w-full p-4 md:p-6">
      <div className="mb-4 rounded-lg border bg-background p-4 shadow-sm">
        <h1 className="text-2xl font-semibold">Danh sách người dùng</h1>
        <p className="text-sm text-muted-foreground">
          Hiển thị thông tin người dùng từ schema User (email, tên, ngày sinh,
          quyền admin, trạng thái, ngày tạo, ngày cập nhật).
        </p>
      </div>

      <div className="rounded-lg border bg-background p-4 shadow-sm">
        <UserTable
          data={users}
          columns={userColumns(formatDate)}
          paginationMode="client"
          initialPageSize={5}
          pageSizeOptions={[5, 10, 20]}
          onPageChange={(pageIndex, pageSize) => {
            console.log("page", pageIndex + 1, "size", pageSize);
          }}
        />
      </div>
    </main>
  );
}
