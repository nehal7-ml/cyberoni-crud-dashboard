import BlogForm from "@/components/BlogForm";
import CaseStudyForm from "@/components/CaseStudyForm";
import DiscountsForm from "@/components/DiscountForm";
import EventForm from "@/components/EventForm";
import ProductForm from "@/components/ProductForm";
import GptPromptForm from "@/components/PromptForm";
import ReferralForm from "@/components/ReferralForm";
import ServiceForm from "@/components/ServiceForm";
import UserForm from "@/components/UserForm";
import { getCategories as  getBlogCategories } from "@/crud/blog";
import { CreateReferralDTO } from "@/crud/DTOs";
import { getCategories as getProductCategories } from "@/crud/product";
import { getCategories as getPromptCategories } from "@/crud/prompt";
import { read as readReferral } from "@/crud/referral";
import { getAll as getAllServices } from "@/crud/service";
import { prisma } from "@/lib/prisma";
import { TableType } from "@/types/global";
import { redirect } from "next/navigation";

async function CreateForm({
  params,
}: {
  params: { id: string; table: TableType };
}) {
  if (params.table === "blogs") {
    const categories = await getBlogCategories(prisma);

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
    const categories = await getProductCategories(prisma);
    // console.log(event);
    return <ProductForm categories={categories} method="POST" action={`/api/products/add`} />;
  } else if (params.table === "prompts") {
    const categories = await getPromptCategories(prisma);

    //console.log(prompt);
    return (
      <GptPromptForm
        categories={categories}
        method="POST"
        action={`/api/prompts/add`}
      />
    );
  } else if (params.table === "referrals") {
    const res = await readReferral(params.id, prisma);
    if (!res) redirect("/404");
    const { ...referral } = res;
    // console.log(event);
    return (
      <ReferralForm
        method="POST"
        initial={referral as CreateReferralDTO}
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
