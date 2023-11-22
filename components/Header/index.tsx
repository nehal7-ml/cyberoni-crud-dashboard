import React from 'react'
import Image from "next/image"
import Link from "next/link"
import { MAIN_LOGO } from "@/components/assets"
import { motion } from "framer-motion";
import Logo from "./logo";

function Header() {
  return (
    <>
      <div className="flex m-2 relative justify-between w-full h-1/6 lg:static lg:block lg:w-auto lg:justify-start">
        <Link href="/dashboard" className="flex items-center text-2xl font-display">
          <Logo></Logo>
          <p className="subpixel-antialiased">
            Crud Ops
          </p>
        </Link>
      </div>
    </>
  )
}

export default Header