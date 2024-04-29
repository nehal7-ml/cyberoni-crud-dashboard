// DeleteModal.js
"use client";
import React, { useState } from "react";
export type DeleteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onDelete?: () => void;
  url: string;
};

const DeleteModal = ({ isOpen, onClose, onDelete, url }: DeleteModalProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const res = await fetch(url, { method: "DELETE" });
      if (res.status === 200) {
        setIsDeleted(true);
        if(onDelete ) onDelete()
      }
    } catch (error) {
      console.error("Delete failed:", error);
    }

    setIsDeleting(false);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center text-black backdrop-blur-md">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-semibold">Confirm Delete</h2>
            <p className="mb-4">Are you sure you want to delete this item?</p>
            <div className="flex justify-end">
              <button
                className="mr-2 px-4 py-2 text-red-500 hover:text-red-700"
                onClick={() => {
                  setIsDeleted(false);
                  onClose();
                }}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 px-4 py-2 text-white hover:bg-red-700"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
      {isDeleted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center text-black backdrop-blur-md">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <p className="mb-2 text-lg font-semibold text-green-500">
              Delete successful!
            </p>
            <button
              className="bg-green-500 px-4 py-2 text-white hover:bg-green-700"
              onClick={() => {
                setIsDeleted(false);
                onClose();
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteModal;
