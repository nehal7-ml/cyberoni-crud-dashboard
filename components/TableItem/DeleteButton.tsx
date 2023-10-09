'use client'
import { Delete, Trash } from "lucide-react"
import React, { useState } from 'react'
import DeleteModal from "../DeleteModal"

function DeleteButton({ url }: { url: string }) {
    const [openModal, setOpenModal] = useState(false);
    async function handleDelete() {
        setOpenModal(true);

    }
    return (
        <>
            <div>
                <button onClick={handleDelete} className= "text-gray-500 hover:bg-red-600 hover:text-white shadow-sm hover:shadow-2xl p-3 rounded-lg">
                    <Trash className=""></Trash>
                </button>
            </div>
            <DeleteModal isOpen={openModal} url={url} onClose={() => setOpenModal(false)}></DeleteModal>
        </>
    )
}

export default DeleteButton