import BlogForm from "@/components/BlogForm";
import CaseStudyForm from "@/components/CaseStudyForm";
import DiscountsForm from "@/components/DiscountForm";
import EventForm from "@/components/EventForm";
import ProductForm from "@/components/ProductForm";
import GptPromptForm from "@/components/PromptForm";
import ReferralForm from "@/components/ReferralForm";
import ServiceForm from "@/components/ServiceForm";
import UserForm from "@/components/UserForm";
import { read as readBlog } from "@/crud/blog";
import { read as readCaseStudy } from "@/crud/casestudy";
import { getCategories } from "@/crud/categories";
import { read as readDiscount } from "@/crud/discount";
import {
  BlogCategory,
  CreateBlogDTO,
  CreateCaseStudy,
  CreateDiscountDTO,
  CreateGptPromptDTO,
  CreateProductDTO,
  CreateReferralDTO,
  CreateServiceDTO,
} from "@/crud/DTOs";
import { read as readEvent } from "@/crud/event";
import { read as readProduct } from "@/crud/product";
import { read as readPrompt } from "@/crud/prompt";
import { read as readReferral } from "@/crud/referral";
import { getAll as getAllServices, read as readService } from "@/crud/service";
import { CreateUserDTO, read as readUser } from "@/crud/user";
import { prisma } from "@/lib/prisma";
import { TableType } from "@/types/global";
import { redirect } from "next/navigation";

async function UpdateForm({
  params,
}: {
  params: { id: string; table: TableType };
}) {
  if (params.table === "blogs") {
    const blog = (await readBlog(params.id, prisma)) as CreateBlogDTO;
    const categories = await getCategories("blog", prisma) as BlogCategory[];

    return (
      <BlogForm
        initial={blog}
        method="PUT"
        action={`/api/blogs/${params.id}`}
        categories={categories}
      />
    );
  } else if (params.table === "casestudies") {
    const caseStudy = (await readCaseStudy(
      params.id,
      prisma,
    )) as CreateCaseStudy;
    const service = await getAllServices(0, 0, prisma);

    if (caseStudy)
      return (
        <CaseStudyForm
          types={service.records}
          initial={caseStudy}
          method="PUT"
          action={`/api/casestudies/${params.id}`}
        />
      );
    else redirect("/404");
  } else if (params.table === "discounts") {
    const res = await readDiscount(params.id, prisma);
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
  } else if (params.table === "events") {
    const res = await readEvent(params.id, prisma);
    if (!res) redirect("/404");
    const { imageId, ...event } = res;
    // console.log(event);
    return (
      <EventForm
        method="PUT"
        initial={event}
        action={`/api/events/${params.id}`}
      />
    );
  } else if (params.table === "products") {
    const res = await readProduct(params.id, prisma);
    if (!res) redirect("/404");
    const { reviews, ...product } = res;

    const categories = await getCategories("product", prisma);

    // console.log(event);
    return (
      <ProductForm
        categories={categories}
        method="PUT"
        initial={product as CreateProductDTO}
        action={`/api/products/${params.id}`}
      />
    );
  } else if (params.table === "prompts") {
    const res = await readPrompt(params.id, prisma);
    if (!res) redirect("/404");
    const categories = await getCategories("prompt", prisma);

    const { reviews, ...prompt } = res;

    //console.log(prompt);
    return (
      <GptPromptForm
        categories={categories}
        method="PUT"
        initial={prompt as unknown as CreateGptPromptDTO}
        action={`/api/prompts/${params.id}`}
      />
    );
  } else if (params.table === "referrals") {
    const res = await readReferral(params.id, prisma);
    if (!res) redirect("/404");
    const { ...referral } = res;
    // console.log(event);
    return (
      <ReferralForm
        method="PUT"
        initial={referral as CreateReferralDTO}
        action={`/api/referrals/${params.id}`}
      />
    );
  } else if (params.table === "services") {
    const service = (await readService(params.id, prisma)) as CreateServiceDTO;
    // console.log(service);
    return (
      <>
        <div className="light:bg-gray-100 light:text-black flex min-h-screen items-center justify-center dark:bg-gray-700 dark:text-gray-800">
          <ServiceForm
            initial={service}
            method={"PUT"}
            action={`/api/services/${params.id}`}
          />
        </div>
      </>
    );
  } else if (params.table === "users") {
    const user = (await readUser(params.id, prisma)) as CreateUserDTO;
    return (
      <UserForm
        method="PUT"
        initial={user}
        action={`/api/users/${params.id}`}
      />
    );
  }

  return null;
}

export default UpdateForm;
