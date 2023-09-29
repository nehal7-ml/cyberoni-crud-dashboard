import Table from "@/components/Table"
import { TableItem } from "@/components/TableItem";
import Pagination from "@/components/Pagination";
import { displayUserDTO } from "@/crud/user";
import React, { useEffect, useState } from 'react'
import { getAllRecordsDTO } from "@/crud/commonDTO";
import Link from "next/link";
export const dynamic = 'force-dynamic'

async function Users({ params }: { params: { page: string } }) {
  const page = parseInt(params.page)
  const data = await getData(page) || { records: [], totalPages:0 };
  return (
    <main className="flex flex-col items-center  py-5">
      <Table headers={['View', 'First Name', 'Last Name', 'Email', 'Email Verified', 'Role']}>
        {(data?.records as displayUserDTO[]).map((value, index) => {
          const row: any = [];
          row.push(value.firstName);
          row.push(value.lastName);
          row.push(value.email);
          row.push(value.emailVerified ? "true" : "false");
          row.push(value.role);


          return <TableItem type="users" key={value.id} index={value.id} row={row}></TableItem>
        })}
      </Table>
      <Pagination currentPage={page} totalPages={data?.totalPages || 0}></Pagination>
    </main>
  )
}

async function getData(page: number) {
  let apiUrl = process.env.API_URL
  let res = await fetch(`${apiUrl}/users/all/${page}`);
  if (res.status == 200) {
    let resJson = await res.json();
    console.log(resJson.data.records);
    return (resJson.data as getAllRecordsDTO);
  }
}

export default Users
