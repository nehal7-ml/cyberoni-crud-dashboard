import BlogForm from "@/components/BlogForm";
import CaseStudyForm from "@/components/CaseStudyForm";
import DiscountsForm from "@/components/DiscountForm";
import EventForm from "@/components/EventForm";
import ProductForm from "@/components/ProductForm";
import GptPromptForm from "@/components/PromptForm";
import ReferralForm from "@/components/ReferralForm";
import ServiceForm from "@/components/ServiceForm";
import UserForm from "@/components/UserForm";
import { CreateReferralDTO } from "@/crud/DTOs";
import { getCategories } from "@/crud/categories";
import { read as readReferral } from "@/crud/referral";
import { getAll as getAllServices } from "@/crud/service";
import { prisma } from "@/lib/prisma";
import { TableType } from "@/types/global";
import { redirect } from "next/navigation";

async function CreateForm({
  params,
  searchParams,
}: {
  params: { id: string; table: TableType };
  searchParams: { id?: string; duplicate?: "true" | "false" };
}) {
  if (params.table === "blogs") {
    const categories = await getCategories("blog", prisma);

    return (
      <BlogForm
        method="POST"
        action={`/api/blogs/add`}
        categories={categories}
      />
    );
  } else if (params.table === "casestudies") {
    const service = await getAllServices(0, 0, prisma);

    return (
      <CaseStudyForm
        types={service.records}
        method="POST"
        action={`/api/casestudies/add`}
      />
    );
  } else if (params.table === "discounts") {
    // console.log(event);
    return <DiscountsForm method="POST" action={`/api/discounts/add`} />;
  } else if (params.table === "events") {
    // console.log(event);
    return <EventForm method="POST" action={`/api/events/add`} />;
  } else if (params.table === "products") {
    const categories = await getCategories("product", prisma);
    // console.log(event);
    return (
      <ProductForm
        categories={categories}
        method="POST"
        action={`/api/products/add`}
      />
    );
  } else if (params.table === "prompts") {
    const categories = await getCategories("prompt", prisma);

    //console.log(prompt);
    return (
      <GptPromptForm
        categories={categories}
        method="POST"
        action={`/api/prompts/add`}
      />
    );
  } else if (params.table === "referrals") {
    let res: any | null;
    if (searchParams.id && searchParams.duplicate === "true") {
      res = await readReferral(searchParams.id, prisma);
      if (!res) redirect("/404");
    }

    // console.log(event);
    return (
      <ReferralForm
        method="POST"
        initial={res as CreateReferralDTO}
        action={`/api/referrals/add`}
      />
    );
  } else if (params.table === "services") {
    // console.log(service);
    return (
      <>
        <div className="light:bg-gray-100 light:text-black flex min-h-screen items-center justify-center dark:bg-gray-700 dark:text-gray-800">
          <ServiceForm method="POST" action={`/api/services/add`} />
        </div>
      </>
    );
  } else if (params.table === "users") {
    return <UserForm method="POST" action={`/api/users/add`} />;
  }

  return null;
}

export default CreateForm;
