'use client'
import Pagination from "@/components/Pagination";
import Table from "@/components/Table"
import { TableItem } from "@/components/TableItem";
import { displayBlogDTO } from "@/crud/blog";
import { getAllRecordsDTO } from "@/crud/commonDTO";
import { useParams } from "next/navigation";
import React from 'react'

async function Blogs() {

  const page = parseInt(useParams().page as string);
  const data = await getData(page);
  return (
    <main className="flex flex-col items-center py-5">
        <Table headers={['no.', 'Title','Featured', 'Date', 'Author', 'Template']}>
        {(data?.records as displayBlogDTO[]).map((value, index) => {
          const row: any = [];
          row.push(index+1)
          row.push(value.title);
          row.push(value.featured);
          row.push(value.date);
          row.push(value.userId);
          row.push(value.template);
          

          return <TableItem key={index} index={index} row={row}></TableItem>
        })}
        </Table>
        <Pagination currentPage={page} totalPages={data?.totalPages || 0}></Pagination>
    </main>
  )
}
async function getData(page:number) {
  let res = await fetch(`http://localhost:3000/api/blogs/all/${page}`);
  if (res.status == 200) {
    let resJson = await res.json() ;
    console.log(resJson);
    return (resJson.data as getAllRecordsDTO);
  }

}
export default Blogs