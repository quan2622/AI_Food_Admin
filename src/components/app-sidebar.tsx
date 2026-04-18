"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User2,
  UtensilsCrossed,
  ChevronsUpDown,
  Sparkles,
  BadgeCheck,
  CreditCard,
  Bell,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/stores/authStore";

import { adminMenu, type MenuItem } from "../lib/menu";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { isMobile } = useSidebar();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logoutAction = useAuthStore((state) => state.logoutAction);
  const [openSections, setOpenSections] = React.useState<string[]>([]);
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);

  const handleLogout = async () => {
    try {
      await authService.logout();
      toast.success("Đăng xuất thành công", {
        description: "Hẹn gặp lại bạn sớm!",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      logoutAction();
      router.push("/login");
    }
  };

  const isMenuItemActive = (item: MenuItem) => {
    if (
      item.url &&
      (pathname === item.url || pathname.startsWith(`${item.url}/`))
    ) {
      return true;
    }

    if (item.children) {
      return item.children.some(
        (child) =>
          child.url &&
          (pathname === child.url || pathname.startsWith(`${child.url}/`)),
      );
    }

    return false;
  };

  const isItemExpanded = (item: MenuItem) => {
    if (openSections.includes(item.title)) {
      return true;
    }

    return item.children
      ? item.children.some(
          (child) =>
            child.url &&
            (pathname === child.url || pathname.startsWith(`${child.url}/`)),
        )
      : false;
  };

  const toggleItem = (title: string) => {
    setOpenSections((prev) =>
      prev.includes(title)
        ? prev.filter((name) => name !== title)
        : [...prev, title],
    );
  };

  const isGroupActive = (group: (typeof adminMenu)[number]) =>
    group.items.some(isMenuItemActive);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="h-16 flex items-center justify-center border-b">
        <Link
          href="/"
          className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <UtensilsCrossed className="size-4" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
            <span className="font-semibold text-base">NutriLife</span>
            <span className="text-xs text-muted-foreground">Bảng quản trị</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {adminMenu.map((group) => {
          const groupActive = isGroupActive(group);

          return (
            <SidebarGroup
              key={group.groupName}
              className={cn(groupActive && "rounded-2xl bg-sidebar-accent/10")}
            >
              <SidebarGroupLabel
                className={cn(groupActive && "text-sidebar-accent-foreground")}
              >
                {group.groupName}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => {
                    const active = isMenuItemActive(item);
                    const expanded = item.children
                      ? isItemExpanded(item)
                      : false;

                    if (!item.children?.length) {
                      return (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton
                            asChild
                            isActive={active}
                            tooltip={item.title}
                          >
                            <Link href={item.url ?? "#"}>
                              <item.icon className="h-4 w-4" />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    }

                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          type="button"
                          isActive={active}
                          onClick={() => toggleItem(item.title)}
                          className={cn(
                            "justify-between",
                            active &&
                              "bg-sidebar-accent/10 text-sidebar-accent-foreground",
                          )}
                          aria-expanded={expanded}
                        >
                          <span className="flex items-center gap-2">
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </span>
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 shrink-0 transition-transform duration-200",
                              expanded && "rotate-180",
                            )}
                          />
                        </SidebarMenuButton>
                        {expanded ? (
                          <SidebarMenuSub>
                            {item.children.map((child) => {
                              const childActive = !!(
                                child.url &&
                                (pathname === child.url ||
                                  pathname.startsWith(`${child.url}/`))
                              );

                              return (
                                <SidebarMenuSubItem key={child.title}>
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={childActive}
                                  >
                                    <Link
                                      href={child.url ?? "#"}
                                      className="flex items-center gap-2"
                                    >
                                      <child.icon className="h-3.5 w-3.5" />
                                      <span>{child.title}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              );
                            })}
                          </SidebarMenuSub>
                        ) : null}
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>
      <SidebarSeparator />

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={user?.avatarUrl || "/avatar.jpg"}
                      alt={user?.fullName || "Admin"}
                    />
                    <AvatarFallback className="rounded-lg">
                      {user?.fullName?.charAt(0).toUpperCase() || (
                        <User2 className="h-4 w-4" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-1 leading-none group-data-[collapsible=icon]:hidden">
                    <span className="font-semibold truncate max-w-[150px]">
                      {user?.fullName || "Quản trị viên"}
                    </span>
                    <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                      {user?.email || "admin@aifood.vn"}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto h-4 w-4 group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side={isMobile ? "bottom" : "right"}
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={user?.avatarUrl || "/avatar.jpg"}
                        alt={user?.fullName || "Admin"}
                      />
                      <AvatarFallback className="rounded-lg">
                        {user?.fullName?.charAt(0).toUpperCase() || (
                          <User2 className="h-4 w-4" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1 leading-none">
                      <span className="font-semibold">
                        {user?.fullName || "Quản trị viên"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {user?.email || "admin@aifood.vn"}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Sparkles className="mr-2 h-4 w-4" />
                    <span>Nâng cấp Pro</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <BadgeCheck className="mr-2 h-4 w-4" />
                    <span>Tài khoản</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Thanh toán</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell className="mr-2 h-4 w-4" />
                    <span>Thông báo</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setShowLogoutConfirm(true)}
                  className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Đăng xuất</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận đăng xuất?</AlertDialogTitle>
            <AlertDialogDescription>
              Phiên làm việc của bạn sẽ kết thúc. Bạn sẽ cần đăng nhập lại để
              tiếp tục truy cập trang quản trị.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="bg-destructive hover:bg-destructive/90 text-white"
            >
              Đăng xuất
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sidebar>
  );
}
