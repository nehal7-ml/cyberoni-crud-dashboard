import React from 'react'
import Link from "next/link"
import Logo from "../shared/logo";
import User from "./User";
import { getServerSession } from "next-auth";

async function Header() {
  const session = await getServerSession();
  return (
    <>
      <div className="flex  m-2 relative justify-between w-full h-1/6 lg:w-auto lg:justify-between">
        
        {session && <User session={session} />}
      </div>
    </>
  )
}

export default Header