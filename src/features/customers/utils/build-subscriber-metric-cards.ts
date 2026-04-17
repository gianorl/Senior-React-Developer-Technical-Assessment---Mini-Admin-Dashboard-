import type { CustomerOverviewStats } from "@/features/customers/services/customerService";
import type { CustomerMetricFilter } from "@/features/customers/types";

export type SubscriberMetricCardModel = {
  id: CustomerMetricFilter;
  label: string;
  value: string;
  tag: string;
  tagClass: string;
  valueClass: string;
  selectedRing: string;
};

export function buildSubscriberMetricCards(
  isLoading: boolean,
  stats: CustomerOverviewStats | undefined
): SubscriberMetricCardModel[] {
  const activeEndpoints = stats?.activeConnections ?? 0;
  const displayTotal = stats?.totalCustomers ?? 0;
  const suspendedDisplay = stats?.suspendedCount ?? 0;
  const overdueDisplay = stats?.overdueAccounts ?? 0;

  return [
    {
      id: "all",
      label: "Total Customers",
      value: isLoading ? "…" : displayTotal.toLocaleString(),
      tag: "Live data",
      tagClass: "text-[#00618f]",
      valueClass: "text-[#2d2f2f]",
      selectedRing: "ring-[#00618f] border-[#00618f]/35 shadow-[0_0_24px_rgba(0,97,143,0.18)]",
    },
    {
      id: "active",
      label: "Active Nodes",
      value: isLoading ? "…" : activeEndpoints.toLocaleString(),
      tag: "Live",
      tagClass: "text-[#6b1ef3]",
      valueClass: "text-[#6b1ef3]",
      selectedRing: "ring-[#6b1ef3] border-[#6b1ef3]/35 shadow-[0_0_24px_rgba(107,30,243,0.2)]",
    },
    {
      id: "suspended",
      label: "Suspended",
      value: isLoading ? "…" : suspendedDisplay.toLocaleString(),
      tag: "Restricted",
      tagClass: "text-neutral-400",
      valueClass: "text-[#2d2f2f]",
      selectedRing: "ring-[#5b5b5b] border-[#acadad]/50 shadow-[0_0_20px_rgba(91,91,91,0.12)]",
    },
    {
      id: "overdue",
      label: "Overdue Billing",
      value: isLoading ? "…" : overdueDisplay.toLocaleString(),
      tag: "Critical",
      tagClass: "rounded bg-[#fb5151] px-2 py-0.5 text-[10px] font-bold text-white",
      valueClass: "text-[#9f0519]",
      selectedRing: "ring-[#9f0519] border-[#9f0519]/40 shadow-[0_0_24px_rgba(159,5,25,0.2)]",
    },
  ];
}
