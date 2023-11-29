"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { LayoutDashboard, LogOut, LogOutIcon } from "lucide-react";
import Image from "next/image";
import { Session } from "next-auth";
import Link from "next/link";

export default function User({ session }: { session: Session }) {
  const { email, image } = session?.user || {};

  if (!email) return null;

  return (
    <div className="relative inline-block text-left">
        <Link href={'/api/auth/signin'} className="flex gap-2 hover:bg-red-600 hover:shadow-lg rounded-lg"><LogOutIcon/> LogOut</Link>
    </div>
  );
}
