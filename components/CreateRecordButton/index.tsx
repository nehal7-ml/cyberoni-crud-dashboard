"use client";
import { ListPlus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

function CreateRecordButton({ className }: { className?: string }) {
  const [show, setShow] = useState(true);
  const path = usePathname().split("/");
  return (
    <>
      <div className={className}>
        <Link
          href={`/${path[1]}/${path[2]}/new`}
          className="mx-5 flex w-fit cursor-pointer px-3 py-1 hover:rounded-sm hover:shadow"
        >
          <ListPlus />
          <div className="flex-grow">Create {path[2]}</div>
        </Link>
      </div>
    </>
  );
}

export default CreateRecordButton;
