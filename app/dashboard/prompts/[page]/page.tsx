import Pagination from "@/components/Pagination";
import Table from "@/components/Table"
import { TableItem } from "@/components/TableItem";
import { getAllRecordsDTO } from "@/crud/commonDTO";
import { displayProductDTO } from "@/crud/product";
import { GptPrompt } from "@prisma/client";
import React, { useEffect, useState } from 'react'

async function Products({params}: {params: { page: string }} ) {
  const page = parseInt(params.page);
  const data = await getData(page);

  return (
    <main className="flex flex-col items-center  py-5">
      <Table headers={['view', 'ID', 'Description', 'profit', 'Times Used', 'times Integrated']}>
        {(data?.records as GptPrompt[]).map((value, index) => {
          const row: any = [];
          row.push(value.id);
          row.push(value.description);
          row.push(value.profitMargin);
          row.push(value.timesUsed);
          row.push(value.timesIntegrated);
          

          return <TableItem type="prompts" key={value.id} index={value.id} row={row}></TableItem>
        })}
      </Table>
      <Pagination currentPage={page} totalPages={data?.totalPages || 0}></Pagination>

    </main>
  )
}



async function getData(page:number) {
  let apiUrl = process.env.API_URL
  let res = await fetch(`${apiUrl}/prompts/all/${page}`);
  if (res.status == 200) {
    let resJson = await res.json() ;
    // console.log(resJson);
    return (resJson.data as getAllRecordsDTO);
  }

}
export default Products