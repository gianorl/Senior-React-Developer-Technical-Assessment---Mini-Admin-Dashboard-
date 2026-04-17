import { useMemo } from "react";

import type { CustomerOverviewStatsQuery } from "@/features/customers/api/get-customers";
import type { CustomerMetricFilter } from "@/features/customers/types";
import { buildSubscriberMetricCards } from "@/features/customers/utils/build-subscriber-metric-cards";
import { formatThroughput } from "@/features/customers/utils/format-throughput";
import { SUBSCRIBER_METRIC_CARD_BASE } from "@/features/customers/utils/subscriber-metric-card-styles";
import { cn } from "@/utils/cn";

export function SubscriberMetricCards({
  overviewQuery,
  selected,
  onSelect,
}: {
  overviewQuery: CustomerOverviewStatsQuery;
  selected: CustomerMetricFilter;
  onSelect: (filter: CustomerMetricFilter) => void;
}) {
  const cards = buildSubscriberMetricCards(overviewQuery.isLoading, overviewQuery.data);

  return (
    <section className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-4">
      {cards.map((card) => {
        const isSelected = selected === card.id;
        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelect(card.id)}
            className={cn(
              SUBSCRIBER_METRIC_CARD_BASE,
              "border-[#acadad]/10 hover:border-[#acadad]/25",
              isSelected ? cn("ring-2", card.selectedRing) : "ring-0 shadow-sm"
            )}
          >
            <span
              className={cn(
                "mb-2 block font-editorial text-[10px] font-medium uppercase tracking-widest",
                card.id === "overdue" ? "text-[#9f0519]" : "text-neutral-500"
              )}
            >
              {card.label}
            </span>
            <div className="flex items-end justify-between">
              <span className={cn("font-editorial-serif text-4xl font-normal", card.valueClass)}>
                {card.value}
              </span>
              <span className={cn("font-editorial text-xs font-bold", card.tagClass)}>
                {card.tag}
              </span>
            </div>
          </button>
        );
      })}
    </section>
  );
}

export function IntelligenceKpiCards({
  overviewQuery,
}: {
  overviewQuery: CustomerOverviewStatsQuery;
}) {
  const throughput = useMemo(() => {
    const mbps = overviewQuery.data?.activeThroughputMbps ?? 0;
    return formatThroughput(mbps);
  }, [overviewQuery.data?.activeThroughputMbps]);

  const supportQueue = overviewQuery.data?.churnRiskCount ?? 0;
  const offlineNodes = overviewQuery.data?.inactiveCount ?? 0;
  const collectionRate = overviewQuery.data?.billingCollectionRate ?? 0;

  return (
    <section className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-3">
      <div className="group relative overflow-hidden rounded-2xl bg-[#f0f1f1] p-8">
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-[#4cb9ff]/30 blur-3xl transition-colors duration-700 group-hover:bg-[#4cb9ff]/50" />
        <div className="relative z-10 flex h-full flex-col justify-between">
          <div className="mb-12 flex items-start justify-between">
            <h3 className="font-editorial text-xs font-bold uppercase tracking-widest text-[#5a5c5c]">
              Network Load
            </h3>
            <span className="material-symbols-outlined text-[#00618f]">query_stats</span>
          </div>
          <div>
            {overviewQuery.isLoading ? (
              <div className="mb-2 h-14 w-40 animate-pulse rounded bg-[#dbdddd]/60" />
            ) : (
              <div className="mb-2 font-editorial-serif text-5xl text-[#0c0f0f]">
                {throughput.value}{" "}
                <span className="font-editorial-serif text-2xl text-[#5a5c5c]">
                  {throughput.unit}
                </span>
              </div>
            )}
            <p className="flex items-center gap-1 font-editorial text-sm text-[#00adfa]">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span>+{collectionRate}% collection MTD</span>
            </p>
          </div>
        </div>
      </div>

      <div className="group relative overflow-hidden rounded-2xl bg-[#f0f1f1] p-8">
        <div className="absolute -bottom-12 -left-12 h-56 w-56 rounded-full bg-[#d9caff]/30 blur-3xl transition-colors duration-700 group-hover:bg-[#d9caff]/50" />
        <div className="relative z-10 flex h-full flex-col justify-between">
          <div className="mb-12 flex items-start justify-between">
            <h3 className="font-editorial text-xs font-bold uppercase tracking-widest text-[#5a5c5c]">
              Support Queue
            </h3>
            <span className="material-symbols-outlined text-[#6b1ef3]">support_agent</span>
          </div>
          <div>
            {overviewQuery.isLoading ? (
              <div className="mb-2 h-14 w-24 animate-pulse rounded bg-[#dbdddd]/60" />
            ) : (
              <div className="mb-2 font-editorial-serif text-5xl text-[#0c0f0f]">
                {supportQueue}{" "}
                <span className="font-editorial-serif text-2xl text-[#5a5c5c]">Active</span>
              </div>
            )}
            <p className="flex items-center gap-1 font-editorial text-sm text-[#5f00e2]">
              <span className="material-symbols-outlined text-sm">schedule</span>
              Accounts needing attention
            </p>
          </div>
        </div>
      </div>

      <div className="group relative overflow-hidden rounded-2xl bg-[#0c0f0f] p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-[#9f0519]/20 to-transparent" />
        <div className="relative z-10 flex h-full flex-col justify-between">
          <div className="mb-12 flex items-start justify-between">
            <h3 className="font-editorial text-xs font-bold uppercase tracking-widest text-[#f3f3f3]">
              Offline Nodes
            </h3>
            <span className="material-symbols-outlined text-[#fb5151]">warning</span>
          </div>
          <div>
            {overviewQuery.isLoading ? (
              <div className="mb-2 h-14 w-24 animate-pulse rounded bg-white/10" />
            ) : (
              <div className="mb-2 font-editorial-serif text-5xl text-white">
                {String(offlineNodes).padStart(2, "0")}{" "}
                <span className="font-editorial-serif text-2xl text-[#9c9d9d]">Critical</span>
              </div>
            )}
            <p className="flex items-center gap-1 font-editorial text-sm text-[#fb5151]">
              <span className="material-symbols-outlined text-sm">location_on</span>
              Inactive subscriber links
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
