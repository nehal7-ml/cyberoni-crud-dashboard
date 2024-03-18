import CopyButton from "@/components/CopyButton";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import { TableItem } from "@/components/TableItem";
import { getAll } from "@/crud/referral";
import { prisma } from "@/lib/prisma";
import { Event, Referral } from "@prisma/client";
import React from "react";
export const dynamic = "force-dynamic";

async function Events({ params }: { params: { page: string } }) {
  const page = parseInt(params.page);
  const data = (await getData(page)) || { records: [], totalPages: 0 };

  return (
    <main className="flex flex-col items-center py-5">
      <Table
       view={false}
        headers={[
          "View",
          "Referral/Affiliate Link",
          "CampaignId",
          "Expires",
          "Clicks",
          "Type",
          "Prefix/Username",
        ]}
      >
        {(data?.records as Referral[]).map((value, index) => {
          const row: any = [];
          row.push(<CopyButton showText={true} text={value.redirect} />);
          row.push(value.campaignId);
          row.push(
            value.expires ? new Date(value.expires).toLocaleDateString() : "NA",
          );
          row.push(value.click);
          row.push(value.type);
          row.push(value.prefix);

          return (
            <TableItem
              type="referrals"
              key={value.id}
              index={value.id}
              row={row}
              viewLink={"/"}
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
