import {
  User,
  Users,
  ShieldAlert,
  Utensils,
  Layers,
  Image,
  Package,
  AlertTriangle,
  HeartPulse,
  Activity,
  Target,
  CalendarDays,
  Cpu,
  Zap,
  Sparkles,
  Code,
  ShieldCheck,
  LayoutDashboard,
  PieChart,
  Inbox,
} from "lucide-react";

export interface MenuItem {
  title: string;
  url?: string;
  icon: React.ElementType;
  children?: MenuItem[];
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
        title: "Tổng quan",
        url: "/",
        icon: LayoutDashboard,
      },
      // {
      //   title: "Phân tích",
      //   url: "/analytics",
      //   icon: PieChart,
      // },
    ],
  },
  {
    groupName: "Quản lý",
    items: [
      {
        title: "Người dùng",
        icon: Users,
        children: [
          {
            title: "Danh sách người dùng",
            url: "/users/list",
            icon: Users,
          },
          {
            title: "Hồ sơ người dùng",
            url: "/users/profiles",
            icon: User,
          },
          {
            title: "Dị ứng người dùng",
            url: "/users/allergies",
            icon: ShieldAlert,
          },
        ],
      },
      {
        title: "Thực phẩm",
        icon: Utensils,
        children: [
          {
            title: "Danh sách Món ăn",
            url: "/foods/list",
            icon: Utensils,
          },
          {
            title: "Phân loại (Danh mục)",
            url: "/foods/categories",
            icon: Layers,
          },
          {
            title: "Ảnh thực phẩm",
            url: "/foods/images",
            icon: Image,
          },
        ],
      },
      {
        title: "Nguyên liệu",
        icon: Package,
        children: [
          {
            title: "Danh sách Nguyên liệu",
            url: "/ingredients/list",
            icon: Package,
          },
          {
            title: "Chất gây dị ứng",
            url: "/ingredients/allergens",
            icon: AlertTriangle,
          },
          // {
          //   title: "Dinh dưỡng Nguyên liệu",
          //   url: "/ingredients/nutrition",
          //   icon: HeartPulse,
          // },
        ],
      },
      {
        title: "Dinh dưỡng",
        icon: Activity,
        children: [
          {
            title: "Chỉ số dinh dưỡng",
            url: "/nutrition/nutrients",
            icon: Activity,
          },
          {
            title: "Mục tiêu dinh dưỡng",
            url: "/nutrition/goals",
            icon: Target,
          },
        ],
      },
      {
        title: "Nhật ký & Theo dõi",
        icon: CalendarDays,
        children: [
          {
            title: "Nhật ký hàng ngày",
            url: "/logs/daily",
            icon: CalendarDays,
          },
          {
            title: "Bữa ăn",
            url: "/logs/meals",
            icon: Sparkles,
          },
        ],
      },
      // {
      //   title: "AI & ML",
      //   icon: Cpu,
      //   children: [
      //     {
      //       title: "AI Models",
      //       url: "/ai/models",
      //       icon: Cpu,
      //     },
      //     {
      //       title: "Training Jobs",
      //       url: "/ai/training",
      //       icon: Zap,
      //     },
      //     {
      //       title: "Recommendations",
      //       url: "/ai/recommendations",
      //       icon: Sparkles,
      //     },
      //   ],
      // },
      {
        title: "Đề xuất người dùng",
        url: "/submissions",
        icon: Inbox,
      },

    ],
  },
  {
    groupName: "Hệ thống",
    items: [
      {
        title: "Danh mục mã hệ thống",
        url: "/system/codes",
        icon: Code,
      },
    ],
  },
];
