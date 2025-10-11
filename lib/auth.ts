import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./db";
import { Adapter } from "next-auth/adapters";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
  callbacks: {
    // Add additional properties to jwt here.
    // Properties added should be added in @/app/_types/next-auth.d.ts for type safety
    // `jwt` callback is called first, then `session` callback is called
    // Anything set in jwt callback is available in session callback
    jwt: async ({ token, user, account }) => {
      // If user.id wasn't set above (subsequent requests), use token.sub
      if (token.sub) {
        token.id = token.sub;
      }
      // if (account?.provider === "google" && user) {
      // If user logs in through google oAuth, It doesn't go through registration process.
      // This is the place to create db entry for the user trying login first time.
      // }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};
