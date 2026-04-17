"use client";

import { usePathname } from "next/navigation";
import { adminMenu } from "../lib/menu";
import React from "react";
import { ChevronRight } from "lucide-react";

export function NavHeader() {
  const pathname = usePathname();

  const findTitle = () => {
    // Exact match
    for (const group of adminMenu) {
      for (const item of group.items) {
        if (item.url === pathname) return { title: item.title, parent: group.groupName === item.title ? null : group.groupName };
        if (item.children) {
          for (const child of item.children) {
            if (child.url === pathname) return { title: child.title, parent: item.title, group: group.groupName };
          }
        }
      }
    }
    return null;
  };

  const info = findTitle();
  const Sep = () => <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50 flex-shrink-0" />;

  return (
    <div className="flex items-center gap-1.5">
      {info?.group && (
        <>
          <span className="text-sm text-muted-foreground hidden md:inline-block">
            {info.group}
          </span>
          <Sep />
        </>
      )}
      {info?.parent && (
        <>
          <span className="text-sm text-muted-foreground hidden md:inline-block">
            {info.parent}
          </span>
          <Sep />
        </>
      )}
      <span className="font-semibold text-sm text-foreground">
        {info?.title ?? (pathname === "/" ? "Tổng quan" : "Cổng quản trị AI Food")}
      </span>
    </div>
  );
}
