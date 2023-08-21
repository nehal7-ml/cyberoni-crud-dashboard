'use client'
import Table from "@/components/Table"
import React from 'react'

function Blogs() {
  return (
    <main className="flex flex-col items-center  py-5">
        <Table headers={['no.', 'id','Description', 'Prompt', 'Times Used','Times Integrated' ,'Tokens' , 'Profit']}>
            
        </Table>
    </main>
  )
}

export default Blogs