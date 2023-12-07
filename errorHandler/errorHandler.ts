import { PrismaClientInitializationError, PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";


export type HttpError = Error & {
    status: number;
    message: string;
}


export default function errorHandler(error: HttpError | PrismaClientInitializationError | PrismaClientKnownRequestError | PrismaClientUnknownRequestError) {
    if (error.message) {
        let sendingError = error as HttpError
        console.error("Error: ",error);
        return NextResponse.json({ message: sendingError.message }, { status: sendingError.status || 500 })

    } if (error.cause) {
        console.error("Error: ",error);
        return NextResponse.json({ message: error.message }, { status: 500 })

    }

}