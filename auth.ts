// auth.ts (Corrected)

import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./lib/db";
import authConfig from "./auth.config";
import { getUserById } from "./modules/auth/actions";

export const { handlers, signIn, signOut, auth } = NextAuth({
  callbacks: {

    async jwt({ token }) {
      if (!token.sub) return token;

      const exitingUser = await getUserById(token.sub); //sub==id
      if (!exitingUser) return token;

      token.name = exitingUser.name;
      token.email = exitingUser.email;
      

      token.role = exitingUser.roles; 

      return token;
    },

    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub as string;
      }
      // This will now work because token.role is correctly set
      if (token.role && session.user) {
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" }, // This is correct
  ...authConfig,
});