import Image from 'next/image'
import Link from "next/link";
import { useEffect } from "react";

export default function Home() {

  useEffect(() => {
    
  }, []);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Link href={"/api/auth/login"} className="w-1/2 h/12 rounded-lg shadow-md hover:bg-blue-800 bg-blue-500" > Login</Link>
    </main>
  )
}
