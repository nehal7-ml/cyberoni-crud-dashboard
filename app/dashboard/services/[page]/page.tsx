import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import { TableItem } from "@/components/TableItem";
import { getAllRecordsDTO } from "@/crud/commonDTO";
import { getAll } from "@/crud/service";
import { prisma } from "@/lib/prisma";
import { Service } from "@prisma/client";
import React from "react";
export const dynamic = "force-dynamic";

async function Services({ params }: { params: { page: string } }) {
  const page = parseInt(params.page as string);
  const data = (await getData(page)) || { records: [], totalPages: 0 };
  return (
    <main className="flex flex-col items-center py-5">
      <Table
        headers={[
          "view",
          "Service Name",
          "Rate",
          "value Bought",
          "skills used",
        ]}
      >
        {((data?.records as Service[]) || []).map((value, index) => {
          const row: any = [];
          row.push(value.title);
          row.push(value.hourlyRate);
          row.push(value.valueBrought);
          row.push(value.skillsUsed);

          return (
            <TableItem
              type="services"
              key={value.id}
              index={value.id}
              row={row}
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
  let apiUrl = process.env.API_URL;
  let res = await getAll(page, 10, prisma);
  return res;
}
export default Services;
