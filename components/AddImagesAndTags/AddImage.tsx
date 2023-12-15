'use client'
import { CreateImageDTO } from "@/crud/DTOs";
import { bufferToB64, generateUUID } from "@/lib/utils";
import React, { useEffect, useState } from 'react'
import { FileUploader } from "react-drag-drop-files";
import Loading from "../Loading";
import { Edit, PlusCircle, X, XCircle } from "lucide-react";

function AddImage({ defaultImages, onImagesChange, maxImages, submit }: { defaultImages?: CreateImageDTO[], onImagesChange: (images: CreateImageDTO[]) => void, maxImages?: number, submit?: boolean }) {
    const [images, setImages] = useState<CreateImageDTO[]>(defaultImages || []);

    const [imageModal, setImageModal] = useState(false);
    const [image, setImage] = useState<CreateImageDTO>({
        name: '',
        src: ''
    });

    const fileTypes = ["JPG", "PNG", "GIF"];

    const [loading, setLoading] = useState(false);

    const handleAddImage = async (file: any) => {
        setLoading(true);
        let newfiles = images;
        for (let i = 0; i < file.length && i < (maxImages || 10); i++) {
            const newFile = file.item(i);
            const newFileSrc = bufferToB64(await newFile.arrayBuffer(), newFile.type);

            if (images.length < (maxImages || 10)) {

                // const res = await fetch('/api/image', {
                //     method: 'POST', body: JSON.stringify({

                //         image: {
                //             src: newFileSrc,
                //             name: newfile.name,
                //         },
                //         request: "UPLOAD"
                //     })
                // })
                // const { image } = await res.json()
                const image = {
                    src: newFileSrc,
                    name: newFile.name,
                }
                setImage(image);
                //setImages(newfiles)
                console.log(newfiles);
            } else {
                console.log("notification sent");
            }
        }

        setLoading(false);

    };

    const handleRemoveImage = async (imageToRemove: CreateImageDTO) => {
        const newFiles = images.filter(image => image.src !== imageToRemove.src);
        setImages(newFiles);
        onImagesChange(newFiles);

    };

    function handleSave() {
        const currentImage = image;
        let toUpdate = images.filter(image => image.src === currentImage.src)[0];
        if (toUpdate) {
            let newFiles = images.map(image => {
                if (image.src === currentImage.src) {
                    return {
                        ...image,
                        src: currentImage.src,
                        name: currentImage.name,
                    }

                } else return image;

            })
            onImagesChange(newFiles);

        }
        else if (currentImage.name && currentImage.src) {
            let newFiles = images;
            newFiles.push(currentImage);
            onImagesChange(newFiles);
        }

        setImage({
            name: '',
            src: ''
        })

    }



    useEffect(() => {
        if (defaultImages && defaultImages.length > 0) {
            setImages(defaultImages)
        }

    }, [defaultImages]);

    useEffect(() => {
        if (submit) {

        }
    }, [submit]);

    function updateImage(image:CreateImageDTO){
        setImage(image); 
        setImageModal(true) 
    }
    return (
        <>
            <h2 className="text-lg font-semibold mb-2">Add Images</h2>
            <div className="mb-4">
                <div className="flex flex-wrap gap-2 mb-4">
                    {images.map(image => (
                        <div
                            key={image.src}
                            className="relative bg-gray-200 p-2 rounded flex flex-col"
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={image.src} alt={image.name as string} className="w-20 h-20 object-cover cursor-pointer" onClick={() => { updateImage(image)}} />
                            <div className="w-20 hover:w-auto p-1 line-clamp-1 text-ellipsis hover:overflow-visible hover:shadow-md hover:line-clamp-none hover:whitespace-nowrap">{image.name}</div>
                            <div className="absolute right-2 top-1  flex justify-center items-center">
                                <button
                                    type="button"
                                    className="ml-2 text-red-600 hover:text-red-800 focus:outline-none focus:ring focus:ring-red-300"
                                    onClick={() => handleRemoveImage(image)}
                                >
                                    <XCircle />
                                </button>
                            </div>

                            <div className="  flex justify-center items-center">
                                <button
                                    type="button"
                                    className="ml-2 text-blue-600 hover:shadow-md rounded-md p-1 hover:text-blue-800 focus:outline-none focus:ring focus:ring-red-300"
                                    onClick={() => updateImage(image)}
                                >
                                   <Edit />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div>
                    <button type="button" onClick={() => setImageModal(true)} className="p-2 hover:shadow-lg hover:bg-blue-600 bg-blue-500 rounded-full" >
                        <PlusCircle className=" text-white" />
                    </button>
                    <div className={`fixed flex flex-col w-screen top-0 left-0 justify-center backdrop-blur-md h-screen z-[100] ${imageModal ? '' : ' hidden'}`}>

                        <div className="relative container mx-auto my-auto flex flex-col justify-center bg-gray-100 rounded-xl p-5">
                            <div className="flex justify-end z-30">
                                <button type="button" className="self-end mx-10 my-3" onClick={() => setImageModal(false)} ><X color="red" className="cursor-pointer" /></button>
                            </div>
                            <div className="my-4 flex gap-4 justify-center items-center">
                                <label htmlFor="src">Src:</label>
                                <input className="p-2  border rounded " type="url" id="src" value={image.src} onChange={(e) => setImage(prev => ({ ...prev, src: e.target.value }))} />
                            </div>
                            <div className="my-4 flex gap-4 justify-center items-center">
                                <label htmlFor="name">Name:</label>
                                <input className="p-2 border rounded " type="text" id="name" value={image.name || ""} onChange={(e) => setImage(prev => ({ ...prev, name: e.target.value }))} />
                            </div>
                            <div className="my-4 flex gap-4 justify-center items-center">
                                <FileUploader
                                    multiple={true}
                                    handleChange={handleAddImage}
                                    name="file"
                                    types={fileTypes}
                                />
                            </div>
                            <div className="my-4 flex gap-4 justify-center items-center">
                                <button onClick={handleSave} type="button" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300">
                                    {image.id ? 'Update' : 'Save'}
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
                {loading &&
                    <div className="fixed top-0 left-0 w-screen h-screen z-[100]  backdrop-blur-md">
                        <Loading />
                    </div>}
            </div>
        </>
    )
}

export default AddImage