import verifyOrgAccess from "@/app/dashboard/verifyOrgAccess";
import BlogForm from "@/components/BlogForm";
import CaseStudyForm from "@/components/CaseStudyForm";
import DiscountsForm from "@/components/DiscountForm";
import EventForm from "@/components/EventForm";
import ProductForm from "@/components/ProductForm";
import GptPromptForm from "@/components/PromptForm";
import ReferralForm from "@/components/ReferralForm";
import ServiceForm from "@/components/ServiceForm";
import SoftwareProductForm from "@/components/SoftwareProductForm";
import UserForm from "@/components/UserForm";
import { read as readBlog } from "@/crud/blog";
import { read as readCaseStudy } from "@/crud/casestudy";
import { getCategories } from "@/crud/categories";
import { read as readDiscount } from "@/crud/discount";
import {
  BlogCategory,
  CreateBlogDTO,
  CreateCaseStudyDTO,
  CreateDiscountDTO,
  CreateGptPromptDTO,
  CreateProductDTO,
  CreateReferralDTO,
  CreateServiceDTO,
  CreateSoftwareProductDTO,
  DisplayBlogDTO,
} from "@/crud/DTOs";
import { read as readEvent } from "@/crud/event";
import { read as readProduct } from "@/crud/product";
import { read as readPrompt } from "@/crud/prompt";
import { read as readReferral } from "@/crud/referral";
import { getAll as getAllServices, read as readService } from "@/crud/service";
import { read as readSoftware } from "@/crud/softwareProduct";
import { CreateUserDTO, read as readUser } from "@/crud/user";
import { authOptions } from "@/lib/nextAuthAdapter";
import { prisma } from "@/lib/prisma";
import verifyAccess from "@/lib/verifyAccess";
import { TableType } from "@/types/global";
import { Metadata } from "next";
import { getServerSession, User } from "next-auth";
import { redirect } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: { table: string };
}) {
  return {
    title: `update ${params.table}`,
  } as Metadata;
}

async function UpdateForm({
  params,
}: {
  params: { orgId: string; id: string; table: TableType };
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(
      `/auth/login?${new URLSearchParams({ callbackUrl: `/dashboard/${params.table}/view/${params.id}` })}`,
    );
  }

  let user = session.user as User;

  if (params.table === "blogs") {
    const blog = (await readBlog(params.id, user)) as unknown as CreateBlogDTO;
    const categories = (await getCategories("blog", user)) as BlogCategory[];

    if (!blog) redirect("/404");

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
      user,
    )) as CreateCaseStudyDTO;
    const service = await getAllServices(0, 0, {
      id: session.user.id as string,
      role: session.user.role,
      orgId: session.user.orgId,
    });

    if (caseStudy) {
      return (
        <CaseStudyForm
          types={service.records}
          initial={caseStudy}
          method="PUT"
          action={`/api/casestudies/${params.id}`}
        />
      );
    } else redirect("/404");
  } else if (params.table === "discounts") {
    const discount = await readDiscount(params.id, user);
    if (!discount) redirect("/404");
    // console.log(event);
    return (
      <DiscountsForm
        method="PUT"
        initial={discount as CreateDiscountDTO}
        action={`/api/discounts/${params.id}`}
      />
    );
  } else if (params.table === "events") {
    const res = await readEvent(params.id, user);
    if (!res) redirect("/404");
    const { ...event } = res;
    return (
      <EventForm
        method="PUT"
        initial={event}
        action={`/api/events/${params.id}`}
      />
    );
  }

  // else if (params.table === "products") {
  //   const res = await readProduct(params.id, user);
  //   if (!res) redirect("/404");
  //   const { reviews, ...product } = res;

  //   const categories = await getCategories("product", user);

  //   // console.log(event);
  //   return (
  //     <ProductForm
  //       categories={categories}
  //       method="PUT"
  //       initial={product as CreateProductDTO}
  //       action={`/api/products/${params.id}`}
  //     />
  //   );
  // } else if (params.table === "prompts") {
  //   const res = await readPrompt(params.id, user);
  //   if (!res) redirect("/404");
  //   const categories = await getCategories("prompt", user);

  //   const { reviews, ...prompt } = res;

  //   //console.log(prompt);
  //   return (
  //     <GptPromptForm
  //       categories={categories}
  //       method="PUT"
  //       initial={prompt as unknown as CreateGptPromptDTO}
  //       action={`/api/prompts/${params.id}`}
  //     />
  //   );
  // } 


  else if (params.table === "referrals") {
    const res = await readReferral(params.id, user);
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
  } else if (params.table === "softwares") {
    const res = await readSoftware(params.id, user);
    if (!res) redirect("/404");
    const { updatedAt, createdAt, ...software } = res;
    const categories = await getCategories("software", user);

    // console.log(event);
    return (
      <SoftwareProductForm
        categories={categories}
        method="PUT"
        initial={software as unknown as CreateSoftwareProductDTO}
        action={`/api/softwares/${params.id}`}
      />
    );
  } else if (params.table === "services") {
    const res = (await readService(params.id, user)) as CreateServiceDTO;
    if (!res) redirect("/404");
    const { ...service } = res;
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
    const retrievedUser = (await readUser(params.id, user)) as CreateUserDTO;
    return (
      <UserForm
        method="PUT"
        initial={retrievedUser}
        action={`/api/users/${params.id}`}
      />
    );
  }

  return null;
}

export default UpdateForm;
