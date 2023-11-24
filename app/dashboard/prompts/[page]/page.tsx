import Pagination from "@/components/Pagination";
import Table from "@/components/Table"
import { TableItem } from "@/components/TableItem";
import { getAllRecordsDTO } from "@/crud/commonDTO";
import { displayProductDTO } from "@/crud/product";
import { getAll } from "@/crud/prompt";
import { prisma } from "@/prisma/prismaClient";
import { GptPrompt } from "@prisma/client";
import React, { useEffect, useState } from 'react'

async function Products({ params }: { params: { page: string } }) {
  const page = parseInt(params.page);
  const data = await getData(page) || { records: [], totalPages: 0 };

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



async function getData(page: number) {
  let res = await getAll(page, 10, prisma)
  return res

}
export default Products