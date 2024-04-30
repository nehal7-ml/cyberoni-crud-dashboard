import React, { ReactNode } from "react";
import TableHead, { TableHeader } from "./TableHead";
import { TableType } from "@/types/global";
import { TableItem } from "./TableItem";

function Table({
  headers,
  view,
  type,
  rows,
  page
}: {
  headers: TableHeader[];
  view: boolean;
  type: TableType;
  page:number
  rows: {
    row: (string | ReactNode)[];
    viewLink: string;
    index: string;
  }[]
}) {
  return (
    <>
      <div className="Table flex w-full flex-col overflow-x-auto bg-slate-50 font-medium">
        <div className="w-full">
          <div className="inline-block min-w-full">
            <div className="overflow-hidden">
              <table className="min-w-full">
                <TableHead
                page={page}
                  type={type}
                  view={view}
                  headers={headers}
                ></TableHead>
                <tbody>
                  {rows.map((row, index) => {
                    return <TableItem {...row} key={index} type={type}></TableItem>;
                  })}

                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Table;
