'use client'
import { OrderTable, OrderTableBy, TableType } from "@/types/global";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

export type TableHeader = (
  | { title: string; sort: false }
  | { title: string; sort: true; sortKey: OrderTableBy });
// the sortBy takes an ara
function TableHead({ headers,type ,view, page }: { headers: TableHeader[], type: TableType; view: boolean, page:number }) {

  const query = useSearchParams();
  const router = useRouter();

  const [sort, setSort] = useState({
    sortBy: query.get("orderBy") as OrderTableBy,
    sortType: query.get("order") as OrderTable,
  });

  function sortRequest(key: OrderTableBy) {

    router.push(`/dashboard/${type}/${page}?order=${sort.sortType === 'asc' ? 'desc' : 'asc'}&orderBy=${key}`);
    setSort({ sortBy: key, sortType: sort.sortType === 'asc' ? 'desc' : 'asc' });

  }
  return (
    <>
      <thead className="bg-blue-100">
        <tr>
          <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">
            Delete
          </th>
          {view && (
            <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">
              View
            </th>
          )}
          {headers.map((item: TableHeader, index: number) => {
            return (
              <th
                key={index}
                scope="col"
                className={`px-6 py-4 text-center text-sm font-medium text-gray-900 ${item.sort ? "cursor-pointer" : ""}`}
                onClick={item.sort ? () => sortRequest(item.sortKey) : undefined}
              >
                {item.title}
                {item.sort && sort.sortBy === item.sortKey ? <span className="ml-2">{sort.sortType === 'asc' ? '▲' : '▼'}</span> : null}
              </th>
            );
          })}
        </tr>
      </thead>
    </>
  );
}

export default TableHead;
