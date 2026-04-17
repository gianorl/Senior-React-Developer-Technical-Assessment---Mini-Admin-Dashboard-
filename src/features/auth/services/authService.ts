import type { AuthResponse, User } from "@/types/api";

import type { PersistedAccount } from "../types";

/** Persisted sign-ups (mock app — mirrors bulletproof-react register → session flow). */
export const REGISTERED_USERS_STORAGE_KEY = "isp_connect_registered_users";

const MOCK_ACCOUNTS = [
  {
    id: "1",
    email: "admin@example.com",
    password: "password12",
    first_name: "Admin",
    last_name: "User",
  },
  {
    id: "2",
    email: "george.bluth@reqres.in",
    password: "password12",
    first_name: "George",
    last_name: "Bluth",
  },
] as const;

const MOCK_DELAY = 800;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readPersistedAccounts(): PersistedAccount[] {
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (row): row is PersistedAccount =>
        typeof row === "object" &&
        row !== null &&
        "id" in row &&
        "email" in row &&
        "password" in row &&
        "first_name" in row &&
        "last_name" in row &&
        typeof (row as PersistedAccount).id === "string" &&
        typeof (row as PersistedAccount).email === "string" &&
        typeof (row as PersistedAccount).password === "string" &&
        typeof (row as PersistedAccount).first_name === "string" &&
        typeof (row as PersistedAccount).last_name === "string",
    );
  } catch {
    return [];
  }
}

function writePersistedAccounts(accounts: PersistedAccount[]) {
  localStorage.setItem(REGISTERED_USERS_STORAGE_KEY, JSON.stringify(accounts));
}

function newUserId(): string {
  const c = globalThis.crypto;
  if (c?.randomUUID) return c.randomUUID();
  return `u-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function accountExistsForEmail(emailLower: string): boolean {
  if (MOCK_ACCOUNTS.some((a) => a.email.toLowerCase() === emailLower))
    return true;
  return readPersistedAccounts().some(
    (a) => a.email.toLowerCase() === emailLower,
  );
}

export async function loginWithEmailAndPassword(data: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  await delay(MOCK_DELAY);

  const emailLower = data.email.trim().toLowerCase();

  const account =
    MOCK_ACCOUNTS.find(
      (a) =>
        a.email.toLowerCase() === emailLower && a.password === data.password,
    ) ??
    readPersistedAccounts().find(
      (a) =>
        a.email.toLowerCase() === emailLower && a.password === data.password,
    );

  if (!account) {
    throw new Error("Invalid email or password");
  }

  const user: User = {
    id: account.id,
    email: account.email,
    first_name: account.first_name,
    last_name: account.last_name,
  };

  const token = btoa(`${user.id}:${user.email}:${Date.now()}`);

  return { token, user };
}

export async function registerWithEmailAndPassword(data: {
  fullName: string;
  email: string;
  password: string;
}): Promise<AuthResponse> {
  await delay(MOCK_DELAY);

  const emailTrimmed = data.email.trim();
  const emailLower = emailTrimmed.toLowerCase();

  if (accountExistsForEmail(emailLower)) {
    throw new Error("An account with this email already exists");
  }

  const parts = data.fullName.trim().split(/\s+/).filter(Boolean);
  const firstName = parts[0] ?? "Editor";
  const lastName = parts.length > 1 ? parts.slice(1).join(" ") : "Contributor";

  const record: PersistedAccount = {
    id: newUserId(),
    email: emailTrimmed,
    password: data.password,
    first_name: firstName,
    last_name: lastName,
  };

  const next = [...readPersistedAccounts(), record];
  writePersistedAccounts(next);

  const user: User = {
    id: record.id,
    email: record.email,
    first_name: record.first_name,
    last_name: record.last_name,
  };

  const token = btoa(`${user.id}:${user.email}:${Date.now()}`);

  return { token, user };
}

export async function fetchAuthUser(): Promise<User | null> {
  const token = localStorage.getItem("auth_token");
  const userData = localStorage.getItem("auth_user");

  if (!token || !userData) {
    return null;
  }

  await delay(100);

  return JSON.parse(userData) as User;
}

export async function logoutAuthSession(): Promise<void> {
  await delay(200);
  localStorage.removeItem("auth_token");
  localStorage.removeItem("auth_user");
}
