import ReferralForm from "@/components/ReferralForm";
import { CreateReferralDTO } from "@/crud/DTOs";
import { read } from "@/crud/referral";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";

const CreateGptPromptForm = async ({ searchParams }: { searchParams: { id?: string, duplicate: boolean } }) => {
  //console.log(prompt);
  let template: CreateReferralDTO | undefined = undefined;
  if (searchParams.duplicate && searchParams.id) {

    const res = await read(searchParams.id, prisma);
    if (!res) redirect("/404");
    template = {...res, id: undefined} as CreateReferralDTO

  }

  return <ReferralForm method="POST" action={`/api/referrals/add`} initial={template} />;
};

export default CreateGptPromptForm;
