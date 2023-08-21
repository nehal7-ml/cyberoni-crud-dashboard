import Table from "@/components/Table"
import { TableItem } from "@/components/TableItem";
import { displayProductDTO } from "@/crud/product";
import React, { useEffect, useState } from 'react'

async function Products() {

  const data = await getData();

  return (
    <main className="flex flex-col items-center  py-5">
      <Table headers={['no.', 'SKU', 'Name', 'Inventory', 'Price', 'Profit', 'Category']}>
        {data?.map((value, index) => {
          const row: any = [];
          row.push(index+1)
          row.push(value.sku);
          row.push(value.name);
          row.push(value.inventory);
          row.push(value.price);
          row.push(value.profitMargin);
          row.push(value.category);
          

          return <TableItem key={index} index={index} row={row}></TableItem>
        })}
      </Table>
    </main>
  )
}



async function getData() {
  let res = await fetch('http://localhost:3000/api/products/all/1');
  if (res.status == 200) {
    let resJson = await res.json() ;
    console.log(resJson);
    return resJson.data as displayProductDTO[];
  }

}
export default Products