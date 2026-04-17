import { useNavigate } from "react-router-dom";

import { AuthLayout } from "@/components/layouts/auth-layout";
import { paths } from "@/config/paths";
import { LoginForm } from "@/features/auth/components/login-form";

const LoginRoute = () => {
  const navigate = useNavigate();

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Enter your credentials to access the editorial suite."
    >
      <LoginForm
        onSuccess={() => {
          navigate(paths.app.dashboard.getHref(), { replace: true });
        }}
      />
    </AuthLayout>
  );
};

export const Component = LoginRoute;
