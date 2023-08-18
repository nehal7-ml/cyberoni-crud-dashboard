'use client'
import Table from "@/components/Table"
import React from 'react'

function Blogs() {
  return (
    <main className="flex w-3/4 flex-col items-center felx-grow  p-5">
        <Table headers={['no.', 'Title','Featured', 'Date', 'Author', 'Template']}>
            
        </Table>
    </main>
  )
}

export default Blogs