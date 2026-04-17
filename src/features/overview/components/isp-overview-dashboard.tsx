import { LineChart } from "lucide-react";

import { IntelligenceKpiCards } from "@/features/customers/components/customer-stats-cards";
import { useOverviewStats } from "@/features/overview/api/get-overview";
import { OVERVIEW_PACKAGE_DISPLAY } from "../utils/service-package-display";
import { OverviewSubscriberRow } from "./overview-subscriber-row";

export function IspOverviewDashboard() {
  const overviewQuery = useOverviewStats();
  const stats = overviewQuery.data;

  const activeEndpoints = stats?.activeConnections ?? 0;
  const churnPct =
    stats && stats.totalCustomers > 0
      ? ((stats.churnRiskCount / stats.totalCustomers) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-3xl bg-[#0c0f0f] p-8 text-white md:p-12">
        <div className="absolute right-0 top-0 h-full w-1/2 opacity-30">
          <div className="h-full w-full translate-x-1/4 -translate-y-1/4 bg-gradient-to-bl from-[#6b1ef3] to-[#00618f] blur-3xl" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h2 className="mb-6 font-editorial-serif text-4xl font-normal leading-tight md:text-5xl">
            Network Intelligence Dashboard
          </h2>
          <p className="font-editorial text-lg leading-relaxed text-neutral-400">
            Visualizing real-time connectivity metrics and customer lifecycles with editorial
            precision. Your network is currently serving{" "}
            <span className="font-bold text-white">
              {overviewQuery.isLoading
                ? "…"
                : `${activeEndpoints.toLocaleString()} active endpoints`}
            </span>{" "}
            across the metropolitan grid.
          </p>
        </div>
      </section>

      <IntelligenceKpiCards overviewQuery={overviewQuery} />

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        <section className="space-y-8 lg:col-span-2">
          <div className="flex items-baseline justify-between">
            <h3 className="font-editorial-serif text-2xl font-normal italic text-[#2d2f2f]">
              Recent Subscribers
            </h3>
            <button
              type="button"
              className="font-editorial text-xs font-medium uppercase tracking-widest text-[#6b1ef3] underline-offset-4 transition-colors hover:underline"
            >
              View Directory
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-[#f0f1f1] text-[#5a5c5c]">
                  <th className="rounded-tl-xl px-6 py-4 font-editorial text-[10px] font-medium uppercase tracking-[0.2em]">
                    Subscriber Name
                  </th>
                  <th className="px-6 py-4 font-editorial text-[10px] font-medium uppercase tracking-[0.2em]">
                    Package Tier
                  </th>
                  <th className="px-6 py-4 font-editorial text-[10px] font-medium uppercase tracking-[0.2em]">
                    Status
                  </th>
                  <th className="px-6 py-4 font-editorial text-[10px] font-medium uppercase tracking-[0.2em]">
                    Join date
                  </th>
                  <th className="rounded-tr-xl px-6 py-4 text-right font-editorial text-[10px] font-medium uppercase tracking-[0.2em]">
                    Last Payment
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e7e8e8]">
                {overviewQuery.isLoading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-10 text-center font-editorial text-sm text-neutral-500"
                    >
                      Loading subscribers…
                    </td>
                  </tr>
                ) : overviewQuery.isError ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-10 text-center font-editorial text-sm text-red-600"
                    >
                      Could not load subscribers.
                    </td>
                  </tr>
                ) : !stats?.recentSubscribers.length ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-10 text-center font-editorial text-sm text-neutral-500"
                    >
                      No subscribers to show.
                    </td>
                  </tr>
                ) : (
                  stats.recentSubscribers.map((customer) => (
                    <OverviewSubscriberRow key={customer.id} customer={customer} />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <div className="space-y-8 rounded-3xl bg-[#f0f1f1] p-10">
            <div className="space-y-2">
              <h3 className="font-editorial-serif text-xl font-normal italic text-[#2d2f2f]">
                Market Mix
              </h3>
              <p className="font-editorial text-[10px] font-medium uppercase tracking-widest text-neutral-500">
                Subscriber Tiers
              </p>
            </div>
            <div className="space-y-6">
              {overviewQuery.isLoading ? (
                <p className="font-editorial text-sm text-neutral-500">Loading mix…</p>
              ) : overviewQuery.isError ? (
                <p className="font-editorial text-sm text-red-600">Could not load market mix.</p>
              ) : (
                stats?.packageMix.map((row) => {
                  const meta = OVERVIEW_PACKAGE_DISPLAY[row.package];
                  return (
                    <div key={row.package} className="space-y-2">
                      <div className="flex justify-between font-editorial text-xs font-bold uppercase tracking-tighter text-[#2d2f2f]">
                        <span>{meta.label}</span>
                        <span>{row.percent}%</span>
                      </div>
                      <div className="h-1 w-full overflow-hidden rounded-full bg-[#dbdddd]">
                        <div
                          className={`h-full ${meta.barClass}`}
                          style={{ width: `${row.percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <div className="border-t border-[#acadad]/10 pt-6">
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-xl bg-white shadow-sm">
                  <LineChart className="size-6 text-[#6b1ef3]" aria-hidden />
                </div>
                <div>
                  <p className="font-editorial text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                    At-risk accounts
                  </p>
                  <p className="font-editorial-serif text-lg font-normal italic text-[#2d2f2f]">
                    {overviewQuery.isLoading ? "…" : `${churnPct}% `}
                    <span className="ml-2 font-editorial text-xs font-normal not-italic text-[#00618f]">
                      {overviewQuery.isLoading
                        ? ""
                        : `(${stats?.churnRiskCount ?? 0} overdue / suspended)`}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
