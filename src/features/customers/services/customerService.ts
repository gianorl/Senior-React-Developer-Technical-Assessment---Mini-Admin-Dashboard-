import { env } from "@/config/env";
import { api } from "@/lib/api-client";
import type { PaginatedResponse } from "@/types/api";

import type { Customer, CustomerQueryParams, ServicePackage } from "../types";

/** Large page to load all customers for dashboard aggregates (json-server). */
const OVERVIEW_FETCH_PER_PAGE = "500";

/** Artificial latency after each customer API call (override with `VITE_APP_MOCK_DELAY` ms). */
const DEFAULT_API_LATENCY_MS = 1200;

function customerApiDelay(): Promise<void> {
  const ms = env.MOCK_DELAY ?? DEFAULT_API_LATENCY_MS;
  return new Promise((r) => setTimeout(r, ms));
}

function buildCustomerWhereClause(params: CustomerQueryParams): Record<string, unknown> | null {
  const q = params.search?.trim();
  const metric = params.metricFilter;

  const metricClause: Record<string, unknown> | null =
    metric === "active"
      ? { status: { eq: "active" } }
      : metric === "suspended"
        ? { status: { eq: "suspended" } }
        : metric === "overdue"
          ? { paymentStatus: { eq: "overdue" } }
          : null;

  if (!q && !metricClause) return null;

  if (!q && metricClause) return metricClause;

  if (q && !metricClause) {
    return {
      or: [
        { fullName: { contains: q } },
        { email: { contains: q } },
        { customerId: { contains: q } },
        { phone: { contains: q } },
      ],
    };
  }

  if (!q || !metricClause) return null;

  const merge = (field: Record<string, unknown>) => ({ ...field, ...metricClause });
  return {
    or: [
      merge({ fullName: { contains: q } }),
      merge({ email: { contains: q } }),
      merge({ customerId: { contains: q } }),
      merge({ phone: { contains: q } }),
    ],
  };
}

function buildCustomerListParams(params: CustomerQueryParams): Record<string, string> {
  const { page, limit, sortBy = "fullName", sortOrder = "asc" } = params;
  const queryParams: Record<string, string> = {
    _page: String(page),
    _per_page: String(limit),
  };

  const sortKey = String(sortBy);
  queryParams._sort = sortOrder === "desc" ? `-${sortKey}` : sortKey;

  const where = buildCustomerWhereClause(params);
  if (where) {
    queryParams._where = JSON.stringify(where);
  }

  return queryParams;
}

export async function fetchCustomers(
  params: CustomerQueryParams
): Promise<PaginatedResponse<Customer>> {
  await customerApiDelay();
  return api<PaginatedResponse<Customer>>("/customers", {
    params: buildCustomerListParams(params),
  });
}

export type CustomerOverviewStats = {
  totalCustomers: number;
  activeConnections: number;
  suspendedCount: number;
  inactiveCount: number;
  activeThroughputMbps: number;
  revenueMtd: number;
  overdueAccounts: number;
  billingCollectionRate: number;
  recentSubscribers: Customer[];
  packageMix: { package: ServicePackage; count: number; percent: number }[];
  churnRiskCount: number;
};

function monthKey(iso: string): string {
  return iso.slice(0, 7);
}

export async function fetchCustomerOverviewStats(): Promise<CustomerOverviewStats> {
  await customerApiDelay();
  const res = await api<PaginatedResponse<Customer>>("/customers", {
    params: { _page: "1", _per_page: OVERVIEW_FETCH_PER_PAGE },
  });
  const all = res.data;

  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const totalCustomers = all.length;
  const activeConnections = all.filter((c) => c.status === "active").length;
  const suspendedCount = all.filter((c) => c.status === "suspended").length;
  const inactiveCount = all.filter((c) => c.status === "inactive").length;
  const activeThroughputMbps = all
    .filter((c) => c.status === "active")
    .reduce((sum, c) => sum + c.downloadSpeed, 0);
  const overdueAccounts = all.filter((c) => c.paymentStatus === "overdue").length;

  const revenueMtd = all
    .filter((c) => c.paymentStatus === "paid" && monthKey(c.lastPaymentDate) === currentMonth)
    .reduce((sum, c) => sum + c.monthlyFee, 0);

  const expectedThisMonth = all.filter((c) => c.status !== "inactive").length;
  const paidThisMonth = all.filter(
    (c) => c.paymentStatus === "paid" && monthKey(c.lastPaymentDate) === currentMonth
  ).length;
  const billingCollectionRate =
    expectedThisMonth > 0 ? Math.round((paidThisMonth / expectedThisMonth) * 100) : 0;

  const recentSubscribers = [...all].sort((a, b) => (a.joinDate < b.joinDate ? 1 : -1)).slice(0, 5);

  const byPackage: Record<ServicePackage, number> = {
    basic: 0,
    standard: 0,
    premium: 0,
  };
  for (const c of all) {
    byPackage[c.servicePackage] += 1;
  }
  const packageMix = (["basic", "standard", "premium"] as const).map((pkg) => ({
    package: pkg,
    count: byPackage[pkg],
    percent: totalCustomers ? Math.round((byPackage[pkg] / totalCustomers) * 100) : 0,
  }));

  const churnRiskCount = all.filter(
    (c) => c.paymentStatus === "overdue" || c.status === "suspended"
  ).length;

  return {
    totalCustomers,
    activeConnections,
    suspendedCount,
    inactiveCount,
    activeThroughputMbps,
    revenueMtd,
    overdueAccounts,
    billingCollectionRate,
    recentSubscribers,
    packageMix,
    churnRiskCount,
  };
}
