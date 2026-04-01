import {
  LayoutDashboard,
  Utensils,
  Users,
  Settings,
  PieChart,
  ListOrdered
} from "lucide-react";

export interface MenuItem {
  title: string;
  url: string;
  icon: React.ElementType;
}

export interface MenuGroup {
  groupName: string;
  items: MenuItem[];
}

export const adminMenu: MenuGroup[] = [
  {
    groupName: "Tổng quan",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Phân tích",
        url: "/analytics",
        icon: PieChart,
      },
    ],
  },
  {
    groupName: "Quản lý",
    items: [
      {
        title: "Người dùng",
        url: "/users",
        icon: Users,
      },
      {
        title: "Đơn hàng",
        url: "/orders",
        icon: ListOrdered,
      },
      {
        title: "Thực đơn",
        url: "/menus",
        icon: Utensils,
      },
    ],
  },
  {
    groupName: "Hệ thống",
    items: [
      {
        title: "Cài đặt",
        url: "/settings",
        icon: Settings,
      },
    ],
  },
];
