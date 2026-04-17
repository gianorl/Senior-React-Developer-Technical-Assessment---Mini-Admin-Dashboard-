import { paths } from "@/config/paths";

export const dashboardSidebarItems = [
  {
    id: "overview",
    name: "Overview",
    to: paths.app.dashboard.getHref(),
    icon: "dashboard" as const,
    end: true,
  },
  {
    id: "customer",
    name: "Customer",
    to: paths.app.customers.getHref(),
    icon: "group" as const,
    end: true,
  },
] as const;

export type DashboardSidebarItem = (typeof dashboardSidebarItems)[number];
