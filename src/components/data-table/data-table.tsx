"use client";

import * as React from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  type Updater,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type PaginationState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  filterableColumns?: {
    id: string;
    title: string;
    options: { label: string; value: string }[];
  }[];
  pageCount?: number;
  rowCount?: number;
  pagination?: PaginationState;
  setPagination?: React.Dispatch<React.SetStateAction<PaginationState>>;
  toolbarActions?: React.ReactNode;
  meta?: any;
  defaultColumnVisibility?: VisibilityState;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Tìm kiếm...",
  filterableColumns = [],
  pageCount,
  rowCount,
  pagination: controlledPagination,
  setPagination: setControlledPagination,
  toolbarActions,
  meta,
  defaultColumnVisibility = {},
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(defaultColumnVisibility);
  const [rowSelection, setRowSelection] = React.useState({});
  const [internalPagination, setInternalPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const isManual = controlledPagination !== undefined;
  const activePagination = controlledPagination ?? internalPagination;
  const activeSetPagination = setControlledPagination ?? setInternalPagination;

  /**
   * Server-side page total: prefer explicit `pageCount` from API (e.g. meta.pages)
   * over ceil(rowCount/pageSize), since some backends return total/pages fields
   * that do not match and would wrongly cap navigation (e.g. cannot open page 3).
   */
  const resolvedPageCount = React.useMemo(() => {
    if (!isManual) return pageCount ?? -1;
    if (pageCount != null && pageCount > 0) return pageCount;
    if (rowCount != null && rowCount > 0) {
      return Math.ceil(rowCount / activePagination.pageSize);
    }
    if (rowCount === 0) return 0;
    return pageCount ?? -1;
  }, [
    isManual,
    pageCount,
    rowCount,
    activePagination.pageSize,
  ]);

  /**
   * In MANUAL (server-side) mode:
   *   - onPaginationChange is a no-op. TanStack Table cannot modify the external
   *     pagination state at all (no auto-reset risk).
   *   - Page navigation is handled by explicit handlePageChange / handlePageSizeChange
   *     which are passed as direct props to DataTablePagination.
   *
   * In CLIENT-SIDE mode:
   *   - onPaginationChange updates the internal state as normal.
   */
  const handlePaginationChange = React.useCallback(
    (updater: Updater<PaginationState>) => {
      if (!isManual) {
        // Client-side: apply the updater to internal pagination state
        setInternalPagination(
          (typeof updater === "function"
            ? updater
            : () => updater) as React.SetStateAction<PaginationState>
        );
      }
      // Manual/server-side: intentional no-op.
      // TanStack must NOT be able to reset our external pageIndex.
    },
    [isManual]
  );

  /** Called by DataTablePagination buttons (manual mode only) */
  const handlePageChange = React.useCallback(
    (newPageIndex: number) => {
      activeSetPagination((prev) => ({ ...prev, pageIndex: newPageIndex }));
    },
    [activeSetPagination]
  );

  /** Called by DataTablePagination page-size selector (manual mode only) */
  const handlePageSizeChange = React.useCallback(
    (newPageSize: number) => {
      activeSetPagination({ pageIndex: 0, pageSize: newPageSize });
    },
    [activeSetPagination]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: activePagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: handlePaginationChange,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // getPaginationRowModel is only needed for client-side pagination.
    // In manual mode the server already returns a single page of data.
    ...(!isManual && { getPaginationRowModel: getPaginationRowModel() }),
    getSortedRowModel: getSortedRowModel(),
    pageCount: resolvedPageCount,
    rowCount: rowCount,
    manualPagination: isManual,
    autoResetPageIndex: false,
    meta,
  });

  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        columnVisibility={columnVisibility}
        searchKey={searchKey}
        searchPlaceholder={searchPlaceholder}
        filterableColumns={filterableColumns}
        toolbarActions={toolbarActions}
      />
      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  Không có dữ liệu.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination
        table={table}
        rowCount={rowCount}
        pageCount={isManual ? resolvedPageCount : undefined}
        // Pass explicit controlled values in manual mode so the pagination
        // component reads from the parent state, not TanStack's internal state.
        pageIndex={isManual ? activePagination.pageIndex : undefined}
        pageSize={isManual ? activePagination.pageSize : undefined}
        onPageChange={isManual ? handlePageChange : undefined}
        onPageSizeChange={isManual ? handlePageSizeChange : undefined}
      />
    </div>
  );
}
