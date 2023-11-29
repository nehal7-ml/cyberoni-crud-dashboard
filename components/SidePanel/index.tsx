import React, { useState } from "react"
import { useRouter } from 'next/router';
import { BookOpen, BrainCircuit, CalendarCheck2, Cpu, LogOutIcon, Microscope, Package, User } from "lucide-react";
import Link from "next/link";
import { Session, getServerSession } from "next-auth";
import Logo from "../shared/logo";
async function SidePanel(props: React.BaseHTMLAttributes<HTMLDivElement>) {
    const session = await getServerSession()
    return (
        <>
            <div className={props.className}>
                <div className="p-5 flex justify-center items-center">
                    <Link href="/dashboard" className="flex items-center text-2xl font-display ">
                        <Logo></Logo>
                        <p className="subpixel-antialiased">
                            CyberOni
                        </p>
                    </Link>
                </div>
                <div className="flex flex-col flex-grow py-12 shadow-inner px-5 container gap-5">
                    <Link className={`flex justify-start items-center  hover:bg-blue-600  text-gray-800 hover:cursor-pointer  p-5 rounded-lg hover:text-white`} href={"/dashboard/users/1"}>
                        <User></User>
                        <div className="text-left pl-3">Users</div>
                    </Link>
                    <Link className={`flex justify-start items-center  hover:bg-blue-600  text-gray-800 hover:cursor-pointer  p-5 rounded-lg hover:text-white`} href={"/dashboard/services/1"}>
                        <Cpu />

                        <div className="text-left pl-3">Services</div>
                    </Link>
                    <Link className={`flex justify-start items-center  hover:bg-blue-600  text-gray-800 hover:cursor-pointer  p-5 rounded-lg hover:text-white`} href={"/dashboard/products/1"}>
                        <Package />
                        <div className="text-left pl-3">Products</div>
                    </Link>
                    <Link className={`flex justify-start items-center  hover:bg-blue-600  text-gray-800 hover:cursor-pointer  p-5 rounded-lg hover:text-white`} href={"/dashboard/events/1"}>
                        <CalendarCheck2 />
                        <div className="text-left pl-3">Events</div>
                    </Link>
                    <Link className={`flex justify-start items-center  hover:bg-blue-600  text-gray-800 hover:cursor-pointer  p-5 rounded-lg hover:text-white`} href={"/dashboard/prompts/1"}>
                        <BrainCircuit />
                        <div className="text-left pl-3">Prompts</div>
                    </Link>
                    <Link className={`flex justify-start items-center  hover:bg-blue-600  text-gray-800 hover:cursor-pointer  p-5 rounded-lg hover:text-white`} href={"/dashboard/blogs/1"}>

                        <BookOpen />
                        <div className="text-left pl-3">Blogs</div>
                    </Link>
                    <Link className={`flex justify-start items-center  hover:bg-blue-600  text-gray-800 hover:cursor-pointer  p-5 rounded-lg hover:text-white`} href={"/dashboard/casestudies/1"}>

                        <Microscope />
                        <div className="text-left pl-3">Case Studies</div>
                    </Link>

                </div>
                {session && <div className="relative inline-block text-left px-5">
                    <Link href={'/api/auth/signin'} className="flex gap-2 p-3  hover:bg-gray-300 hover:shadow-lg rounded-lg"><LogOutIcon /> LogOut</Link>
                </div>}
            </div>
        </>
    )
}

export default SidePanel