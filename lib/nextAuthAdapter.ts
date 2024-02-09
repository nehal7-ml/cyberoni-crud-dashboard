import Credentials from "next-auth/providers/credentials";
import { NextAuthOptions, RequestInternal } from "next-auth";
import { authorizeWithPassword } from "@/crud/user";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
    //adapter: MyAdapter(prisma),
    providers: [
        Credentials({
            name: "credentials",
            type: 'credentials',
            credentials: {
                username: { label: "Email", type: "text", placeholder: "jsmith@email.com" },
                password: { label: "Password", type: "password" }
            },
            authorize,

        })
    ],
    pages: {
        signIn: '/auth/signin',
        
    },


    callbacks: {
        jwt: async ({ token, user, session, trigger }) => {
            user && (token.user = user)
            if (trigger === "update" && session?.name) {
                // Note, that `session` can be any arbitrary object, remember to validate it!
                token.name = session.name
                //token.user = user
            }
            return token
        },
        session: async ({ session, token }) => {
            token.user && (session.user = token.user)

            return session
        },

    }
};



async function authorize(credentials: Record<"password" | "username", string> | undefined, req: Pick<RequestInternal, "query" | "body" | "headers" | "method">) {
    try {
        const user = await authorizeWithPassword({ email: credentials?.username!, password: credentials?.password! }, prisma)
        if (user) {
            return user
        }
        else return null
        // console.log(user);
    } catch (error) {
        console.log(error);
        return null

    }
    // If no error and we have user data, return it

}

// export default function MyAdapter(client: PrismaClient, options = {}): Adapter {
//     return {
//         async createUser(user: Omit<AdapterUser, "id">) {
//             const newUser = await createAgent(user as CreateUserDTO & AdapterUser, client);
//             return newUser as AdapterUser
//         },
//         async getUser(id: string) {
//             const user = await getUser(id, client);
//             return user as CreateUserDTO & AdapterUser
//         },
//         async getUserByEmail(email: string) {
//             const user = await userByEmail(email, client);
//             return user
//         },
//         async getUserByAccount({ providerAccountId, provider }: { providerAccountId: string, provider: string }) {
//             const emptyAccount = {} as GuruAgent
//             return emptyAccount
//         },
//         async updateUser(user) {
//             const updatedUser = await update(user.id, user as CreateUserDTO, client)
//             return updatedUser
//         },
//         async deleteUser(userId: string) {
//             const deleted = await remove(userId, client);
//             return
//         },
//         async linkAccount(account) {
//             return
//         },
//         async unlinkAccount({ providerAccountId, provider }) {
//             return
//         },
//         async createSession({ sessionToken, userId, expires }) {
//             const session = await createSession({ sessionToken, userId, expires }, client)
//             // console.log(session)
//             console.log("create sesssion called");
//             return session
//         },
//         async getSessionAndUser(sessionToken) {
//             console.log(sessionToken, ";;;topkenm is");

//             try {
//                 const session = (await getSession(sessionToken, client))
//                 return { session, user: session.guruAgent as DisplayGuruAgentDTO & AdapterUser }

//             } catch (error) {
//                 const { message } = error as HttpError;
//                 console.log(error);
//             }

//             return null
//         },
//         async updateSession({ sessionToken }) {
//             console.log("update sesssion called");

//             const session = await prismaSessionUpdate(sessionToken, client)
//             return session
//         },
//         async deleteSession(sessionToken) {
//             return
//         },
//         async createVerificationToken({ identifier, expires }) {
//             const token = await createVerifyToken({ identifier, expires }, client)
//             return token
//         },
//         async useVerificationToken({ identifier, token }) {
//             const usedToken = await useToken({ identifier, token }, client);
//             return usedToken as VerificationToken
//         },
//     }
// }