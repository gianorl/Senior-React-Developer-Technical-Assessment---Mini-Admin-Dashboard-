import { Link, useNavigate } from "react-router-dom";

import { AuthLayout } from "@/components/layouts/auth-layout";
import { paths } from "@/config/paths";
import { RegisterForm } from "@/features/auth/components/register-form";

const RegisterRoute = () => {
  const navigate = useNavigate();

  return (
    <AuthLayout
      variant="register"
      title="Create Account"
      subtitle="Enter your details below to start your editorial journey."
    >
      <RegisterForm
        onSuccess={() => {
          navigate(paths.app.dashboard.getHref(), { replace: true });
        }}
      />
      <div className="pt-6 text-center">
        <p className="font-editorial text-sm text-[#5a5c5c]">
          Already have an account?{" "}
          <Link
            to={paths.auth.login.getHref()}
            className="ml-1 font-bold text-[#6b1ef3] underline-offset-4 transition-all hover:underline"
          >
            Log in here
          </Link>
        </p>
      </div>
      <div className="flex justify-center pt-8">
        <div className="flex cursor-default items-center gap-2 opacity-30 grayscale transition-all duration-500 hover:grayscale-0 hover:opacity-100">
          <div className="size-1.5 rounded-full bg-[#6b1ef3]" />
          <span className="font-editorial text-[10px] font-bold uppercase tracking-[0.2em] text-[#2d2f2f]">
            The Editorial Standards
          </span>
        </div>
      </div>
    </AuthLayout>
  );
};

export const Component = RegisterRoute;
