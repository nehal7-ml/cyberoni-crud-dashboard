import EventForm from "@/components/EventForm";
import { read } from "@/crud/event";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import React, { useEffect, useState } from 'react';

const CreateEventForm = async ({ params }: { params: { id: string } }) => {
  const res = await read(params.id, prisma)
  if (!res) redirect('/404')
  const { imageId, ...event } = res
  // console.log(event);
  return (
    <EventForm method="PUT" initial={event} action={`/api/events/${params.id}`} />
  )
};

export default CreateEventForm;
