import Credentials from "next-auth/providers/credentials";
import { NextAuthOptions, RequestInternal } from "next-auth";
import { authorizeWithPassword } from "@/crud/user";
import { prisma } from "@/lib/prisma";
import { AdapterUser } from "next-auth/adapters";

export const authOptions: NextAuthOptions = {
  //adapter: MyAdapter(prisma),
  providers: [
    Credentials({
      name: "credentials",
      type: "credentials",
      credentials: {
        username: {
          label: "Email",
          type: "text",
          placeholder: "jsmith@email.com",
        },
        password: { label: "Password", type: "password" },
      },
      authorize,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",


  },

  callbacks: {
    jwt: async ({ token, user, session, trigger }) => {

      user && (token.user = user);
      if (trigger === "update" && session?.name) {
        // Note, that `session` can be any arbitrary object, remember to validate it!
        token.name = session.name;
        session.user = user;
        token.user = user
        //token.user = user
      }
      //console.log("jwt", token);

      return token;
    },
    session: async ({ session, token }) => {
      // console.log("session", token.user);

      token.user && (session.user = token.user as AdapterUser);

      return session;
    },
  },
};

async function authorize(
  credentials: Record<"password" | "username", string> | undefined,
  req: Pick<RequestInternal, "query" | "body" | "headers" | "method">,
) {
  try {
    const user = await authorizeWithPassword(
      { email: credentials?.username!, password: credentials?.password! },
    );
    if (user) {
      return {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
        orgId: user.Organization[0].id,
        organizations: user.Organization
      };
    } else return null;
    // console.log(user);
  } catch (error) {
    console.log(error);
    return null;
  }
  // If no error and we have user data, return it
}
