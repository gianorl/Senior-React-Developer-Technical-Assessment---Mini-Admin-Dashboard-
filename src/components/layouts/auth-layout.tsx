import type * as React from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Head } from "@/components/seo";
import { paths } from "@/config/paths";
import { useUser } from "@/features/auth/api/get-auth";
import { cn } from "@/utils/cn";

import { AuthHeroPane } from "./auth-hero-pane";

type LayoutProps = {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  variant?: "login" | "register";
};

export const AuthLayout = ({ children, title, subtitle, variant = "login" }: LayoutProps) => {
  const user = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user.data) {
      navigate(paths.app.dashboard.getHref(), { replace: true });
    }
  }, [user.data, navigate]);

  return (
    <>
      <Head title={title} />
      <div className="relative flex min-h-screen w-full overflow-hidden bg-[#f6f6f6] font-editorial text-[#2d2f2f] antialiased">
        <Link
          to={paths.home.getHref()}
          className="absolute left-4 top-6 z-50 rounded md:left-8 md:top-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6b1ef3]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f6f6f6] lg:focus-visible:ring-offset-[#0c0f0f]"
        >
          <span className="font-editorial-serif text-xl font-black italic tracking-tighter text-[#5b5b5b] md:text-2xl lg:text-[#f3f3f3]">
            ISP Connect
          </span>
        </Link>
        <AuthHeroPane variant={variant} />

        <section className="flex w-full flex-col items-center justify-center bg-[#f6f6f6] px-4 pb-8 pt-20 md:px-8 md:pb-24 md:pt-24 lg:w-1/2 lg:px-12">
          <div className={cn("w-full max-w-md", variant === "register" && "space-y-10")}>
            <header
              className={cn(
                variant === "register" ? "space-y-4" : "mb-8",
                variant === "login" && "[&>p]:mt-2"
              )}
            >
              <h1 className="font-editorial-serif text-4xl font-bold tracking-tight text-[#2d2f2f]">
                {title}
              </h1>
              <p className="font-editorial text-[#5a5c5c]">{subtitle}</p>
            </header>
            {children}
          </div>
        </section>
      </div>
    </>
  );
};
