import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const emailInput = (credentials.email as string).toLowerCase();
        const passwordInput = credentials.password as string;

        // ─── Environment-based Admin Credential Bypass ─────────────────────────
        const envAdminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
        const envAdminPassword = process.env.ADMIN_PASSWORD;

        if (envAdminEmail && envAdminPassword && emailInput === envAdminEmail && passwordInput === envAdminPassword) {
          // Check if admin user exists in DB first, if not create one or just return static
          let dbAdmin = await prisma.user.findUnique({
            where: { email: envAdminEmail },
          });

          if (!dbAdmin) {
            try {
              const hashedAdminPassword = await bcrypt.hash(envAdminPassword, 10);
              dbAdmin = await prisma.user.create({
                data: {
                  email: envAdminEmail,
                  password: hashedAdminPassword,
                  name: "System Administrator",
                  role: "ADMIN",
                },
              });
            } catch (err) {
              console.error("Failed to create admin in DB, using static session", err);
            }
          }

          return {
            id: dbAdmin?.id || "admin-static-id",
            email: envAdminEmail,
            name: dbAdmin?.name || "System Administrator",
            role: "ADMIN",
          };
        }

        // ─── Regular DB Authentication Check ───────────────────────────────────
        const user = await prisma.user.findUnique({
          where: { email: emailInput },
        });

        if (!user) return null;

        const passwordMatch = await bcrypt.compare(passwordInput, user.password);
        if (!passwordMatch) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
});
