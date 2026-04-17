import { queryOptions, type UseQueryResult, useQuery } from "@tanstack/react-query";

import type { CustomerOverviewStats } from "@/features/customers/services/customerService";
import {
  fetchCustomerOverviewStats,
  fetchCustomers,
} from "@/features/customers/services/customerService";

import type { CustomerQueryParams } from "../types";

export type CustomerOverviewStatsQuery = UseQueryResult<CustomerOverviewStats, Error>;

export function getCustomersQueryOptions(params: CustomerQueryParams) {
  return queryOptions({
    queryKey: ["customers", params],
    queryFn: () => fetchCustomers(params),
  });
}

export function useCustomers(params: CustomerQueryParams) {
  return useQuery(getCustomersQueryOptions(params));
}

export function useCustomerOverviewStats() {
  return useQuery({
    queryKey: ["customers", "overview"],
    queryFn: fetchCustomerOverviewStats,
  });
}
