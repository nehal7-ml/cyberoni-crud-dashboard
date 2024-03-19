import CopyButton from "@/components/CopyButton";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import { TableItem } from "@/components/TableItem";
import { getAll } from "@/crud/discount";
import { prisma } from "@/lib/prisma";
import { Discount, Event, Referral } from "@prisma/client";
import React from "react";
export const dynamic = "force-dynamic";

async function Events({ params }: { params: { page: string } }) {
  const page = parseInt(params.page);
  const data = (await getData(page)) || { records: [], totalPages: 0 };

  return (
    <main className="flex flex-col items-center py-5">
      <Table view={false} headers={["Discount Code", "Value", "expires"]}>
        {(data?.records as Discount[]).map((value, index) => {
          const row: any = [];
          row.push(<CopyButton text={value.name} />);
          row.push(value.value + "%");
          row.push(
            value.expires ? new Date(value.expires).toLocaleDateString() : "NA",
          );

          return (
            <TableItem
              type="discounts"
              key={value.id}
              index={value.id}
              row={row}
              viewLink="/"
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
  // console.log(res);
  return res;
}

export default Events;
