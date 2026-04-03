import type { ColumnDef } from "@tanstack/react-table";

export interface UserRow {
  id: number;
  fullName: string;
  email: string;
  dateOfBirth: string;
  isAdmin: boolean;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export const userColumns = (
  formatDate: (value: string) => string,
): ColumnDef<UserRow>[] => [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "fullName",
    header: "Họ và tên",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "dateOfBirth",
    header: "Ngày sinh",
    cell: ({ getValue }) => formatDate(String(getValue())),
  },
  {
    accessorKey: "isAdmin",
    header: "Admin",
    cell: ({ getValue }) => (getValue() ? "Yes" : "No"),
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ getValue }) => (getValue() ? "Hoạt động" : "Vô hiệu"),
  },
  {
    accessorKey: "createdAt",
    header: "Ngày tạo",
    cell: ({ getValue }) => formatDate(String(getValue())),
  },
  {
    accessorKey: "updatedAt",
    header: "Cập nhật",
    cell: ({ getValue }) => formatDate(String(getValue())),
  },
];
