'use client'
import Table from "@/components/Table"
import React from 'react'

function Blogs() {
  return (
    <main className="flex flex-col items-center py-5">
        <Table headers={['no.', 'Title','Featured', 'Date', 'Author', 'Template']}>
            
        </Table>
    </main>
  )
}

export default Blogs