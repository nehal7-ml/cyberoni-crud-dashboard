import Table from "@/components/Table"
import React from 'react'

function Events() {
  return (
    <main className="flex flex-col items-center py-5">
        <Table headers={['no.', 'Name','Date', 'Location', 'Link', 'Status']}>
            
        </Table>
    </main>
  )
}

export default Events