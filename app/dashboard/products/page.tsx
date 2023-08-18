'use client'
import Table from "@/components/Table"
import React from 'react'

function Products() {
  return (
    <main className="flex w-3/4 flex-col items-center felx-grow  p-5">
        <Table headers={['no.', 'SKU','Name', 'Inventory', 'Price', 'Profit', 'Category']}>
            
        </Table>
    </main>
  )
}

export default Products