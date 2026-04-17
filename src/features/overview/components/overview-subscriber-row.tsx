import type { Customer } from "@/features/customers/types";

import { formatIdr, formatOverviewJoinDate } from "../utils/overview-format";
import { OVERVIEW_PACKAGE_DISPLAY } from "../utils/service-package-display";

type OverviewSubscriberRowProps = {
  customer: Customer;
};

export function OverviewSubscriberRow({ customer }: OverviewSubscriberRowProps) {
  const pkg = OVERVIEW_PACKAGE_DISPLAY[customer.servicePackage];
  const suspended = customer.status === "suspended";
  const inactive = customer.status === "inactive";

  let paymentCell: { text: string; warn: boolean };
  if (customer.paymentStatus === "paid") {
    paymentCell = { text: formatIdr(customer.monthlyFee), warn: false };
  } else if (customer.paymentStatus === "overdue") {
    paymentCell = { text: "Overdue", warn: true };
  } else {
    paymentCell = { text: "Pending", warn: false };
  }

  const statusLabel = inactive ? "Inactive" : suspended ? "Suspended" : "Active";
  const statusDot =
    inactive || suspended ? "bg-[#9f0519]" : "bg-[#6b1ef3] shadow-[0_0_8px_rgba(107,30,243,0.8)]";

  return (
    <tr className="group transition-colors hover:bg-[#f0f1f1]">
      <td className="px-6 py-6 font-editorial-serif text-base font-normal text-[#2d2f2f]">
        {customer.fullName}
      </td>
      <td className="px-6 py-6">
        <span
          className={`rounded-full px-3 py-1 font-editorial text-[10px] font-bold uppercase tracking-wider ${pkg.className}`}
        >
          {pkg.label}
        </span>
      </td>
      <td className="px-6 py-6">
        <div className="flex items-center gap-2">
          <div className={`size-1.5 rounded-full ${statusDot}`} />
          <span className="font-editorial text-sm font-medium text-[#2d2f2f]">{statusLabel}</span>
        </div>
      </td>
      <td className="whitespace-nowrap px-6 py-6 font-editorial text-sm text-[#5a5c5c]">
        {formatOverviewJoinDate(customer.joinDate)}
      </td>
      <td
        className={`px-6 py-6 text-right font-editorial text-sm font-bold ${
          paymentCell.warn ? "text-[#9f0519]" : "text-[#2d2f2f]"
        }`}
      >
        {paymentCell.text}
      </td>
    </tr>
  );
}
