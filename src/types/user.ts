import type { Role } from "./role";

export type UserRequest = {
  username: string;
  userEmail: string;
  password: string;
  role: Role;
}

export type UserResponse = {
  userId: string;
  username: string;
  userEmail: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
}

export type UserFrontendEntry = {
  userId: string;
  username: string;
  userEmail: string;
  password: string;
  role: Role;
  lastLoginAt: string | null;
}

export type UserFormState = {
  open: boolean;
  current: UserFrontendEntry;
  title: string;
  isUpdate: boolean;
}