import NextAuth, { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/prisma/prismaClient";

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
  ],
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
