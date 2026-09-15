import { useMemo, useState, type ReactNode } from "react";
import {
  columnFilteringFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFns,
  flexRender,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
  useTable,
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
  columnVisibilityFeature,
  columnSizingFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns,
  sortFns,
});

type Features = typeof features;

export type ImportTableRow = {
  id: string;
  rowNumber: number;
  cells: string[];
  /** Soft highlight for invalid / rejected rows */
  tone?: "invalid" | "default";
  statusLabel?: string;
};

function displayCell(value: string | null | undefined): string {
  if (value == null) return "—";
  const text = String(value);
  return text.trim() === "" ? "—" : text;
}

function ColumnFilter({
  column,
}: {
  column: Column<Features, ImportTableRow, unknown>;
}) {
  const value = (column.getFilterValue() as string | undefined) ?? "";
  return (
    <Input
      value={value}
      onChange={(e) => column.setFilterValue(e.target.value || undefined)}
      placeholder="Filter…"
      className="h-8 px-2 text-xs"
      onClick={(e) => e.stopPropagation()}
    />
  );
}

function SortIcon({
  sorted,
}: {
  sorted: false | "asc" | "desc";
}) {
  if (sorted === "asc") return <ArrowUp className="h-3.5 w-3.5 shrink-0" />;
  if (sorted === "desc") return <ArrowDown className="h-3.5 w-3.5 shrink-0" />;
  return <ArrowUpDown className="h-3.5 w-3.5 shrink-0 opacity-40" />;
}

type Props = {
  headers: string[];
  rows: ImportTableRow[];
  statusHeader?: string;
  maxHeightClassName?: string;
  emptyMessage?: string;
  className?: string;
  /** Extra controls under pagination (e.g. load more from server) */
  footerExtra?: ReactNode;
  pageSize?: number;
};

/**
 * Spreadsheet-style import grid: global search, per-column filters,
 * sortable headers, and client-side pagination. Cells are plain text.
 */
export function ImportDataTable({
  headers,
  rows,
  statusHeader,
  maxHeightClassName = "max-h-[min(55vh,32rem)]",
  emptyMessage = "No rows to show.",
  className,
  footerExtra,
  pageSize: initialPageSize = 25,
}: Props) {
  const showStatus = Boolean(statusHeader);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  });

  const columns = useMemo<ColumnDef<Features, ImportTableRow>[]>(() => {
    const cols: ColumnDef<Features, ImportTableRow>[] = [
      {
        id: "rowNumber",
        accessorFn: (row) => row.rowNumber,
        header: "#",
        size: 64,
        cell: ({ getValue }) => (
          <span className="tabular-nums text-muted-foreground">
            {String(getValue())}
          </span>
        ),
        filterFn: "includesString",
      },
    ];

    if (showStatus) {
      cols.push({
        id: "status",
        accessorFn: (row) => row.statusLabel ?? "",
        header: statusHeader ?? "Status",
        size: 110,
        cell: ({ row }) => {
          const label = row.original.statusLabel ?? "—";
          const invalid = row.original.tone === "invalid";
          return (
            <Badge variant={invalid ? "destructive" : "outline"}>{label}</Badge>
          );
        },
        filterFn: "includesString",
      });
    }

    headers.forEach((header, index) => {
      cols.push({
        id: `col-${index}-${header}`,
        accessorFn: (row) => row.cells[index] ?? "",
        header,
        cell: ({ getValue }) => (
          <span className="whitespace-pre-wrap break-words">
            {displayCell(getValue() as string)}
          </span>
        ),
        filterFn: "includesString",
      });
    });

    return cols;
  }, [headers, showStatus, statusHeader]);

  const table = useTable({
    features,
    data: rows,
    columns,
    getRowId: (row) => row.id,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
  });

  if (rows.length === 0) {
    return (
      <p className="rounded-lg border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </p>
    );
  }

  const filteredCount = table.getFilteredRowModel().rows.length;
  const pageCount = table.getPageCount();
  const pageIndex = pagination.pageIndex;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={globalFilter}
          onChange={(e) => {
            setGlobalFilter(e.target.value);
            setPagination((p) => ({ ...p, pageIndex: 0 }));
          }}
          placeholder="Search loaded rows…"
          className="h-9 pl-8 text-sm"
        />
      </div>

      <div
        className={cn(
          "overflow-auto rounded-lg border bg-background shadow-sm",
          maxHeightClassName,
        )}
      >
        <table className="w-full min-w-max border-collapse text-left text-[13px] leading-snug">
          <thead className="sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="border-b bg-muted/90 backdrop-blur-sm"
              >
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();
                  return (
                    <th
                      key={header.id}
                      className="align-bottom first:pl-4 last:pr-4"
                      style={{
                        width: header.getSize(),
                        minWidth:
                          header.column.id === "rowNumber"
                            ? 56
                            : header.column.id === "status"
                              ? 100
                              : 140,
                      }}
                    >
                      <div className="space-y-1.5 px-2 py-2">
                        {header.isPlaceholder ? null : canSort ? (
                          <button
                            type="button"
                            className={cn(
                              "flex w-full items-center gap-1.5 text-left font-medium text-muted-foreground",
                              "hover:text-foreground",
                              sorted && "text-foreground",
                            )}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            <span className="truncate">
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                            </span>
                            <SortIcon sorted={sorted} />
                          </button>
                        ) : (
                          <span className="font-medium text-muted-foreground">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                          </span>
                        )}
                        {header.column.getCanFilter() ? (
                          <ColumnFilter column={header.column} />
                        ) : null}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-10 text-center text-sm text-muted-foreground"
                >
                  No rows match this search or filter.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={cn(
                    "border-b border-border/60 last:border-0",
                    "odd:bg-background even:bg-muted/25",
                    "hover:bg-muted/40",
                    row.original.tone === "invalid" &&
                      "bg-destructive/[0.06] even:bg-destructive/[0.08] hover:bg-destructive/[0.1]",
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="max-w-[18rem] px-3 py-2 align-top first:pl-4 last:pr-4"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span>
          {filteredCount === rows.length
            ? `${rows.length} row${rows.length === 1 ? "" : "s"}`
            : `${filteredCount} of ${rows.length} rows`}
          {pageCount > 1
            ? ` · page ${pageIndex + 1} of ${pageCount}`
            : null}
        </span>
        <div className="ml-auto flex flex-wrap items-center gap-1.5">
          <label className="flex items-center gap-1.5">
            <span className="sr-only">Rows per page</span>
            <select
              className="h-8 rounded-md border bg-background px-2 text-xs"
              value={pagination.pageSize}
              onChange={(e) =>
                setPagination({
                  pageIndex: 0,
                  pageSize: Number(e.target.value),
                })
              }
            >
              {[10, 25, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n} / page
                </option>
              ))}
            </select>
          </label>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-8"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            Previous
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-8"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      {footerExtra ? <div>{footerExtra}</div> : null}
    </div>
  );
}
