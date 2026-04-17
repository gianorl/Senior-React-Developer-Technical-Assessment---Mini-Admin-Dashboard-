import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import {
  fetchAuthUser,
  loginWithEmailAndPassword,
  logoutAuthSession,
  registerWithEmailAndPassword,
} from "@/features/auth/services/authService";

import { useAuthStore } from "./auth-store";

export const loginInputSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginInput = z.infer<typeof loginInputSchema>;

export const registerInputSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(8, "Must be at least 8 characters long"),
  termsAccepted: z.boolean().refine((v) => v, {
    message: "You must accept the Terms of Service and Privacy Policy",
  }),
});

export type RegisterInput = z.infer<typeof registerInputSchema>;

export function useUser() {
  return useQuery({
    queryKey: ["auth", "user"],
    queryFn: fetchAuthUser,
    staleTime: Number.POSITIVE_INFINITY,
  });
}

export function useLogin({ onSuccess }: { onSuccess: () => void }) {
  const queryClient = useQueryClient();
  const { setToken } = useAuthStore();

  return useMutation({
    mutationFn: loginWithEmailAndPassword,
    onSuccess: (response) => {
      setToken(response.token);
      localStorage.setItem("auth_user", JSON.stringify(response.user));
      queryClient.setQueryData(["auth", "user"], response.user);
      onSuccess();
    },
  });
}

export function useRegister({ onSuccess }: { onSuccess: () => void }) {
  const queryClient = useQueryClient();
  const { setToken } = useAuthStore();

  return useMutation({
    mutationFn: registerWithEmailAndPassword,
    onSuccess: (response) => {
      setToken(response.token);
      localStorage.setItem("auth_user", JSON.stringify(response.user));
      queryClient.setQueryData(["auth", "user"], response.user);
      onSuccess();
    },
  });
}

export function useLogout({ onSuccess }: { onSuccess: () => void }) {
  const queryClient = useQueryClient();
  const { setToken } = useAuthStore();

  return useMutation({
    mutationFn: logoutAuthSession,
    onSuccess: () => {
      setToken(null);
      localStorage.removeItem("auth_user");
      queryClient.setQueryData(["auth", "user"], null);
      queryClient.clear();
      onSuccess();
    },
  });
}
