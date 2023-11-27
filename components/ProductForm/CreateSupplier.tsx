'use client'
import AddImagesAndTags from "@/components/AddImagesAndTags"
import { CreateImageDTO } from "@/crud/images";
import { CreateSupplierDTO } from "@/crud/supplier";
import { CreateTagDTO } from "@/crud/tags";
import React, { useState } from 'react'

function CreateSupplier({ supplier, handleSupplierAdd }: { supplier?: CreateSupplierDTO, handleSupplierAdd: (subservice: CreateSupplierDTO) => void }) {
    const [supplierData, setSupplierData] = useState<CreateSupplierDTO>(supplier || {
        baseShippingPrice: 0,
        supplierName: "",
        height: 0,
        length: 0,
        width: 0,
        weight: 0,
        supplierUrl: "",
        availability: "",
        listPrice: 0,
        salePrice: 0,
        shippingWeight: 0,
        supplierEmail: "",
        supplierStatus: "",
        supplierWhatsApp: "",
        supplierWrittenComments: ""
    });


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSupplierData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };
    function handleChangedImage(image: CreateImageDTO[], tags: CreateTagDTO[]) {
        setSupplierData((prevData) => ({
            ...prevData,
            image: image[0],
            tags
        }))

    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Send the productData to your backend for creating the product
        handleSupplierAdd(supplierData)
    };


    const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setSupplierData({
            ...supplierData,
            [name]: value === "" ? "" : Number(value),
        })
    }

    return (
        <>
            <div className="light:bg-gray-100 light:text-black dark:bg-gray-700 dark:text-gray-800 min-h-screen flex items-center justify-center">
                <div className="bg-black backdrop-blur-lg bg-opacity-50 absolute inset-0 w-screen h-full z-10"></div>

                <div className=" fixed top-0 bg-white shadow-md rounded p-8 max-w-4xl w-full overflow-scroll max-h-screen z-30">
                    <h2 className="text-2xl font-semibold mb-4">Add Sub Service</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Name:</label>
                            <input
                                type="text"
                                name="supplierName"
                                className="mt-1 p-2 border rounded w-full"
                                value={supplierData.supplierName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Supplier URl:</label>
                            <input
                                type="text"
                                name="supplierUrl"
                                className="mt-1 p-2 border rounded w-full"
                                value={supplierData.supplierUrl}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">height:</label>
                            <input
                                type="number"
                                name="height"
                                className="mt-1 p-2 border rounded w-full"
                                value={supplierData.height}
                                onChange={handleNumberInputChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">length:</label>
                            <input
                                type="number"
                                name="length"
                                className="mt-1 p-2 border rounded w-full"
                                value={supplierData.length}
                                onChange={handleNumberInputChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">width:</label>
                            <input
                                type="number"
                                name="width"
                                className="mt-1 p-2 border rounded w-full"
                                value={supplierData.width}
                                onChange={handleNumberInputChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">weight:</label>
                            <input
                                type="number"
                                name="weight"
                                className="mt-1 p-2 border rounded w-full"
                                value={supplierData.weight}
                                onChange={handleNumberInputChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">base Shipping Price:</label>
                            <input
                                type="number"
                                name="baseShippingPrice"
                                className="mt-1 p-2 border rounded w-full"
                                value={supplierData.baseShippingPrice}
                                onChange={handleNumberInputChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">shipping Weight:</label>
                            <input
                                type="number"
                                name="shippingWeight"
                                className="mt-1 p-2 border rounded w-full"
                                value={supplierData.shippingWeight}
                                onChange={handleNumberInputChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">list Price:</label>
                            <input
                                type="number"
                                name="listPrice"
                                className="mt-1 p-2 border rounded w-full"
                                value={supplierData.listPrice}
                                onChange={handleNumberInputChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">sale Price</label>
                            <input
                                type="number"
                                name="salePrice"
                                className="mt-1 p-2 border rounded w-full"
                                value={supplierData.salePrice}
                                onChange={handleNumberInputChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Supplier Email:</label>
                            <input
                                type=""
                                name="supplierEmail"
                                className="mt-1 p-2 border rounded w-full"
                                value={supplierData.supplierEmail}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Supplier WhatsApp:</label>
                            <input
                                type="text"
                                name="supplierWhatsApp"
                                className="mt-1 p-2 border rounded w-full"
                                value={supplierData.supplierWhatsApp}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Supplier Status:</label>
                            <input
                                type="text"
                                name="supplierStatus"
                                className="mt-1 p-2 border rounded w-full"
                                value={supplierData.supplierStatus}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Availability: </label>
                            <input
                                type="text"
                                name="availability"
                                className="mt-1 p-2 border rounded w-full"
                                value={supplierData.availability}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">supplier Written Comments:</label>
                            <input
                                type="text"
                                name="supplierWrittenComments"
                                className="mt-1 p-2 border rounded w-full"
                                value={supplierData.supplierWrittenComments}
                                onChange={handleInputChange}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                        >
                            Add Supplier
                        </button>
                    </form>
                </div>
            </div>

        </>
    )
}

export default CreateSupplier