import type * as React from "react";
import { Navigate } from "react-router-dom";

import { paths } from "@/config/paths";

import { useUser } from "../api/get-auth";

export function AuthLoader({
  children,
  renderLoading,
}: {
  children: React.ReactNode;
  renderLoading: () => React.ReactNode;
}) {
  const user = useUser();

  if (user.isLoading) {
    return renderLoading();
  }

  return children;
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useUser();

  if (!user.data) {
    return <Navigate to={paths.auth.login.getHref()} replace />;
  }

  return children;
}
