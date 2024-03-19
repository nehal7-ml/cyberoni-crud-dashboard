import React from "react";
import TableHead from "./TableHead";

function Table({
  headers,
  view,
  children,
}: {
  headers: string[];
  view: boolean;
  children: JSX.Element[] | undefined;
}) {
  return (
    <>
      <div className="Table flex w-full flex-col overflow-x-auto bg-slate-50 font-medium">
        <div className="w-full">
          <div className="inline-block min-w-full">
            <div className="overflow-hidden">
              <table className="min-w-full">
                <TableHead view={view} headers={headers}></TableHead>
                <tbody>{children}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Table;
