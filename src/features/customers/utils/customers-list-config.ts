import type { Customer, CustomerMetricFilter, ServicePackage } from "@/features/customers/types";

export const PAGE_SIZE_OPTIONS = [5, 10, 25, 50] as const;
export type PageSizeOption = (typeof PAGE_SIZE_OPTIONS)[number];

/** Initial `_per_page` for the first customers list request (matches json-server default). */
export const DEFAULT_CUSTOMER_PAGE_SIZE: PageSizeOption = 5;

export const SERVICE_TIER_LABEL: Record<ServicePackage, string> = {
  premium: "Business Pro",
  standard: "Standard Fiber",
  basic: "Home Essential",
};

export const CUSTOMERS_TABLE_SORTABLE: { key: keyof Customer; label: string }[] = [
  { key: "fullName", label: "Subscriber" },
  { key: "servicePackage", label: "Service Tier" },
  { key: "status", label: "Status" },
  { key: "contractEndDate", label: "Contract end date" },
  { key: "lastPaymentDate", label: "Last payment date" },
  { key: "downloadSpeed", label: "24h Usage" },
];

export const METRIC_SECTION_TITLE: Record<CustomerMetricFilter, string> = {
  all: "All Subscribers",
  active: "Active Subscribers",
  suspended: "Suspended Accounts",
  overdue: "Overdue Billing",
};
