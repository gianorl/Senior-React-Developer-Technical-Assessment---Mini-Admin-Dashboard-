import { ArchiveX, ArrowUpDown, ChevronLeft, ChevronRight, Search } from "lucide-react";
import type * as React from "react";

import { cn } from "@/utils/cn";

import { Button } from "../button";
import { Spinner } from "../spinner";

type SortDirection = "asc" | "desc";

export type ColumnDef<Entry> = {
  title: string;
  field: keyof Entry;
  sortable?: boolean;
  Cell?: ({ entry }: { entry: Entry }) => React.ReactElement;
};

export type DataTableProps<Entry extends { id: string }> = {
  data: Entry[];
  columns: ColumnDef<Entry>[];
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    onPageChange: (page: number) => void;
  };
  search?: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  };
  sort?: {
    field: string;
    direction: SortDirection;
    onSort: (field: string) => void;
  };
};

export function DataTable<Entry extends { id: string }>({
  data,
  columns,
  isLoading,
  isError,
  errorMessage,
  onRetry,
  pagination,
  search,
  sort,
}: DataTableProps<Entry>) {
  if (isError) {
    return (
      <div className="flex h-80 flex-col items-center justify-center gap-4 rounded-lg border bg-white text-gray-500">
        <p className="text-lg font-medium text-red-500">{errorMessage || "Failed to load data"}</p>
        {onRetry && (
          <Button variant="outline" onClick={onRetry}>
            Try Again
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {search && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search.value}
            onChange={(e) => search.onChange(e.target.value)}
            placeholder={search.placeholder || "Search..."}
            className="flex h-10 w-full max-w-sm rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      )}

      <div className="relative w-full overflow-auto rounded-lg border">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            <tr className="border-b transition-colors hover:bg-muted/50">
              {columns.map((column) => (
                <th
                  key={String(column.field)}
                  className={cn(
                    "h-10 px-4 text-left align-middle font-medium text-muted-foreground",
                    column.sortable && "cursor-pointer select-none hover:text-foreground"
                  )}
                  onClick={() => {
                    if (column.sortable && sort) {
                      sort.onSort(String(column.field));
                    }
                  }}
                >
                  <div className="flex items-center gap-2">
                    {column.title}
                    {column.sortable && sort && (
                      <ArrowUpDown
                        className={cn(
                          "size-4",
                          sort.field === String(column.field)
                            ? "text-foreground"
                            : "text-muted-foreground/50"
                        )}
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="h-80">
                  <div className="flex items-center justify-center">
                    <Spinner size="lg" />
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="h-80">
                  <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
                    <ArchiveX className="size-16" />
                    <h4 className="text-lg font-medium">No Entries Found</h4>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((entry) => (
                <tr key={entry.id} className="border-b transition-colors hover:bg-muted/50">
                  {columns.map(({ Cell, field, title }) => (
                    <td key={`${entry.id}-${title}`} className="p-4 align-middle">
                      {Cell ? <Cell entry={entry} /> : String(entry[field])}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <p className="text-sm text-muted-foreground">
            {`Page ${pagination.currentPage} of ${pagination.totalPages} (${pagination.totalItems} items)`}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage <= 1}
            >
              <ChevronLeft className="size-4" />
              <span>Previous</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage >= pagination.totalPages}
            >
              <span>Next</span>
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
