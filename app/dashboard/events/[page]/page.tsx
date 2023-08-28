import Pagination from "@/components/Pagination";
import Table from "@/components/Table"
import { TableItem } from "@/components/TableItem";
import { getAllRecordsDTO } from "@/crud/commonDTO";
import { Event } from "@prisma/client";
import React from 'react'
export const dynamic = 'force-dynamic';

async function Events({ params }: { params: { page: string } }) {
  const page = parseInt(params.page);
  const data = await getData(page);

  return (
    <main className="flex flex-col items-center py-5">
        <Table headers={['no.', 'Name','Date', 'Location', 'Link', 'Status']}>
        {(data?.records as Event[]).map((value, index) => {
          const row: any = [];
          row.push(index + 1)
          row.push(value.name);
          row.push(value.date);
          row.push(value.location);
          row.push(value.eventLink);
          row.push(value.status);

          return <TableItem key={index} index={index} row={row}></TableItem>
        })} 
        </Table>
        <Pagination currentPage={page} totalPages={data?.totalPages || 0}></Pagination>

    </main>
  )
}


async function getData(page: number) {
  let apiUrl = process.env.API_URL
  let res = await fetch(`${apiUrl}/events/all/${page}`);
  if (res.status == 200) {
    let resJson = await res.json();
     console.log(resJson.data);
    return (resJson.data as getAllRecordsDTO);
  }

}

export default Events