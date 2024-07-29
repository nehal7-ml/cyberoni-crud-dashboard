import { Account, Organization, Role } from "@prisma/client";
import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            /** Oauth access token */
            role: Role;
            id?: string;
            orgId: string;
            organizations? : Organization[]


        } & DefaultSession["user"];
    }

    interface User extends DefaultUser {
        id?: string;
        role: Role;
        orgId: string;
        organizations? : Organization[]

    }
}


