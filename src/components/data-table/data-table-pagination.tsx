"use client";

import { type Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  rowCount?: number;
  /**
   * Total pages (manual/server). When set, used for next/prev and "Trang x / y"
   * instead of only Math.ceil(rowCount / pageSize), so API `meta.pages` is respected.
   */
  pageCount?: number;
  /**
   * Controlled page index (0-based) for server-side (manual) pagination.
   * When provided, the component reads this value instead of table state.
   */
  pageIndex?: number;
  /**
   * Controlled page size for server-side (manual) pagination.
   */
  pageSize?: number;
  /**
   * Direct callback for page navigation in server-side mode.
   * Receives the new 0-based page index.
   */
  onPageChange?: (pageIndex: number) => void;
  /**
   * Direct callback for page size change in server-side mode.
   */
  onPageSizeChange?: (pageSize: number) => void;
}

export function DataTablePagination<TData>({
  table,
  rowCount,
  pageCount: controlledPageCount,
  pageIndex: controlledPageIndex,
  pageSize: controlledPageSize,
  onPageChange,
  onPageSizeChange,
}: DataTablePaginationProps<TData>) {
  // Prefer controlled values (manual/server-side mode); fall back to table state
  const pageIndex = controlledPageIndex ?? table.getState().pagination.pageIndex;
  const pageSize = controlledPageSize ?? table.getState().pagination.pageSize;

  const totalRows = rowCount ?? table.getFilteredRowModel().rows.length;
  const actualPageCount =
    controlledPageCount !== undefined && controlledPageCount >= 0
      ? controlledPageCount
      : rowCount
        ? Math.ceil(rowCount / pageSize)
        : table.getPageCount();

  const canPreviousPage = pageIndex > 0;
  const canNextPage = pageIndex < actualPageCount - 1;

  /** Navigate to a specific page */
  const goToPage = (newPageIndex: number) => {
    if (onPageChange) {
      // Server-side: call parent directly, bypass TanStack
      onPageChange(newPageIndex);
    } else {
      // Client-side: use TanStack's API
      table.setPageIndex(newPageIndex);
    }
  };

  /** Change the page size */
  const changePageSize = (newPageSize: number) => {
    if (onPageSizeChange) {
      // Server-side: call parent directly
      onPageSizeChange(newPageSize);
    } else {
      // Client-side: use TanStack's API
      table.setPageSize(newPageSize);
    }
  };

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length > 0 ? (
          <span>
            Đã chọn {table.getFilteredSelectedRowModel().rows.length} /{" "}
            {totalRows} dòng.
          </span>
        ) : (
          <span>Tổng: {totalRows} mục</span>
        )}
      </div>

      <div className="flex items-center gap-6 lg:gap-8">
        {/* Page size selector */}
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">Dòng/trang</p>
          <select
            className="h-8 rounded-lg border border-input bg-transparent px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            value={pageSize}
            onChange={(e) => changePageSize(Number(e.target.value))}
          >
            {[10, 20, 30, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        {/* Page indicator */}
        <div className="flex items-center justify-center text-sm font-medium">
          Trang {pageIndex + 1} / {actualPageCount}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => goToPage(0)}
            disabled={!canPreviousPage}
            aria-label="Trang đầu"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => goToPage(pageIndex - 1)}
            disabled={!canPreviousPage}
            aria-label="Trang trước"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => goToPage(pageIndex + 1)}
            disabled={!canNextPage}
            aria-label="Trang sau"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => goToPage(actualPageCount - 1)}
            disabled={!canNextPage}
            aria-label="Trang cuối"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
