import Table from "@/components/Table"
import { TableItem } from "@/components/TableItem";
import Pagination from "@/components/Pagination";
import { displayUserDTO } from "@/crud/user";
import React, { useEffect, useState } from 'react'

async function Users({users,params }: {users:displayUserDTO[],params: { page: string } }) {
  const page = parseInt(params.page)
    const data = await getData(page);

  
  return (
     <main className="flex flex-col items-center  py-5">
        <Table headers={['no.', 'First Name','Last Name', 'Email', 'Email Verified', 'Role']}>
        {data?.map((value, index) => {
          const row: any = [];
          row.push(index+1)
          row.push(value.firstName);
          row.push(value.firstName);
          row.push(value.email);
          row.push(value.emailVerified? "true": "false");
          row.push(value.role);
        

          return <><TableItem key={index} index={index} row={row}></TableItem></>
        })}
        </Table>
       <Pagination currentPage={page} totalPages={10}></Pagination>
    </main>
  )
}

async function getData(page:number) {
    let res = await fetch(`http://localhost:3000/api/users/all/${page}`);
    if (res.status == 200) {
      let resJson = await res.json() ;
      console.log(resJson);
      return (resJson.data as displayUserDTO[]);
    }
}

export default Users
