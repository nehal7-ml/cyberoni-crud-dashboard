import GptPromptForm from "@/components/PromptForm";
import { read } from "@/crud/prompt";
import { CreateGptPromptDTO } from "@/crud/DTOs";
import { prisma } from "@/prisma/prismaClient";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from 'react';

const UpdateGptPromptForm = async ({ params }: { params: { id: string } }) => {
  const res = await read(params.id, prisma);
  if (!res) redirect('/404')

  const { reviews, imageId, ...prompt } = res

  //console.log(prompt);
  return (
    <GptPromptForm method="PUT" initial={prompt} action={`/api/prompts/${params.id}`} />
  )
};

export default UpdateGptPromptForm;
