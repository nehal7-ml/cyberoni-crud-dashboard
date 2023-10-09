// DeleteModal.js
'use client'
import React, { useState } from 'react';
export type DeleteModalProps = {
    isOpen: boolean,
    onClose: () => void,
    onDelete?: () => void,
    url: string
}

const DeleteModal = ({ isOpen, onClose, onDelete, url }: DeleteModalProps) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);

        try {
            const res = await fetch(url, { method: 'DELETE' });
            if (res.status === 200) {
                setIsDeleted(true);
                setTimeout(() => { window.location.reload() }, 1000)
            }


        } catch (error) {
            console.error('Delete failed:', error);
        }

        setIsDeleting(false);
    };

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md text-black">
                    <div className="bg-white rounded-lg p-6 shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
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
                                className="px-4 py-2 bg-red-500 text-white hover:bg-red-700"
                                onClick={handleDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isDeleted && (
                <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md z-50 text-black">
                    <div className="bg-white rounded-lg p-6 shadow-md">
                        <p className="text-green-500 text-lg font-semibold mb-2">
                            Delete successful!
                        </p>
                        <button
                            className="px-4 py-2 bg-green-500 text-white hover:bg-green-700"
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