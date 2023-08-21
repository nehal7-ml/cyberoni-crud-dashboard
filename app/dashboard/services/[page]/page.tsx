'use client'
import Table from "@/components/Table"
import React from 'react'

function Services() {
  return (
    <main className="flex flex-col items-center py-5">
        <Table headers={['no.', 'Service Name','Rate', 'Number of reviews', 'number of sub services']}>
            
        </Table>
    </main>
  )
}

export default Services