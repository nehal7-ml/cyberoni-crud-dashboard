import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  BadgePercent,
  BookOpen,
  BrainCircuit,
  CalendarCheck2,
  Cpu,
  LinkIcon,
  LogOutIcon,
  Microscope,
  Package,
  RotateCcw,
  User,
} from "lucide-react";
import Link from "next/link";
import { Session, getServerSession } from "next-auth";
import Logo from "../shared/logo";
async function SidePanel(props: React.BaseHTMLAttributes<HTMLDivElement>) {
  const session = await getServerSession();
  return (
    <>
      <div className={props.className}>
        <div className="flex h-1/6 items-center justify-center pl-2">
          <Link
            href="/dashboard"
            className="font-display flex items-center text-xl "
          >
            <Logo></Logo>
            <p className="subpixel-antialiased">CyberOni</p>
          </Link>
        </div>
        <div className="container flex h-4/6 flex-grow flex-col gap-5 overflow-y-auto px-1 py-4 shadow-inner">
          <Link
            className={`flex items-center justify-start  rounded-lg  p-2 text-gray-800  hover:cursor-pointer hover:bg-blue-600 hover:text-white`}
            href={"/dashboard/users/1"}
          >
            <User></User>
            <div className="pl-3 text-left">Users</div>
          </Link>
          <Link
            className={`flex items-center justify-start  rounded-lg  p-2 text-gray-800  hover:cursor-pointer hover:bg-blue-600 hover:text-white`}
            href={"/dashboard/services/1"}
          >
            <Cpu />

            <div className="pl-3 text-left">Services</div>
          </Link>
          <Link
            className={`flex items-center justify-start  rounded-lg  p-2 text-gray-800  hover:cursor-pointer hover:bg-blue-600 hover:text-white`}
            href={"/dashboard/products/1"}
          >
            <Package />
            <div className="pl-3 text-left">Products</div>
          </Link>
          <Link
            className={`flex items-center justify-start  rounded-lg  p-2 text-gray-800  hover:cursor-pointer hover:bg-blue-600 hover:text-white`}
            href={"/dashboard/events/1"}
          >
            <CalendarCheck2 />
            <div className="pl-3 text-left">Events</div>
          </Link>
          <Link
            className={`flex items-center justify-start  rounded-lg  p-2 text-gray-800  hover:cursor-pointer hover:bg-blue-600 hover:text-white`}
            href={"/dashboard/prompts/1"}
          >
            <BrainCircuit />
            <div className="pl-3 text-left">Prompts</div>
          </Link>
          <Link
            className={`flex items-center justify-start  rounded-lg  p-2 text-gray-800  hover:cursor-pointer hover:bg-blue-600 hover:text-white`}
            href={"/dashboard/blogs/1"}
          >
            <BookOpen />
            <div className="pl-3 text-left">Blogs</div>
          </Link>
          <Link
            className={`flex items-center justify-start  rounded-lg  p-2 text-gray-800  hover:cursor-pointer hover:bg-blue-600 hover:text-white`}
            href={"/dashboard/referrals/1"}
          >
            <LinkIcon />
            <div className="pl-3 text-left">Referral Links</div>
          </Link>
          <Link
            className={`flex items-center justify-start  rounded-lg  p-2 text-gray-800  hover:cursor-pointer hover:bg-blue-600 hover:text-white`}
            href={"/dashboard/casestudies/1"}
          >
            <Microscope />
            <div className="pl-3 text-left">Case Studies</div>
          </Link>
          <Link
            className={`flex items-center justify-start  rounded-lg  p-2 text-gray-800  hover:cursor-pointer hover:bg-blue-600 hover:text-white`}
            href={"/dashboard/discounts/1"}
          >
            <BadgePercent />
            <div className="pl-3 text-left">Discounts</div>
          </Link>
        </div>
        {session && (
          <div className="relative inline-block h-1/6 w-full px-5 text-left shadow-inner">
            <Link
              href={"/auth/forgot"}
              className="flex gap-2 rounded-lg  p-3 hover:bg-gray-300 hover:shadow-lg"
            >
              <RotateCcw /> Reset Password
            </Link>

            <Link
              href={"/api/auth/signout"}
              className="flex gap-2 rounded-lg  p-3 hover:bg-gray-300 hover:shadow-lg"
            >
              <LogOutIcon /> LogOut
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

export default SidePanel;
