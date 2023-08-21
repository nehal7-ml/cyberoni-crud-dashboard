import { ListPlus } from "lucide-react"
import React from 'react'

function CreateRecordButton({className}:{className?:string}) {
  return (
    <>
    <div className={className}>
        <div className="flex cursor-pointer hover:-translate-y-2 w-40">
          <ListPlus />
          <div className="flex-grow">Create Record</div>
        </div>
    </div>
    </>
  )
}

export default CreateRecordButton