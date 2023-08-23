'use client'
import AddImagesAndTags from "@/components/AddImagesAndTags"
import { createImageDTO } from "@/crud/images";
import { createServiceDTO } from "@/crud/service";
import { createTagDTO } from "@/crud/tags";
import React, { useState } from 'react'
import CreateSubServcie from "./CreateSubService";
import { X } from "lucide-react";
import QuillEditor from "@/components/QuillEditor";

function CreateServcie() {
    const [showDialog, setShowDialog] = useState(false);
    const [serviceData, setServiceData] = useState<createServiceDTO>({
        description: '',
        hourlyRate: 0,
        previewContent: "",
        skillsUsed: "",
        title: "",
        htmlEmbed: "",
        valueBrought: "",
        subServices: [],
        tags: [],
        image: { src: "" }
    });


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setServiceData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };
    function handleChangedImage(image: createImageDTO[], tags: createTagDTO[]) {
        setServiceData((prevData) => ({
            ...prevData,
            image: image[0],
            tags
        }))

    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Send the productData to your backend for creating the product
        console.log(serviceData);
    };


    function setQuillData(value:string) {
        setServiceData(prevData => ({
            ...prevData,
            description: value
        }))
    }
    return (
        <>
            <div className="light:bg-gray-100 light:text-black dark:bg-gray-700 dark:text-gray-800 min-h-screen flex items-center justify-center">
                <div className="bg-white shadow-md rounded p-8 max-w-4xl w-full overflow-y-scroll max-h-screen">
                    <h2 className="text-2xl font-semibold mb-4">Create Service</h2>
                    <form onSubmit={handleSubmit} className="flex flex-col">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Title:</label>
                            <input
                                type="text"
                                name="title"
                                className="mt-1 p-2 border rounded w-full"
                                value={serviceData.title}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Hourly Rate:</label>
                            <input
                                type="number"
                                name="hourlyRate"
                                className="mt-1 p-2 border rounded w-full"
                                value={serviceData.hourlyRate}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="mb-4 h-96 flex-grow">
                            <label className="block text-sm font-medium text-gray-700">Description:</label>
                            <QuillEditor  onChange={setQuillData} ></QuillEditor>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Preview Content:</label>
                            <textarea
                                name="previewContent"
                                rows={4} // Adjust the number of rows as needed
                                className="mt-1 p-2 border rounded w-full"
                                value={serviceData.previewContent}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Skills used(comma separted):</label>
                            <input
                                type="text"
                                name="skillsUsed"
                                className="mt-1 p-2 border rounded w-full"
                                value={serviceData.skillsUsed}
                                onChange={handleInputChange}
                            />
                        </div >

                        <div className="my-4">
                            {serviceData.subServices?.map((subService, index) => {
                                return (
                                    <div key={index}>


                                    </div>)
                            })}

                            <button type="button" onClick={() => setShowDialog(!showDialog)} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300">Add Subservice</button>
                        </div>

                        <AddImagesAndTags maxImages={1} onImagesAndTagsChange={handleChangedImage}></AddImagesAndTags>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                        >
                            Create Service
                        </button>
                    </form>

                    <div className={`fixed flex flex-col w-screen top-0 left-0 justify-center ${showDialog ? '' : ' hidden'}`}>
                        <div className="flex justify-end z-30">
                            <button className="self-end m-3" onClick={() => setShowDialog(!showDialog)} ><X color="red" className="cursor-pointer" /></button>
                        </div>
                        <CreateSubServcie></CreateSubServcie>
                    </div>
                </div>
            </div>

        </>
    )
}

export default CreateServcie