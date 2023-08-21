import Table from "@/components/Table"
import { TableItem } from "@/components/TableItem";
import { displayUserDTO } from "@/crud/user";
import React, { useEffect, useState } from 'react'

async function Users({users}: {users:displayUserDTO[]}) {
    const data = await getData();
  return (
    <main className="flex w-3/4 flex-col items-center felx-grow  p-5">
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
    </main>
  )
}

async function getData() {
    let res = await fetch('http://localhost:3000/api/users/all/1');
    if (res.status == 200) {
      let resJson = await res.json() ;
      console.log(resJson);
      return (resJson.data as displayUserDTO[]);
    }
}

export default Users
