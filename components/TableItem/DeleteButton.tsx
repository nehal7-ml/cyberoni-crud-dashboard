"use client";
import { Delete, Trash } from "lucide-react";
import React, { MouseEvent, useState } from "react";
import DeleteModal from "../DeleteModal";

function DeleteButton({ url }: { url: string }) {
  const [openModal, setOpenModal] = useState(false);
  async function handleDelete(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    e.preventDefault();
    setOpenModal(true);
  }
  return (
    <>
      <div>
        <button
          onClick={handleDelete}
          className="rounded-lg p-3 text-gray-500 shadow-sm hover:bg-red-600 hover:text-white hover:shadow-2xl"
        >
          <Trash className=""></Trash>
        </button>
      </div>
      <DeleteModal
        isOpen={openModal}
        url={url}
        onClose={() => setOpenModal(false)}
      ></DeleteModal>
    </>
  );
}

export default DeleteButton;
