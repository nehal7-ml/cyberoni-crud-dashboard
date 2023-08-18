'use client'
import Table from "@/components/Table"
import React from 'react'

function Users() {
  return (
    <main className="flex w-3/4 flex-col items-center felx-grow  p-5">
        <Table headers={['no.', 'First Name','Last Name', 'Email', 'Email Verified', 'Role']}>
            
        </Table>
    </main>
  )
}

export default Users