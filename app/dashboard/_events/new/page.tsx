import EventForm from "@/components/EventForm";

import React, { useEffect, useState } from "react";

const CreateGptPromptForm = async () => {
  //console.log(prompt);
  return <EventForm method="POST" action={`/api/events/add`} />;
};

export default CreateGptPromptForm;
