import FeaturedCheckbox from "@/components/BlogForm/FeaturedCheckBox";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import { TableItem } from "@/components/TableItem";
import { getAll } from "@/crud/blog";
import { CreateBlogDTO, DisplayBlogDTO } from "@/crud/DTOs";
import { prisma } from "@/lib/prisma";
import { seoUrl, stripSlashes } from "@/lib/utils";
import { Check } from "lucide-react";
import React from "react";

export const dynamic = "force-dynamic";
async function Blogs({ params }: { params: { page: string } }) {
  const page = parseInt(params.page);
  const data = (await getData(page)) || { records: [], totalPages: 0 };

  return (
    <main className="flex flex-col items-center py-5">
      <Table
        view={true}
        headers={["Title", "Featured", "Date", "Author", "Template"]}
      >
        {(data?.records as DisplayBlogDTO[]).map((value, index) => {
          const row: any = [];
          row.push(value.title);
          row.push(
            <FeaturedCheckbox initial={value as CreateBlogDTO} action={`/api/blogs/${value.id}`} />,
          );
          row.push(value.date.toLocaleDateString());
          row.push(
            value.author.firstName
              ? value.author.firstName
              : value.author.email,
          );
          row.push("default");

          return (
            <TableItem
              type="blogs"
              key={value.id}
              index={value.id}
              row={row}
              viewLink={`${stripSlashes(process.env.NEXT_PUBLIC_APP_URL!)}/blogs/post/${seoUrl(value.title, value.id)}`}
            ></TableItem>
          );
        })}
      </Table>
      <Pagination
        currentPage={page}
        totalPages={data?.totalPages || 0}
      ></Pagination>
    </main>
  );
}
async function getData(page: number) {
  let res = await getAll(page, 10, prisma);
  // console.log(res);
  return res;
}
export default Blogs;
