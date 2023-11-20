import { PrismaClientInitializationError, PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";


export type HttpError = Error & {
    status: number;
    message: string;
}


export default function errorHandler(error: HttpError | PrismaClientInitializationError | PrismaClientKnownRequestError | PrismaClientUnknownRequestError) {
    if (error.message) {
        let sendingError = error as HttpError
        return NextResponse.json({ message: sendingError.message }, { status: sendingError.status })

    } if (error.cause) {
        return NextResponse.json({ message: error.message }, { status: 500 })

    }

}