import GptPromptForm from "@/components/PromptForm";
import { read } from "@/crud/prompt";
import { CreateGptPromptDTO } from "@/crud/DTOs";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";

const CreateGptPromptForm = async () => {
  //console.log(prompt);
  return <GptPromptForm method="POST" action={`/api/prompts/add`} />;
};

export default CreateGptPromptForm;
