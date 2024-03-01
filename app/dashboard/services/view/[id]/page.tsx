import React from "react";

import ServiceForm from "@/components/ServiceForm";
import { read } from "@/crud/service";
import {  CreateServiceDTO } from "@/crud/DTOs";
import { prisma } from "@/lib/prisma";

async function CreateServcie({ params }: { params: { id: string } }) {
  const service = (await read(params.id, prisma)) as CreateServiceDTO;
  // console.log(service);
  return (
    <>
      <div className="light:bg-gray-100 light:text-black flex min-h-screen items-center justify-center dark:bg-gray-700 dark:text-gray-800">
        <ServiceForm
          initial={service}
          method={"PUT"}
          action={`/api/services/${params.id}`}
        />
      </div>
    </>
  );
}

export default CreateServcie;
