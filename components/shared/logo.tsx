"use client";
import { motion } from "framer-motion";
import React from "react";
import { MAIN_LOGO } from "../assets";
import Image from "next/image";
function Logo() {
  return (
    <>
      <motion.div>
        <Image
          src={MAIN_LOGO}
          alt="CyberOni logo"
          width={50}
          height={50}
          className="mr-2 animate-bounce rounded-sm"
        ></Image>
      </motion.div>
    </>
  );
}

export default Logo;
