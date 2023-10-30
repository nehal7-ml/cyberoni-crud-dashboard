import { NextResponse } from "next/server";


    export type HttpError = Error & {
        status: number;
        message: string;
    }


export default function errorHandler(error: HttpError) {

    return NextResponse.json({ message: error.message }, { status: error.status })

}