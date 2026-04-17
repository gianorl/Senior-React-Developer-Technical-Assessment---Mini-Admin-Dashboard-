import { useMemo } from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

import { paths } from "@/config/paths";
import { useUser } from "@/features/auth/api/get-auth";
import { ProtectedRoute } from "@/features/auth/components/auth-guard";

import AppRoot from "./routes/app/root";

function HomeRedirect() {
  const user = useUser();

  if (user.data) {
    return <Navigate to={paths.app.dashboard.getHref()} replace />;
  }

  return <Navigate to={paths.auth.login.getHref()} replace />;
}

const createAppRouter = () =>
  createBrowserRouter([
    {
      path: paths.home.path,
      element: <HomeRedirect />,
    },
    {
      path: paths.auth.login.path,
      lazy: () => import("./routes/auth/login.tsx"),
    },
    {
      path: paths.auth.register.path,
      lazy: () => import("./routes/auth/register.tsx"),
    },
    {
      path: paths.app.root.path,
      element: (
        <ProtectedRoute>
          <AppRoot />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          lazy: () => import("./routes/app/dashboard.tsx"),
        },
        {
          path: paths.app.customers.path,
          lazy: () => import("./routes/app/customers.tsx"),
        },
      ],
    },
    {
      path: "*",
      lazy: () => import("./routes/not-found.tsx"),
    },
  ]);

export const AppRouter = () => {
  const router = useMemo(() => createAppRouter(), []);

  return <RouterProvider router={router} />;
};
