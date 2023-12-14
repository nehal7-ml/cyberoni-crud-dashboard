import { NextRequestWithAuth, withAuth } from "next-auth/middleware"
import { DisplayUserDTO } from "./crud/user"
import { JWT } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

export default withAuth(
    // `withAuth` augments your `Request` with the user's token.
    async function middleware(req: NextRequestWithAuth) {
        // console.log("middleware ",req.nextauth.token)

    },
    {
        callbacks: {
            authorized: async ({ token, req }) => {

                // console.log("authorize",token);

                if (token) {
                    return (isAdmin(token) || isSuper(token))
                } 
                else return false
            },

        },


    }
)


function isAdmin(token: JWT | null) {
    return (token?.user as DisplayUserDTO).role === "ADMIN"
}

function isSuper(token: JWT | null) {
    return (token?.user as DisplayUserDTO).role === "SUPERUSER"

}

function isUser(token: JWT | null) {
    return (token?.user as DisplayUserDTO).role === "USER"
}


export const config = { matcher: ["/", "/dashboard/:path*", "/api/((?!auth).*)"] }