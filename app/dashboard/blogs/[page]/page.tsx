import Pagination from "@/components/Pagination";
import Table from "@/components/Table"
import { TableItem } from "@/components/TableItem";
import { DisplayBlogDTO } from "@/crud/blog";
import { getAllRecordsDTO } from "@/crud/commonDTO";
import React from 'react'

export const dynamic= 'force-dynamic'
async function Blogs({ params }: { params: { page: string } }) {
  const page = parseInt(params.page);
  const data = await getData(page) ||{ records: [], totalPages:0 };
  return (
    <main className="flex flex-col items-center py-5">
      <Table headers={['View', 'Title', 'Featured', 'Date', 'Author', 'Template']}>
        {(data?.records as DisplayBlogDTO[]).map((value, index) => {
          const row: any = [];
          row.push(value.title);
          row.push(value.featured);
          row.push(value.date);
          row.push(value.userId);
          row.push('default');

          return <TableItem type="blogs" key={value.id} index={value.id} row={row}></TableItem>
        })}
      </Table>
      <Pagination currentPage={page} totalPages={data?.totalPages || 0}></Pagination>
    </main>
  )
}
async function getData(page: number) {
  let apiUrl = process.env.API_URL;
  let res = await fetch(`${apiUrl}/blogs/all/${page}`);
  if (res.status == 200) {
    let resJson = await res.json();
    console.log(resJson);
    return (resJson.data as getAllRecordsDTO);
  }

}
export default Blogs