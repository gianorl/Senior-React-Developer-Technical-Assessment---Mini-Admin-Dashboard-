import { Head } from "@/components/seo";
import { IspOverviewDashboard } from "@/features/overview/components/isp-overview-dashboard";

const DashboardRoute = () => {
  return (
    <>
      <Head title="Overview" />
      <div className="p-6 md:p-10">
        <div className="mx-auto max-w-7xl">
          <IspOverviewDashboard />
        </div>
      </div>
    </>
  );
};

export const Component = DashboardRoute;
