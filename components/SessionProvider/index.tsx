'use client'
import { SessionProvider as NextAuthSessionProvider, SessionProviderProps } from "next-auth/react";

function SessionProvider({ session, children }: SessionProviderProps) {
    return (<NextAuthSessionProvider session={session} >{children}</NextAuthSessionProvider>);
}

export default SessionProvider;