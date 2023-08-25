import Pagination from "@/components/Pagination";
import Table from "@/components/Table"
import { TableItem } from "@/components/TableItem";
import { getAllRecordsDTO } from "@/crud/commonDTO";
import { Service } from "@prisma/client";
import React from 'react'
export const dynamic = 'force-dynamic'

async function Services({params }: {params: { page: string } }) {

  const page = parseInt(params.page as string);
  const data = await getData(page);
  return (
    <main className="flex flex-col items-center py-5">
        <Table  headers={['no.', 'Service Name','Rate', 'value Bought', 'skills used']}>
        {(data?.records as Service[] || []).map((value, index) => {
          const row: any = [];
          row.push(index+1)
          row.push(value.title);
          row.push(value.hourlyRate);
          row.push(value.valueBrought);
          row.push(value.skillsUsed);        

          return <TableItem key={index} index={index} row={row}></TableItem>
        })}
        </Table>
        <Pagination currentPage={page} totalPages={data?.totalPages || 0}></Pagination>
    </main>
  )
}
async function getData(page:number) {
  let apiUrl = process.env.API_URL
  let res = await fetch(`${apiUrl}/services/all/${page}`);
  if (res.status == 200) {
    let resJson = await res.json() ;
      console.log(resJson.data);
    return (resJson.data as getAllRecordsDTO);
  }

}
export default Services