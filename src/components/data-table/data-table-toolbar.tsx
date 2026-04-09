"use client";

import * as React from "react";
import { type Table, type VisibilityState, type Header } from "@tanstack/react-table";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchKey?: string;
  searchPlaceholder?: string;
  columnVisibility: VisibilityState;
  filterableColumns?: {
    id: string;
    title: string;
    options: { label: string; value: string }[];
  }[];
  toolbarActions?: React.ReactNode;
}

export function DataTableToolbar<TData>({
  table,
  columnVisibility,
  searchKey,
  searchPlaceholder = "Tìm kiếm...",
  filterableColumns = [],
  toolbarActions,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex flex-1 items-center gap-2">
        {searchKey && (
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={
                (table.getColumn(searchKey)?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn(searchKey)?.setFilterValue(event.target.value)
              }
              className="pl-8"
            />
          </div>
        )}
        {filterableColumns.map((column) => {
          const tableColumn = table.getColumn(column.id);
          if (!tableColumn) return null;
          const filterValue = tableColumn.getFilterValue() as string;
          return (
            <Select
              key={column.id}
              value={filterValue ?? "all"}
              onValueChange={(value) =>
                tableColumn.setFilterValue(value === "all" ? undefined : value)
              }
            >
              <SelectTrigger className="w-[180px] truncate">
                <SelectValue placeholder={column.title} className="truncate" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả {column.title.toLowerCase()}</SelectItem>
                {column.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        })}
        {isFiltered && (
          <Button
            variant="ghost"
            size="default"
            onClick={() => table.resetColumnFilters()}
            className="px-2 h-8 lg:px-3 font-normal"
          >
            Xóa bộ lọc
            <X className="ml-1 h-4 w-4" />
          </Button>
        )}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="default" className="h-8">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Hiển thị cột
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Bật/tắt cột</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {table
            .getAllColumns()
            .filter(
              (column) =>
                typeof column.accessorFn !== "undefined" && column.getCanHide(),
            )
            .map((column) => {
              const isVisible = columnVisibility[column.id] !== false;
              const header = column.columnDef.header;
              let title = column.id;

              if (typeof header === "string") {
                title = header;
              } else if (typeof header === "function") {
                try {
                  const rendered = header({
                    column,
                    table,
                    header: {} as unknown as Header<TData, unknown>,
                  }) as React.ReactElement<{ title?: string }>;

                  if (rendered && rendered.props?.title) {
                    title = rendered.props.title;
                  }
                } catch {
                  // Fallback to ID
                }
              }

              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={isVisible}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  onSelect={(e) => e.preventDefault()}
                >
                  {title.replace(/([A-Z])/g, " $1").trim()}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
      {toolbarActions && <div>{toolbarActions}</div>}
    </div>
  );
}
