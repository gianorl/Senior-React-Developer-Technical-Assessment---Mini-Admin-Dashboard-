import { create } from "zustand";

type AuthStore = {
  token: string | null;
  setToken: (token: string | null) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  token: localStorage.getItem("auth_token"),
  setToken: (token) => {
    if (token) {
      localStorage.setItem("auth_token", token);
    } else {
      localStorage.removeItem("auth_token");
    }
    set({ token });
  },
}));
