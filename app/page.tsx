import Header from "@/components/Header";
import Image from 'next/image'
import Link from "next/link";
import { useEffect } from "react";

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify- p-24">
      
      <Link href={"/dashboard/users"} className="w-1/2 h/12 text-center m-2 text-lg rounded-lg shadow-md hover:bg-blue-800 bg-blue-500" >go to dashboard</Link>
    </main>
  )
}
