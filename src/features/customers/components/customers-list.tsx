import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import { useCustomerOverviewStats, useCustomers } from "../api/get-customers";
import type { Customer, CustomerMetricFilter } from "../types";
import { formatTableDate } from "../utils/customer-table-format";
import {
  CUSTOMERS_TABLE_SORTABLE,
  DEFAULT_CUSTOMER_PAGE_SIZE,
  METRIC_SECTION_TITLE,
  PAGE_SIZE_OPTIONS,
  type PageSizeOption,
  SERVICE_TIER_LABEL,
} from "../utils/customers-list-config";
import { SubscriberMetricCards } from "./customer-stats-cards";
import {
  CustomersTableStatusBadge,
  CustomersTableSubscriberCell,
  CustomersTableUsageBar,
} from "./customers-table-cells";

export const CustomersList = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<PageSizeOption>(DEFAULT_CUSTOMER_PAGE_SIZE);
  const [metricFilter, setMetricFilter] = useState<CustomerMetricFilter>("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortField, setSortField] = useState<keyof Customer>("fullName");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const overviewQuery = useCustomerOverviewStats();

  const debouncedSetSearch = useDebouncedCallback((value: string) => {
    setDebouncedSearch(value);
    setPage(1);
  }, 500);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    debouncedSetSearch(value);
  };

  const handleSort = (field: keyof Customer) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setPage(1);
  };

  const customersQuery = useCustomers({
    page,
    limit: pageSize,
    search: debouncedSearch || undefined,
    sortBy: sortField,
    sortOrder: sortDirection,
    metricFilter,
  });

  const handlePageSizeChange = (value: string) => {
    const n = Number(value);
    if (!PAGE_SIZE_OPTIONS.includes(n as PageSizeOption)) return;
    setPageSize(n as PageSizeOption);
    setPage(1);
  };

  const totalPages = customersQuery.data?.pages;
  useEffect(() => {
    if (totalPages !== undefined && page > totalPages) {
      setPage(totalPages);
    }
  }, [totalPages, page]);

  if (customersQuery.isError) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 rounded-2xl border border-[#dbdddd]/40 bg-white p-8 text-center shadow-sm">
        <p className="font-editorial text-lg font-medium text-[#b31b25]">
          {customersQuery.error?.message ?? "Failed to load subscribers"}
        </p>
        <Button variant="outline" onClick={() => customersQuery.refetch()}>
          Try Again
        </Button>
      </div>
    );
  }

  const rows = customersQuery.data?.data ?? [];

  return (
    <div className="space-y-12 px-4 pb-16 pt-2 sm:px-6 md:space-y-16 md:px-8">
      <section className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-[#0c0f0f] p-8 text-white md:p-12">
        <div className="absolute right-0 top-0 h-full w-1/2 opacity-30">
          <div className="h-full w-full translate-x-1/4 -translate-y-1/4 bg-gradient-to-bl from-[#00618f] to-[#4cb9ff] blur-3xl" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <h2 className="mb-6 font-editorial-serif text-4xl font-normal leading-tight md:text-5xl">
            Customer Intelligence
          </h2>
          <p className="font-editorial text-lg leading-relaxed text-neutral-400">
            A unified view of acquisition, lifecycle, and revenue health across your subscriber
            base. Segment by connectivity status and billing risk, drill into tier mix and usage
            patterns, and keep field teams aligned with the same live counts you see in network
            operations—so customer experience and infrastructure stay in sync.
          </p>
        </div>
      </section>

      <SubscriberMetricCards
        overviewQuery={overviewQuery}
        selected={metricFilter}
        onSelect={(next) => {
          setMetricFilter(next);
          setPage(1);
        }}
      />

      <section className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-2xl border border-[#dbdddd]/20 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-[#dbdddd]/20 bg-[#f6f6f6] p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-4">
              <h2 className="font-editorial-serif text-2xl text-[#0c0f0f]">
                {METRIC_SECTION_TITLE[metricFilter]}
              </h2>
            </div>
            <div className="relative w-full sm:max-w-xs">
              <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 !text-lg -translate-y-1/2 text-[#5a5c5c]">
                search
              </span>
              <input
                type="search"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search subscribers…"
                className="w-full rounded-full border-none bg-[#f0f1f1] py-2 pl-10 pr-4 font-editorial text-sm text-[#2d2f2f] placeholder:text-[#5a5c5c]/70 focus:outline-none focus:ring-1 focus:ring-[#acadad]/30"
              />
            </div>
          </div>

          <div className="max-h-[500px] overflow-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="sticky top-0 z-[1] border-b border-[#dbdddd] bg-[#f0f1f1] shadow-[0_1px_0_0_#dbdddd]">
                  {CUSTOMERS_TABLE_SORTABLE.map(({ key, label }) => (
                    <th key={key} className="bg-[#f0f1f1] px-6 py-4">
                      <button
                        type="button"
                        onClick={() => handleSort(key)}
                        className="flex items-center gap-1 font-editorial text-xs font-bold uppercase tracking-wider text-[#5a5c5c] transition-colors hover:text-[#2d2f2f]"
                      >
                        {label}
                        {sortField === key ? (
                          <span className="material-symbols-outlined !text-base">
                            {sortDirection === "asc" ? "arrow_upward" : "arrow_downward"}
                          </span>
                        ) : null}
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dbdddd]/10 font-editorial text-sm">
                {customersQuery.isLoading ? (
                  <tr>
                    <td colSpan={6} className="h-64">
                      <div className="flex items-center justify-center">
                        <Spinner size="lg" />
                      </div>
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="h-64 text-center text-[#5a5c5c]">
                      No subscribers match your search.
                    </td>
                  </tr>
                ) : (
                  rows.map((entry) => (
                    <tr key={entry.id} className="transition-colors hover:bg-[#f0f1f1]/30">
                      <td className="px-6 py-4">
                        <CustomersTableSubscriberCell customer={entry} />
                      </td>
                      <td className="px-6 py-4 text-[#2d2f2f]">
                        {SERVICE_TIER_LABEL[entry.servicePackage]}
                      </td>
                      <td className="px-6 py-4">
                        <CustomersTableStatusBadge status={entry.status} />
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-[#5a5c5c]">
                        {formatTableDate(entry.contractEndDate)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-[#5a5c5c]">
                        {formatTableDate(entry.lastPaymentDate)}
                      </td>
                      <td className="px-6 py-4">
                        <CustomersTableUsageBar customer={entry} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {customersQuery.data ? (
            <div className="flex flex-col gap-4 border-t border-[#dbdddd]/20 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-8">
                <p className="font-editorial text-sm text-[#5a5c5c]">
                  {customersQuery.data.pages > 1 ? (
                    <>
                      Page {page} of {customersQuery.data.pages}
                      <span className="text-[#acadad]"> · </span>
                    </>
                  ) : null}
                  {customersQuery.data.items} {customersQuery.data.items === 1 ? "item" : "items"}
                </p>
                <label className="flex items-center gap-2 font-editorial text-sm text-[#5a5c5c]">
                  <span className="whitespace-nowrap font-semibold text-[#2d2f2f]">
                    Rows per page
                  </span>
                  <select
                    value={pageSize}
                    onChange={(e) => handlePageSizeChange(e.target.value)}
                    className="min-w-[4.5rem] cursor-pointer rounded-lg border border-[#acadad]/30 bg-white py-2 pl-3 pr-8 font-editorial text-sm text-[#2d2f2f] shadow-sm focus:border-[#6b1ef3]/40 focus:outline-none focus:ring-2 focus:ring-[#6b1ef3]/15"
                    aria-label="Rows per page"
                  >
                    {PAGE_SIZE_OPTIONS.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              {customersQuery.data.pages > 1 ? (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#acadad]/30 font-editorial"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#acadad]/30 font-editorial"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page >= customersQuery.data.pages}
                  >
                    Next
                  </Button>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
};
