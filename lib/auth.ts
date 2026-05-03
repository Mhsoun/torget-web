import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { login } from "@/lib/api";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const data = await login({
            email: credentials.email as string,
            password: credentials.password as string,
          });

          return {
            id: credentials.email as string,
            email: credentials.email as string,
            accessToken: data.token,
            tokenExpiresAt: data.expiresAt,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as { accessToken?: string }).accessToken;
        token.tokenExpiresAt = (user as { tokenExpiresAt?: string }).tokenExpiresAt;
        token.authError = undefined;
      }

      if (token.tokenExpiresAt) {
        const expiresAt = Date.parse(token.tokenExpiresAt as string);
        if (!Number.isNaN(expiresAt) && Date.now() >= expiresAt) {
          token.accessToken = undefined;
          token.tokenExpiresAt = undefined;
          token.authError = "token_expired";
        }
      }

      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string | undefined;
      session.tokenExpiresAt = token.tokenExpiresAt as string | undefined;
      session.authError = token.authError as string | undefined;
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
});
