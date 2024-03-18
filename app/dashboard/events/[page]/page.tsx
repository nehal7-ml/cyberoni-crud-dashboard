import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import { TableItem } from "@/components/TableItem";
import { getAll } from "@/crud/event";
import { prisma } from "@/lib/prisma";
import { Event } from "@prisma/client";
import React from "react";
export const dynamic = "force-dynamic";

async function Events({ params }: { params: { page: string } }) {
  const page = parseInt(params.page);
  const data = (await getData(page)) || { records: [], totalPages: 0 };

  return (
    <main className="flex flex-col items-center py-5">
      <Table view={true}  headers={["no.", "Name", "Date", "Location", "Link", "Status"]}>
        {(data?.records as Event[]).map((value, index) => {
          const row: any = [];
          row.push(value.name);
          row.push(new Date(value.date).toLocaleDateString());
          row.push(value.location);
          row.push(value.eventLink);
          row.push(value.status);

          return (
            <TableItem
              type="events"
              key={value.id}
              index={value.id}
              row={row}
              viewLink={value.eventLink}
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
