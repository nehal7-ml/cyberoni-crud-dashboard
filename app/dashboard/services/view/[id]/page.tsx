
import React from 'react'

import SerivceForm from "@/components/ServiceForm";
import { read } from "@/crud/service";
import { DisplayServiceDTO } from "@/crud/DTOs";
import { prisma } from "@/prisma/prismaClient";

async function CreateServcie({params}: {params: {id:string}}) {
    const service=  await read(params.id, prisma) as DisplayServiceDTO
    // console.log(service);
    return (
        <>
            <div className="light:bg-gray-100 light:text-black dark:bg-gray-700 dark:text-gray-800 min-h-screen flex items-center justify-center">
                <SerivceForm initial={service} method={'PUT'}  action={`/api/services/${params.id}`}/>
            </div>

        </>
    )
}

export default CreateServcie