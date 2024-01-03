import { PrismaClientInitializationError, PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";


export type HttpError = Error & {
    status: number;
    message: string;
}


export default function errorHandler(error: HttpError | PrismaClientInitializationError | PrismaClientKnownRequestError | PrismaClientUnknownRequestError) {
    if ((error as HttpError).status) {
        let sendingError = error as HttpError
        console.error("Error HTTP: ", error);
        return NextResponse.json({ message: sendingError.message }, { status: sendingError.status || 500 })

    } else  {
        let err = error as PrismaClientInitializationError | PrismaClientKnownRequestError | PrismaClientUnknownRequestError
        if((err as PrismaClientKnownRequestError ).code ==='P2025' && err.message.includes('BlogToUser')) {
            return NextResponse.json({ message: "Author email not found"}, { status: 400 })
        }
        return NextResponse.json({ message: err.message}, { status: 500 })

    }

}