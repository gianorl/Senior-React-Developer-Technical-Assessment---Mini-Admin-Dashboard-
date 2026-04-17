/** Re-exports the auth feature for existing `@/lib/auth` imports. */

export { useAuthStore } from "@/features/auth/api/auth-store";
export {
  type LoginInput,
  loginInputSchema,
  type RegisterInput,
  registerInputSchema,
  useLogin,
  useLogout,
  useRegister,
  useUser,
} from "@/features/auth/api/get-auth";

export { AuthLoader, ProtectedRoute } from "@/features/auth/components/auth-guard";
