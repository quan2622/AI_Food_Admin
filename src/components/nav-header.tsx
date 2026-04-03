"use client";

import { usePathname } from "next/navigation";
import { adminMenu } from "../lib/menu";
import React from "react";

export function NavHeader() {
  const pathname = usePathname();

  const findTitle = () => {
    // Exact match
    for (const group of adminMenu) {
      for (const item of group.items) {
        if (item.url === pathname) return { title: item.title, parent: group.groupName };
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

  return (
    <div className="flex items-center gap-2">
      {info?.group && (
        <span className="text-sm text-muted-foreground hidden md:inline-block">
          {info.group} /
        </span>
      )}
      {info?.parent && (
        <span className="text-sm text-muted-foreground hidden md:inline-block">
          {info.parent} /
        </span>
      )}
      <span className="font-semibold text-sm">
        {info?.title ?? (pathname === "/" ? "Dashboard" : "AI Food Portal")}
      </span>
    </div>
  );
}
