import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import pool from '@/app/lib/db';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const [rows]: any = await pool.execute(
          'SELECT * FROM users WHERE username = ?',
          [credentials.username]
        );

        if (rows.length === 0) return null;

        const user = rows[0];
        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) return null;

        // Objek ini akan disimpan di dalam JWT token
        return {
          id: String(user.id),
          name: user.username,
          email: user.email ?? null,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // Saat pertama login, simpan username ke token
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      // Kirim data token ke sisi client
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },

  session: {
    strategy: 'jwt',
  },

  pages: {
    signIn: '/login',
  },
});
