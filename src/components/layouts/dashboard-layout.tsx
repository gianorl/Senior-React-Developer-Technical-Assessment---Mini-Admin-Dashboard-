import type * as React from "react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { PROFILE_AVATAR } from "@/assets/dashboard-layout-assets";
import { paths } from "@/config/paths";
import { useLogout, useUser } from "@/features/auth/api/get-auth";
import { cn } from "@/utils/cn";

import { dashboardSidebarItems } from "./dashboard-sidebar-items";

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const navigate = useNavigate();
  const logout = useLogout({
    onSuccess: () => navigate(paths.auth.login.getHref()),
  });

  return (
    <div className="flex h-full flex-col gap-2 p-6 md:p-8">
      <nav className="flex flex-1 flex-col gap-2">
        {dashboardSidebarItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 font-editorial text-sm font-semibold tracking-wide transition-all duration-300",
                isActive
                  ? "bg-[#5b5b5b] text-white shadow-lg shadow-[#6b1ef3]/10"
                  : "scale-[0.98] text-[#5b5b5b] hover:translate-x-1 hover:bg-[#f0f1f1] active:scale-95"
              )
            }
          >
            <span className="material-symbols-outlined shrink-0 !text-[22px] leading-none">
              {item.icon}
            </span>
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-2 border-t border-[#dbdddd]/80 pt-4 md:mt-8">
        <button
          type="button"
          onClick={() => {
            onNavigate?.();
            logout.mutate(undefined);
          }}
          className="flex items-center gap-3 rounded-lg px-4 py-3 font-editorial text-sm font-semibold tracking-wide text-[#5b5b5b] transition-all duration-300 hover:translate-x-1 hover:bg-[#f0f1f1] active:scale-95"
        >
          <span className="material-symbols-outlined shrink-0 !text-[22px] leading-none">
            logout
          </span>
          Log Out
        </button>
      </div>
    </div>
  );
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const displayName = user.data ? `${user.data.first_name} ${user.data.last_name}` : "";
  const email = user.data?.email ?? "";

  return (
    <div className="min-h-screen bg-[#f6f6f6] font-editorial text-[#2d2f2f] selection:bg-[#6b1ef3]/30">
      <header
        className={cn(
          "fixed top-0 z-50 flex h-20 w-full items-center justify-between gap-4 px-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl md:px-8",
          "bg-[#f6f6f6]/90"
        )}
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            type="button"
            className="shrink-0 rounded-lg p-2 text-[#5b5b5b] transition-colors hover:bg-[#f0f1f1] md:hidden"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <span className="material-symbols-outlined !text-[26px] leading-none">menu</span>
          </button>
          <span className="truncate font-editorial-serif text-xl font-black italic tracking-tighter text-[#5b5b5b] md:text-2xl">
            ISP Connect
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-4">
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-[#f0f1f1]">
            <img
              src={PROFILE_AVATAR}
              alt={displayName ? `Profile, ${displayName}` : "User profile"}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="hidden min-w-0 text-right sm:block">
            <p className="truncate font-editorial text-sm font-semibold text-[#2d2f2f]">
              {displayName || "Signed in"}
            </p>
            {email ? (
              <p className="truncate font-editorial text-xs text-[#5a5c5c]">{email}</p>
            ) : null}
          </div>
        </div>
      </header>

      <div className="flex pt-20">
        <aside
          className={cn(
            "fixed left-0 top-20 z-40 hidden h-[calc(100vh-5rem)] w-72 flex-col bg-[#f6f6f6] md:flex",
            "after:pointer-events-none after:absolute after:right-0 after:top-0 after:h-full after:w-px after:bg-[#f0f1f1]"
          )}
        >
          <SidebarContent />
        </aside>

        {mobileMenuOpen ? (
          <div className="fixed inset-0 z-[60] md:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-black/50"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            />
            <aside className="absolute inset-y-0 left-0 z-[70] flex w-72 max-w-[85vw] flex-col bg-[#f6f6f6] shadow-xl">
              <div className="flex items-center justify-end border-b border-[#f0f1f1] px-4 py-3">
                <button
                  type="button"
                  className="rounded-lg p-2 text-[#5b5b5b] hover:bg-[#f0f1f1]"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close"
                >
                  <span className="material-symbols-outlined !text-[24px] leading-none">close</span>
                </button>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto">
                <SidebarContent onNavigate={() => setMobileMenuOpen(false)} />
              </div>
            </aside>
          </div>
        ) : null}

        <main className="min-h-[calc(100vh-5rem)] w-full flex-1 md:ml-72">{children}</main>
      </div>
    </div>
  );
}
