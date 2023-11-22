import Pagination from "@/components/Pagination";
import Table from "@/components/Table"
import { TableItem } from "@/components/TableItem";
import { DisplayBlogDTO } from "@/crud/blog";
import { getAll } from "@/crud/casestudy";
import { getAllRecordsDTO } from "@/crud/commonDTO";
import React from 'react'
import { prisma } from "@/prisma/prismaClient";
import { CaseStudy } from "@prisma/client";
export const dynamic = 'force-dynamic'
async function Blogs({ params }: { params: { page: string } }) {
  const page = parseInt(params.page);
  const data = await getData(page) || { records: [], totalPages: 0 };
  return (
    <main className="flex flex-col items-center py-5">
      <Table headers={['View', 'Title', 'goals', 'preview']}>
        {(data?.records as CaseStudy[]).map((value, index) => {
          const row: any = [];
          row.push(value.title);
          row.push((value.goals as string[]).join('/n'));
          row.push(value.preview);
          return <TableItem type="casestudies" key={value.id} index={value.id} row={row}></TableItem>
        })}
      </Table>
      <Pagination currentPage={page} totalPages={data?.totalPages || 0}></Pagination>
    </main>
  )
}
async function getData(page: number) {
  let res = await getAll(page, 10, prisma)

  return (res as getAllRecordsDTO);


}
export default Blogs