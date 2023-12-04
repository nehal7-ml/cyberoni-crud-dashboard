import { prisma } from "@/prisma/prismaClient";
import { NextRequest, NextResponse } from 'next/server'
import apiHandler from "@/errorHandler";
import { reset } from "@/crud/user";


export const { POST, DELETE, GET, PATCH, PUT } = apiHandler({ GET: get });

export const dynamic='force-dynamic'

async function get(req: NextRequest) {
    const token = req.nextUrl.searchParams.get('token');
    console.log(req.nextUrl.host, req.nextUrl.origin);
    const res = await reset(token as string, prisma)


    if (res) {
        return NextResponse.redirect(req.nextUrl.origin + '/auth/forgot?success=true');
    } else {

        return NextResponse.redirect(req.nextUrl.origin + '/auth/forgot?success=false');

    }


}