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

  return <></>;
}
