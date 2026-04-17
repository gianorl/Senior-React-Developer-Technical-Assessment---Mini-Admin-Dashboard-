import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import { fetchOverviewStats } from "../services/overviewService";
import type { OverviewStats } from "../types";

export type OverviewStatsQuery = UseQueryResult<OverviewStats, Error>;

export function useOverviewStats(): OverviewStatsQuery {
  return useQuery({
    queryKey: ["customers", "overview"],
    queryFn: fetchOverviewStats,
  });
}
