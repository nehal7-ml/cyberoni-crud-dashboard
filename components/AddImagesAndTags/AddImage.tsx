'use client'
import { createImageDTO } from "@/crud/images";
import React, { useEffect, useState } from 'react'

function AddImage({ defaultImages, onImagesChange, maxImages }: { defaultImages?: createImageDTO[], onImagesChange: (images: createImageDTO[]) => void, maxImages?: number }) {
    const [initialImages, setinitialImages] = useState<createImageDTO[]>([]);
    const [images, setImages] = useState<createImageDTO[]>([]);
    const [newImageSrc, setNewImageSrc] = useState('');

    const handleAddImage = () => {
        if (newImageSrc) {
            if (images.length <= (maxImages || 10)) {
                setImages(prevImages => [...prevImages, { src: newImageSrc }]);
                setNewImageSrc('');
            }

        }
    };

    const handleRemoveImage = (imageToRemove: createImageDTO) => {
        setImages(prevImages => prevImages.filter(image => image.src !== imageToRemove.src));
    };

    useEffect(() => {
        if (images.length > 0) {
            onImagesChange(initialImages.concat(images))
        }

    }, [images])


    useEffect(() => {
        setinitialImages(defaultImages || []);
        setImages([])
    }, [defaultImages]);

    return (
        <>
            <h2 className="text-lg font-semibold mb-2">Add Images</h2>
            <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                    {initialImages.concat(images).map(image => (
                        <div
                            key={image.src}
                            className="bg-gray-200 p-2 rounded"
                        >
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
                <input
                    type="text"
                    className="p-2 border rounded w-full"
                    placeholder="Image URL"
                    value={newImageSrc}
                    onChange={e => setNewImageSrc(e.target.value)}
                />
                <button
                    type="button"
                    className="mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                    onClick={handleAddImage}
                >
                    Add Image
                </button>
            </div>
        </>
    )
}

export default AddImage