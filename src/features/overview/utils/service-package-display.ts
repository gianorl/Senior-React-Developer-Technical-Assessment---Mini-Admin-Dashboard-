import type { ServicePackage } from "@/features/customers/types";

export const OVERVIEW_PACKAGE_DISPLAY: Record<
  ServicePackage,
  { label: string; className: string; barClass: string }
> = {
  premium: {
    label: "Fiber Gold",
    className: "bg-[#d9caff] text-[#5500cd]",
    barClass: "bg-[#6b1ef3]",
  },
  standard: {
    label: "Titanium 1G",
    className: "bg-[#4cb9ff] text-[#00344f]",
    barClass: "bg-[#00618f]",
  },
  basic: {
    label: "Home Lite",
    className: "bg-[#e1e3e3] text-[#5a5c5c]",
    barClass: "bg-[#5b5b5b]",
  },
};
