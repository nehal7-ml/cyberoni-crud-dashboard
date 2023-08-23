'use client'
import AddImagesAndTags from "@/components/AddImagesAndTags"
import { createImageDTO } from "@/crud/images";
import { createSubServiceDTO } from "@/crud/subService";
import { createTagDTO } from "@/crud/tags";
import React, { useState } from 'react'

function CreateSubServcie() {
    const [subServiceData, setSubServiceData] = useState<createSubServiceDTO>({
        description: '',
        title: "",
        complexity: 0,
        department: "",
        discounts: "",
        estimated_hours_times_fifty_percent: 0,
        estimated_hours_times_one_hundred_percent: 0,
        pricingModel: '',
        overheadCost: 0,
        serviceDeliverables: '',
        serviceUsageScore: 0,
        skillLevel:"",
        tags: [],
        image: { src: "" }
    });


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSubServiceData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };
    function handleChangedImage(image: createImageDTO[], tags: createTagDTO[]) {
        setSubServiceData((prevData) => ({
            ...prevData,
            image: image[0],
            tags
        }))

    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Send the productData to your backend for creating the product
        console.log(subServiceData);
    };

    
    return (
        <>
                <div className="light:bg-gray-100 light:text-black dark:bg-gray-700 dark:text-gray-800 min-h-screen flex items-center justify-center">
                <div className="bg-black backdrop-blur-lg bg-opacity-50 absolute inset-0 w-screen h-full z-10"></div>

                <div className=" fixed top-0 bg-white shadow-md rounded p-8 max-w-4xl w-full overflow-scroll max-h-screen z-30">
                    <h2 className="text-2xl font-semibold mb-4">Add Sub Service</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Title:</label>
                            <input
                                type="text"
                                name="title"
                                className="mt-1 p-2 border rounded w-full"
                                value={subServiceData.title}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Department:</label>
                            <input
                                type="text"
                                name="department"
                                className="mt-1 p-2 border rounded w-full"
                                value={subServiceData.department}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Estimated time for 50%:</label>
                            <input
                                type="number"
                                name="estimated_hours_times_fifty_percent"
                                className="mt-1 p-2 border rounded w-full"
                                value={subServiceData.estimated_hours_times_fifty_percent}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Estimated time for 100%:</label>
                            <input
                                type="number"
                                name="estimated_hours_times_one_hundred_percent"
                                className="mt-1 p-2 border rounded w-full"
                                value={subServiceData.estimated_hours_times_one_hundred_percent}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Over-head Cost:</label>
                            <input
                                type="number"
                                name="overheadCost"
                                className="mt-1 p-2 border rounded w-full"
                                value={subServiceData.overheadCost}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Service Usage Score:</label>
                            <input
                                type="number"
                                name="serviceUsageScore"
                                className="mt-1 p-2 border rounded w-full"
                                value={subServiceData.serviceUsageScore}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Complexity:</label>
                            <input
                                type="number"
                                name="complexity"
                                className="mt-1 p-2 border rounded w-full"
                                value={subServiceData.complexity}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Description:</label>
                            <textarea
                                name="description"
                                rows={4} // Adjust the number of rows as needed
                                className="mt-1 p-2 border rounded w-full"
                                value={subServiceData.description}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">discounts (comma separted):</label>
                            <input
                                type="text"
                                name="discounts"
                                className="mt-1 p-2 border rounded w-full"
                                value={subServiceData.discounts}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Service Deliverables (comma separted):</label>
                            <input
                                type="text"
                                name="serviceDeliverables"
                                className="mt-1 p-2 border rounded w-full"
                                value={subServiceData.serviceDeliverables}
                                onChange={handleInputChange}
                            />
                        </div>
             
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">discounts (comma separted):</label>
                            <input
                                type="text"
                                name="discounts"
                                className="mt-1 p-2 border rounded w-full"
                                value={subServiceData.discounts}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Pricing Model:</label>
                            <input
                                type="text"
                                name="pricingModel"
                                className="mt-1 p-2 border rounded w-full"
                                value={subServiceData.pricingModel}
                                onChange={handleInputChange}
                            />
                        </div>
                        <AddImagesAndTags maxImages={1} onImagesAndTagsChange={handleChangedImage}></AddImagesAndTags>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                        >
                            Add Sub Service
                        </button>
                    </form>
                </div>
            </div>

        </>
    )
}

export default CreateSubServcie