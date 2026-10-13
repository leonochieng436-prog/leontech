import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { z } from "zod";
import { createHash } from "node:crypto";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  pages: { signIn: "/admin/login" },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(credentials, request) {
        const parsed = z.object({ email: z.string().email().max(254), password: z.string().min(1).max(128) }).safeParse(credentials);
        if (!parsed.success) return null;
        const email = parsed.data.email.toLowerCase();
        const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
        const key = createHash("sha256").update(`${ip}:${email}`).digest("hex");
        const windowStart = new Date(Math.floor(Date.now() / (15 * 60 * 1000)) * (15 * 60 * 1000));
        const bucket = await prisma.rateLimitBucket.upsert({
          where: { key_windowStart: { key, windowStart } },
          create: { key, windowStart, count: 1 },
          update: { count: { increment: 1 } },
          select: { count: true },
        });
        if (bucket.count > 10) return null;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.isActive || !(await compare(parsed.data.password, user.passwordHash))) return null;
        return { id: user.id, name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = token.role as "SUPER_ADMIN" | "ADMIN" | "EDITOR";
      }
      return session;
    },
  },
});
