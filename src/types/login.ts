import type { Role } from "./role";

export type AuthRequest = {
  userEmail: string;
  password: string;
  rememberMe?: boolean;
}

export type AuthResponse = {
  userEmail: string;
  role: Role | null;
}

export type LoginResponse = {
  data?: AuthResponse;
  error?: string;
}
