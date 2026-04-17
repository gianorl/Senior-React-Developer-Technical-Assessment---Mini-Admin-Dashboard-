import { Eye, EyeOff } from "lucide-react";
import { useId, useState } from "react";

import { Form, Input } from "@/components/ui/form";
import { FormError } from "@/components/ui/form/error";
import { type RegisterInput, registerInputSchema, useRegister } from "@/features/auth/api/get-auth";
import {
  registerEditorialInput,
  registerEditorialLabel,
} from "@/features/auth/utils/editorial-form-classes";
import { cn } from "@/utils/cn";

type RegisterFormProps = {
  onSuccess: () => void;
};

export const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const registerMutation = useRegister({ onSuccess });
  const termsId = useId();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Form<RegisterInput>
      onSubmit={(values) => {
        registerMutation.mutate({
          fullName: values.fullName,
          email: values.email,
          password: values.password,
        });
      }}
      schema={registerInputSchema}
      options={{
        defaultValues: {
          fullName: "",
          email: "",
          password: "",
          termsAccepted: false,
        },
      }}
    >
      {({ register, formState }) => (
        <div className="space-y-8">
          <div className="space-y-6">
            <Input
              type="text"
              label="Full Name"
              labelClassName={registerEditorialLabel}
              containerClassName="space-y-2"
              error={formState.errors.fullName}
              registration={register("fullName")}
              className={registerEditorialInput}
              placeholder="Alexander Hamilton"
              autoComplete="name"
            />
            <Input
              type="email"
              label="Email Address"
              labelClassName={registerEditorialLabel}
              containerClassName="space-y-2"
              error={formState.errors.email}
              registration={register("email")}
              className={registerEditorialInput}
              placeholder="name@editorial.com"
              autoComplete="email"
            />
            <div className="relative space-y-2">
              <label
                className={cn(registerEditorialLabel, "ml-0 block")}
                htmlFor="register-password"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className={cn(registerEditorialInput, "pr-14")}
                  {...register("password")}
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#757777] transition-colors hover:text-[#2d2f2f]"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
              <p className="text-[11px] italic text-[#757777]">
                Must be at least 8 characters long
              </p>
              <FormError errorMessage={formState.errors.password?.message} />
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="pt-0.5">
              <input
                id={termsId}
                type="checkbox"
                className="size-4 cursor-pointer rounded border-[#acadad] text-[#6b1ef3] focus:ring-[#6b1ef3]/20"
                {...register("termsAccepted")}
              />
            </div>
            <label
              className="font-editorial text-sm leading-tight text-[#5a5c5c]"
              htmlFor={termsId}
            >
              I agree to the{" "}
              <button
                type="button"
                className="font-semibold text-[#2d2f2f] underline decoration-[#acadad] underline-offset-4 transition-all hover:decoration-[#6b1ef3]"
              >
                Terms of Service
              </button>{" "}
              and{" "}
              <button
                type="button"
                className="font-semibold text-[#2d2f2f] underline decoration-[#acadad] underline-offset-4 transition-all hover:decoration-[#6b1ef3]"
              >
                Privacy Policy
              </button>
              .
            </label>
          </div>
          <FormError errorMessage={formState.errors.termsAccepted?.message} />

          {registerMutation.isError && (
            <div
              role="alert"
              className="rounded-lg bg-red-50 p-3 font-editorial text-sm text-red-600"
            >
              {registerMutation.error.message}
            </div>
          )}

          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="flex w-full items-center justify-center rounded-lg bg-[#0c0f0f] py-4 font-editorial text-sm font-bold text-[#f3f3f3] shadow-xl shadow-[#0c0f0f]/10 transition-all hover:shadow-2xl hover:shadow-[#6b1ef3]/20 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
          >
            {registerMutation.isPending ? (
              <span className="inline-block size-5 animate-spin rounded-full border-2 border-[#f3f3f3] border-t-transparent" />
            ) : (
              "Sign Up"
            )}
          </button>
        </div>
      )}
    </Form>
  );
};
