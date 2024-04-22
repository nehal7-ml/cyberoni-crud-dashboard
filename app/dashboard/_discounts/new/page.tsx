import DiscountsForm from "@/components/DiscountForm";

import React from "react";

const CreateGptPromptForm = async () => {
  //console.log(prompt);
  return <DiscountsForm method="POST" action={`/api/discounts/add`} />;
};

export default CreateGptPromptForm;
