import DiscountsForm from "@/components/DiscountForm";
import EventForm from "@/components/EventForm";
import ReferralForm from "@/components/ReferralForm";
import { read } from "@/crud/discount";
import { CreateDiscountDTO, CreateReferralDTO } from "@/crud/DTOs";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import React, { useEffect, useState } from "react";

const CreateEventForm = async ({ params }: { params: { id: string } }) => {
  const res = await read(params.id, prisma);
  if (!res) redirect("/404");
  const { ...discount } = res;
  // console.log(event);
  return (
    <DiscountsForm
      method="PUT"
      initial={discount as CreateDiscountDTO}
      action={`/api/discounts/${params.id}`}
    />
  );
};

export default CreateEventForm;
