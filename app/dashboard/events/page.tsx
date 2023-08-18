'use client'
import Table from "@/components/Table"
import React from 'react'

function Events() {
  return (
    <main className="flex w-3/4 flex-col items-center felx-grow  p-5">
        <Table headers={['no.', 'Name','Date', 'Location', 'Link', 'Status']}>
            
        </Table>
    </main>
  )
}

export default Events