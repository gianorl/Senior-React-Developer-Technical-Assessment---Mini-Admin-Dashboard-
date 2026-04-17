import { cn } from "@/utils/cn";

import type { Customer, CustomerStatus } from "../types";

export function CustomersTableStatusBadge({ status }: { status: CustomerStatus }) {
  if (status === "active") {
    return (
      <span className="inline-flex items-center rounded-full bg-[#4cb9ff]/20 px-2.5 py-1 text-xs font-semibold text-[#00557d]">
        Online
      </span>
    );
  }
  if (status === "suspended") {
    return (
      <span className="inline-flex items-center rounded-full bg-[#fb5151]/20 px-2.5 py-1 text-xs font-semibold text-[#9f0519]">
        Degraded
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-[#dbdddd] px-2.5 py-1 text-xs font-semibold text-[#5a5c5c]">
      Offline
    </span>
  );
}

export function CustomersTableUsageBar({ customer }: { customer: Customer }) {
  let pct = 0;
  let barClass = "bg-[#acadad]";
  if (customer.status === "inactive") {
    pct = 0;
    barClass = "bg-[#acadad]";
  } else if (customer.status === "suspended") {
    pct = 95;
    barClass = "bg-[#b31b25]";
  } else {
    pct = Math.min(100, Math.max(8, Math.round((customer.downloadSpeed / 100) * 100)));
    barClass = "bg-[#6b1ef3]";
  }
  return (
    <div className="h-2 w-24 overflow-hidden rounded-full bg-[#e7e8e8]">
      <div
        className={cn("h-full rounded-full transition-all", barClass)}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function CustomersTableSubscriberCell({ customer }: { customer: Customer }) {
  const initial = customer.fullName.trim().charAt(0).toUpperCase();
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ebebeb] font-editorial-serif text-lg font-bold text-[#4f4f4f]">
        {initial}
      </div>
      <div className="min-w-0">
        <div className="font-semibold text-[#0c0f0f]">{customer.fullName}</div>
        <div className="mt-1 text-xs text-[#5a5c5c]">ID: {customer.customerId}</div>
      </div>
    </div>
  );
}
