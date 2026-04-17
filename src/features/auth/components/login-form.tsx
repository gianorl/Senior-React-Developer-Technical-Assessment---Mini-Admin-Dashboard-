import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Form, Input } from "@/components/ui/form";
import { FormError } from "@/components/ui/form/error";
import { paths } from "@/config/paths";
import { type LoginInput, loginInputSchema, useLogin } from "@/features/auth/api/get-auth";
import {
  loginEditorialInput,
  loginEditorialLabel,
} from "@/features/auth/utils/editorial-form-classes";
import { cn } from "@/utils/cn";

type LoginFormProps = {
  onSuccess: () => void;
};

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const login = useLogin({ onSuccess });

  return (
    <div>
      <Form<LoginInput>
        onSubmit={(values) => {
          login.mutate(values);
        }}
        schema={loginInputSchema}
      >
        {({ register, formState }) => (
          <div className="space-y-8">
            <Input
              type="email"
              label="Email Address"
              labelClassName={loginEditorialLabel}
              containerClassName="space-y-2"
              error={formState.errors.email}
              registration={register("email")}
              className={loginEditorialInput}
              placeholder="name@editorial.com"
              autoComplete="email"
            />
            <div className="space-y-2">
              <div className="flex items-end justify-between px-1">
                <label className={`${loginEditorialLabel} ml-0`} htmlFor="login-password">
                  Password
                </label>
                <button
                  type="button"
                  className="appearance-none bg-transparent p-0 font-editorial text-xs font-medium text-[#6b1ef3] transition-colors hover:text-[#5f00e2]"
                >
                  Forgot Password?
                </button>
              </div>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className={cn(loginEditorialInput)}
                {...register("password")}
              />
              <FormError errorMessage={formState.errors.password?.message} />
            </div>

            {login.isError && (
              <div
                role="alert"
                className="rounded-lg bg-red-50 p-3 font-editorial text-sm text-red-600"
              >
                {login.error.message}
              </div>
            )}

            <div className="pt-4">
              <button
                type="submit"
                disabled={login.isPending}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0c0f0f] py-4 font-editorial text-base font-bold text-[#f3f3f3] transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
              >
                {login.isPending ? (
                  <span className="inline-block size-5 animate-spin rounded-full border-2 border-[#f3f3f3] border-t-transparent" />
                ) : null}
                Sign In
                {!login.isPending ? (
                  <ArrowRight className="size-5 shrink-0" strokeWidth={2} />
                ) : null}
              </button>
            </div>
          </div>
        )}
      </Form>

      <footer className="mt-12 text-center">
        <p className="font-editorial text-sm text-[#5a5c5c]">
          Don&apos;t have an account?{" "}
          <Link
            to={paths.auth.register.getHref()}
            className="inline border-b border-[#0c0f0f]/10 font-bold text-[#0c0f0f] transition-all hover:border-[#0c0f0f]"
          >
            Join the Archive
          </Link>
        </p>
      </footer>
    </div>
  );
};
