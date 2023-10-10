'use client'
import { ListPlus } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation";
import React, { useEffect, useState }  from 'react'


function CreateRecordButton({ className }: { className?: string }) {

  const [show, setShow] = useState(true);
  const path = usePathname().split('/');
    return (
    <>
      <div className={className }>
        <Link href= {`/${path[1]}/${path[2]}/new`} className="flex cursor-pointer w-40">
          <ListPlus />
          <div className="flex-grow">Create {path[2]}</div>
        </Link>
      </div>
    </>
  )
}

export default CreateRecordButton