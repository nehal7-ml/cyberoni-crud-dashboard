import React from 'react'
import Link from "next/link"
import Logo from "./logo";
import User from "./User";
import { getServerSession } from "next-auth";

async function Header() {
  const session = await getServerSession();
  return (
    <>
      <div className="flex  m-2 relative justify-between w-full h-1/6 lg:w-auto lg:justify-between">
        <Link href="/dashboard" className="flex items-center text-2xl font-display">
          <Logo></Logo>
          <p className="subpixel-antialiased">
            Crud Ops
          </p>
        </Link>
        {session && <User session={session} />}
      </div>
    </>
  )
}

export default Header