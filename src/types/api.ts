export type User = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type PaginatedResponse<T> = {
  first: number;
  prev: number | null;
  next: number | null;
  last: number;
  pages: number;
  items: number;
  data: T[];
};
