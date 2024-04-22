import FeaturedCheckbox from "@/components/BlogForm/FeaturedCheckBox";
import BlogTable from "@/components/DashboardTableItems/BlogTableItems";
import CaseStudyTable from "@/components/DashboardTableItems/CaseStudyTableItem";
import DiscountTableItems from "@/components/DashboardTableItems/DiscountTableItem";
import EventTableItems from "@/components/DashboardTableItems/EventTableItem";
import ProductTableItems from "@/components/DashboardTableItems/ProductTableItems";
import PromptTableItems from "@/components/DashboardTableItems/PromptTableItem";
import ReferralTableItems from "@/components/DashboardTableItems/ReferralTableItem";
import ServiceTableItems from "@/components/DashboardTableItems/ServiceTableItems";
import UserTableItems from "@/components/DashboardTableItems/UserTableItem";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import { TableItem } from "@/components/Table/TableItem";
import { getAll as getAllBlogs } from "@/crud/blog";
import { getAll as getAllCaseStudies } from "@/crud/casestudy";
import { getAll as getAllDiscounts } from "@/crud/discount";
import { CreateBlogDTO, DisplayBlogDTO, DisplayProductDTO } from "@/crud/DTOs";
import { getAll as getAllEvents } from "@/crud/event";
import { getAll as getAllProducts } from "@/crud/product";
import { getAll as getAllPrompts } from "@/crud/prompt";
import { getAll as getAllReferrals } from "@/crud/referral";
import { getAll as getAllServices } from "@/crud/service";
import { DisplayUserDTO, getAll as getAllUser } from "@/crud/user";
import { prisma } from "@/lib/prisma";
import { seoUrl, stripSlashes } from "@/lib/utils";
import { TableType } from "@/types/global";
import {
  CaseStudy,
  Discount,
  Event,
  GptPrompt,
  Referral,
  Service,
} from "@prisma/client";
import React, { ReactNode, useMemo } from "react";

export const dynamic = "force-dynamic";


async function Blogs({
  params,
  searchParams,
}: {
  params: { table: TableType; page: string };
  searchParams: { orderBy: "updatedAt" | "title"; order: "asc" | "desc" };
}) {
  const page = parseInt(params.page);
  const data = (await getData(page, params.table, searchParams)) || {
    records: [],
    totalPages: 0,
  };

  let rows = [] as ReactNode[];

  return (
    <main className="flex flex-col items-center py-5">
      {params.table === "blogs" ? (
        <BlogTable  page={page} records={data.records as DisplayBlogDTO[]} />
      ) : params.table === "casestudies" ? (
        <CaseStudyTable  page={page} records={data.records as CaseStudy[]} />
      ) : params.table === "discounts" ? (
        <DiscountTableItems  page={page} records={data.records as Discount[]} />
      ) : params.table === "events" ? (
        <EventTableItems  page={page} records={data.records as Event[]} />
      ) : params.table === "products" ? (
        <ProductTableItems  page={page}  records={data.records as DisplayProductDTO[]} />
      ) : params.table === "prompts" ? (
        <PromptTableItems   page={page} records={data.records as GptPrompt[]} />
      ) : params.table === "referrals" ? (
        <ReferralTableItems   page={page} records={data.records as Referral[]} />
      ) : params.table === "services" ? (
        <ServiceTableItems  page={page} records={data.records as Service[]} />
      ) : params.table === "users" ? (
        <UserTableItems page={page} records={data.records as DisplayUserDTO[]} />
      ) : (
        rows
      )}
      <Pagination
        currentPage={page}
        totalPages={data?.totalPages || 0}
      ></Pagination>
    </main>
  );
}
async function getData(
  page: number,
  table: TableType,
  searchParams: {
    orderBy: "updatedAt" | "title" | "name" | "email" | "prefix";
    order: "asc" | "desc";
  },
) {
  if (table === "blogs") {
    let res = await getAllBlogs(page, 10, prisma, {
      orderby: searchParams.orderBy as "updatedAt" | "title",
      order: searchParams.order,
    });
    return res;
  }
  if (table === "casestudies") {
    let res = await getAllCaseStudies(page, 10, prisma, {
      orderby: searchParams.orderBy as "updatedAt" | "title",
      order: searchParams.order,
    });
    return res;
  }
  if (table === "discounts") {
    let res = await getAllDiscounts(page, 10, prisma, {
      orderby: searchParams.orderBy as "updatedAt" | "name",
      order: searchParams.order,
    });
    return res;
  }
  if (table === "events") {
    let res = await getAllEvents(page, 10, prisma, {
      orderby: searchParams.orderBy as "updatedAt" | "name",
      order: searchParams.order,
    });
    return res;
  }
  if (table === "products") {
    let res = await getAllProducts(page, 10, prisma, {
      orderby: searchParams.orderBy as "updatedAt" | "title",
      order: searchParams.order,
    });
    return res;
  }
  if (table === "prompts") {
    let res = await getAllPrompts(page, 10, prisma, {
      orderby: searchParams.orderBy as "updatedAt" | "title",
      order: searchParams.order,
    });
    return res;
  }
  if (table === "referrals") {
    let res = await getAllReferrals(page, 10, prisma, {
      orderby: searchParams.orderBy as "updatedAt" | "prefix" | 'expires' | 'click',
      order: searchParams.order,
    });
    return res;
  }
  if (table === "services") {
    let res = await getAllServices(page, 10, prisma, {
      orderby: searchParams.orderBy as "updatedAt" | "title",
      order: searchParams.order,
    });
    return res;
  }
  if (table === "users") {
    let res = await getAllUser(page, 10, prisma, {
      orderby: searchParams.orderBy as "updatedAt" | "email",
      order: searchParams.order,
    });
    return res;
  }
}
export default Blogs;
