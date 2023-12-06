import EventForm from "@/components/EventForm";
import ReferralForm from "@/components/ReferralForm";
import { read } from "@/crud/referral";
import { prisma } from "@/prisma/prismaClient";
import { redirect } from "next/navigation";

import React, { useEffect, useState } from 'react';

const CreateEventForm = async ({ params }: { params: { id: string } }) => {
  const res = await read(params.id, prisma)
  if (!res) redirect('/404')
  const { ...referral } = res
  // console.log(event);
  return (
    <ReferralForm method="PUT" initial={referral} action={`/api/referrals/${params.id}`} />
  )
};

export default CreateEventForm;
