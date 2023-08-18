'use client'
import Table from "@/components/Table"
import React from 'react'

function Services() {
  return (
    <main className="flex w-3/4 flex-col items-center felx-grow  p-5">
        <Table headers={['no.', 'Service Name','Rate', 'Number of reviews', 'number of sub services']}>
            
        </Table>
    </main>
  )
}

export default Services