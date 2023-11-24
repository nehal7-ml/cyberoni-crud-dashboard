import GptPromptForm from "@/components/PromptForm";
import { CreateGptPromptDTO, read } from "@/crud/prompt";
import { prisma } from "@/prisma/prismaClient";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from 'react';

const CreateGptPromptForm = async () => {

  //console.log(prompt);
  return (
    <GptPromptForm method="POST"  action={`/api/prompts/add`} />
  )
};

export default CreateGptPromptForm;
