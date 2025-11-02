const Role = {
  ADMIN: "ROLE_ADMIN",
  USER: "ROLE_USER",
  ROOT: "ROLE_ROOT",
} as const;

export type Role = typeof Role[keyof typeof Role];