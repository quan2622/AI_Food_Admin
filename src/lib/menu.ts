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
        title: "Dashboard",
        url: "/",
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
        title: "User",
        icon: Users,
        children: [
          {
            title: "Danh sách Users",
            url: "/users/list",
            icon: Users,
          },
          {
            title: "User Profiles",
            url: "/users/profiles",
            icon: User,
          },
          {
            title: "User Allergies",
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
            title: "Phân loại (Categories)",
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
            title: "Chất gây dị ứng (Allergens)",
            url: "/ingredients/allergens",
            icon: AlertTriangle,
          },
          {
            title: "Dinh dưỡng Nguyên liệu",
            url: "/ingredients/nutrition",
            icon: HeartPulse,
          },
        ],
      },
      {
        title: "Dinh dưỡng",
        icon: Activity,
        children: [
          {
            title: "Chất dinh dưỡng (Nutrients)",
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
        title: "Logs & Tracking",
        icon: CalendarDays,
        children: [
          {
            title: "Daily Logs",
            url: "/logs/daily",
            icon: CalendarDays,
          },
          {
            title: "Meals",
            url: "/logs/meals",
            icon: Sparkles,
          },
        ],
      },
      {
        title: "AI & ML",
        icon: Cpu,
        children: [
          {
            title: "AI Models",
            url: "/ai/models",
            icon: Cpu,
          },
          {
            title: "Training Jobs",
            url: "/ai/training",
            icon: Zap,
          },
          {
            title: "Recommendations",
            url: "/ai/recommendations",
            icon: Sparkles,
          },
        ],
      },
      {
        title: "User Submissions",
        url: "/submissions",
        icon: Inbox,
      },

    ],
  },
  {
    groupName: "Hệ thống",
    items: [
      {
        title: "All Codes",
        url: "/system/codes",
        icon: Code,
      },
      {
        title: "Admin Roles",
        url: "/system/roles",
        icon: ShieldCheck,
      },
    ],
  },
];
