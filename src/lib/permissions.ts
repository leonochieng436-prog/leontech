import "server-only";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { can, type Permission } from "@/lib/roles";

export async function requireRole(permission: Permission) {
  const session = await auth();
  if (!session?.user?.id) redirect("/admin/login");
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { id: true, name: true, role: true, isActive: true } });
  if (!user?.isActive || !can(user.role, permission)) redirect("/admin/login");
  return { id: user.id, name: user.name, role: user.role };
}
