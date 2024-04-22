import GptPromptForm from "@/components/PromptForm";
import { getCategories, read } from "@/crud/prompt";
import { CreateGptPromptDTO } from "@/crud/DTOs";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";

const CreateGptPromptForm = async () => {
  const categories = await getCategories(prisma);
  return <GptPromptForm categories={categories} method="POST" action={`/api/prompts/add`} />;
};

export default CreateGptPromptForm;
