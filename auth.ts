import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import pool from "@/app/lib/db";
import type { RowDataPacket } from "mysql2";

interface AuthUserRow extends RowDataPacket {
  id: number;
  username: string;
  email: string | null;
  password: string;
  role: string;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const [rows] = await pool.execute<AuthUserRow[]>(
          "SELECT * FROM users WHERE username = ?",
          [credentials.username as string],
        );

        if (rows.length === 0) return null;

        const user = rows[0];
        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password,
        );

        if (!isValid) return null;

        return {
          id: String(user.id),
          name: user.username,
          email: user.email ?? null,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
      }

      if (trigger === "update" && session) {
        if (typeof session.name === "string") {
          token.name = session.name;
        }
        if (typeof session.email === "string") {
          token.email = session.email;
        }
      }

      return token;
    },
    async session({ session, token }) {
      // Kirim data token ke sisi client
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 60 * 10,
    updateAge: 60 * 5,
  },

  pages: {
    signIn: "/login",
  },
});
