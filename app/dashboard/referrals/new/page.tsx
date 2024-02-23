import EventForm from "@/components/EventForm";
import ReferralForm from "@/components/ReferralForm";

import React, { useEffect, useState } from "react";

const CreateGptPromptForm = async () => {
  //console.log(prompt);
  return <ReferralForm method="POST" action={`/api/referrals/add`} />;
};

export default CreateGptPromptForm;
