import React, { useState } from "react"
import { useRouter } from 'next/router';
import { BookOpen, BrainCircuit, CalendarCheck2, Cpu, Package, User } from "lucide-react";
import Link from "next/link";
function SidePanel(props: React.BaseHTMLAttributes<HTMLDivElement>) {
    return (
        <>
            <div className={props.className}>
                <div className="flex flex-col flex-grow bg-blue-800 py-12 shadow-inner">
                    <Link className={`flex justifyjustify-startr items-center  hover:bg-blue-900 py-1 text-gray-200 hover:cursor-pointer ml-3`} href={"/dashboard/users"}>
                        <User></User>
                        <div className="text-left pl-3">Users</div>
                    </Link>
                    <Link className={`flex justifyjustify-startr items-center  hover:bg-blue-900 py-1 text-gray-200 hover:cursor-pointer ml-3`} href={"/dashboard/services"}>
                        <Cpu />

                        <div className="text-left pl-3">Services</div>
                    </Link>
                    <Link className={`flex justifyjustify-startr items-center  hover:bg-blue-900 py-1 text-gray-200 hover:cursor-pointer ml-3`} href={"/dashboard/products"}>
                        <Package />
                        <div className="text-left pl-3">Products</div>
                    </Link>
                    <Link className={`flex justifyjustify-startr items-center  hover:bg-blue-900 py-1 text-gray-200 hover:cursor-pointer ml-3`} href={"/dashboard/events"}>
                        <CalendarCheck2 />
                        <div className="text-left pl-3">Events</div>
                    </Link>
                    <Link className={`flex justifyjustify-startr items-center  hover:bg-blue-900 py-1 text-gray-200 hover:cursor-pointer ml-3`} href={"/dashboard/prompts"}>
                        <BrainCircuit />
                        <div className="text-left pl-3">Prompts</div>
                    </Link>
                    <Link className={`flex justifyjustify-startr items-center  hover:bg-blue-900 py-1 text-gray-200 hover:cursor-pointer ml-3`} href={"/dashboard/blogs"}>

                        <BookOpen />
                        <div className="text-left pl-3">blogs</div>
                    </Link>
                </div>

            </div>
        </>
    )
}

export default SidePanel