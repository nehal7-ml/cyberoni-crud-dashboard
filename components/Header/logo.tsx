"use client"
import { motion } from "framer-motion"
import React from 'react'
import { MAIN_LOGO } from "../assets"
import Image from "next/image"
function logo() {
    return (
        <>
            <motion.div>
                <Image
                    src={MAIN_LOGO}
                    alt="CyberOni logo"
                    width="30"
                    height="30"
                    className="mr-2 rounded-sm animate-bounce"
                ></Image>
            </motion.div>
        </>

    )
}

export default logo