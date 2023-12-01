'use client'
import { CreateImageDTO } from "@/crud/images";
import { bufferToB64, generateUUID } from "@/lib/utils";
import React, { useEffect, useState } from 'react'
import { FileUploader } from "react-drag-drop-files";
import Loading from "../Loading";

function AddImage({ defaultImages, onImagesChange, maxImages, submit }: { defaultImages?: CreateImageDTO[], onImagesChange: (images: CreateImageDTO[]) => void, maxImages?: number, submit?: boolean }) {
    const [images, setImages] = useState<CreateImageDTO[]>(defaultImages || []);
    const [toUpload, setToUpload] = useState<CreateImageDTO[]>([]);
    const [toDelete, setToDelete] = useState<CreateImageDTO[]>();
    const fileTypes = ["JPG", "PNG", "GIF"];
    const [loading, setLoading] = useState(false);
    const handleAddImage = async (file: any) => {
        setLoading(true);
        let newfiles = images;
        for (let i = 0; i < file.length && i < (maxImages || 10); i++) {
            const newfile = file.item(i);
            const newFileSrc = bufferToB64(await newfile.arrayBuffer(), newfile.type);

            if (images.length < (maxImages || 10)) {

                const res = await fetch('/api/image', {
                    method: 'POST', body: JSON.stringify({

                        image: {
                            src: newFileSrc,
                            name: newfile.name,
                        },
                        request: "UPLOAD"
                    })
                })
                const { image } = await res.json()
                newfiles.push(image);
                console.log(newfiles);
            } else {
                console.log("notification sent");
            }
        }

        onImagesChange(newfiles);
        setLoading(false);

    };

    const handleRemoveImage = async (imageToRemove: CreateImageDTO) => {

        // const res = await fetch('/api/image', {
        //     method: 'POST', body: JSON.stringify({

        //         image: imageToRemove,
        //         request: 'DELETE',
        //     })
        // })
        const newFiles = images.filter(image => image.src !== imageToRemove.src);
        setImages(newFiles);
        onImagesChange(newFiles);

    };




    useEffect(() => {
        if (defaultImages && defaultImages.length > 0) {
            setImages(defaultImages)
        }

    }, [defaultImages]);

    useEffect(() => {
        if (submit) {

        }
    }, [submit]);

    return (
        <>
            <h2 className="text-lg font-semibold mb-2">Add Images</h2>
            <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                    {images.map(image => (
                        <div
                            key={image.src}
                            className="bg-gray-200 p-2 rounded"
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={image.src} alt="Product" className="w-20 h-20 object-cover" />
                            <button
                                type="button"
                                className="ml-2 text-red-600 hover:text-red-800 focus:outline-none focus:ring focus:ring-red-300"
                                onClick={() => handleRemoveImage(image)}
                            >
                                X
                            </button>
                        </div>
                    ))}
                </div>

                <FileUploader
                    multiple={true}
                    handleChange={handleAddImage}
                    name="file"
                    types={fileTypes}
                />
                {loading &&
                    <div className="fixed top-0 left-0 w-screen h-screen z-[100]  backdrop-blur-md">
                        <Loading />
                    </div>}
            </div>
        </>
    )
}

export default AddImage