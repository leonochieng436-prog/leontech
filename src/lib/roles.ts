export type Role = "SUPER_ADMIN" | "ADMIN" | "EDITOR";
export type Permission =
  | "content:read"
  | "content:write"
  | "inquiries:read"
  | "inquiries:write"
  | "pricing:read"
  | "pricing:write"
  | "services:write"
  | "users:manage"
  | "settings:manage";

const permissions: Record<Role, ReadonlySet<Permission>> = {
  SUPER_ADMIN: new Set(["content:read", "content:write", "inquiries:read", "inquiries:write", "pricing:read", "pricing:write", "services:write", "users:manage", "settings:manage"]),
  ADMIN: new Set(["content:read", "content:write", "inquiries:read", "inquiries:write", "pricing:read", "pricing:write", "services:write", "settings:manage"]),
  EDITOR: new Set(["content:read", "content:write"]),
};

export function can(role: Role, permission: Permission) {
  return permissions[role]?.has(permission) ?? false;
}
