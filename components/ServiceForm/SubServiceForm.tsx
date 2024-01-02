'use client'
import AddImagesAndTags from "@/components/AddImagesAndTags"
import { CreateImageDTO } from "@/crud/DTOs";
import { CreateSubServiceDTO, Discount } from "@/crud/DTOs";
import { CreateTagDTO } from "@/crud/DTOs";
import React, { useState } from 'react'
import ListInput from "../ListInput";
import DiscountsForm from "./Discount";
import { PricingModel } from "@prisma/client";
import Ajv from 'ajv'
import addFormats from "ajv-formats"
import { SubserviceSchema } from "@/crud/jsonSchemas";

const ajv = new Ajv()
//addFormats(ajv)
const validate = ajv.compile(SubserviceSchema);
function CreateSubService({ subService, handleSubServiceAdd }: { subService?: CreateSubServiceDTO, handleSubServiceAdd: (subservice: CreateSubServiceDTO) => void }) {
    const [subServiceData, setSubServiceData] = useState<CreateSubServiceDTO>(subService || {
        description: '',
        title: "",
        complexity: 0,
        department: "",
        discounts: [],
        estimated_hours_times_fifty_percent: 0,
        estimated_hours_times_one_hundred_percent: 0,
        pricingModel: PricingModel.DEFAULT,
        overheadCost: 0,
        serviceDeliverables: [],
        serviceUsageScore: 0,
        skillLevel: "",
        tags: [],
        image: { src: "" }
    });
    const [rawJson, setRawJson] = useState(JSON.stringify(subServiceData, null, 2));

    const [discounts, setDiscounts] = useState<Discount[]>(subService?.discounts || []);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setSubServiceData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };
    function handleChangedImage(image: CreateImageDTO[], tags: CreateTagDTO[]) {
        setSubServiceData((prevData) => ({
            ...prevData,
            image: image[0],
            tags
        }))

    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Send the productData to your backend for creating the product
        handleSubServiceAdd(subServiceData)
    };


    const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setSubServiceData({
            ...subServiceData,
            [name]: Number(e.target.value)
        })
    }

    function handleListChange(name: string, value: string[]) {

        setSubServiceData({
            ...subServiceData,
            [name]: value
        })
    }

    function parseJson(json: string) {
        try {
            const newData = JSON.parse(json)

            const valid = validate(newData);
            if (!valid) alert( validate.errors?.map(err=>(`${err.instancePath} ${err.message} (${err.schemaPath}) `)).join('\n'));
            else {

               if (Object.keys(newData).length > 0) {
                    console.log(newData);
                    for (let key of Object.keys(subServiceData)) {
                        setSubServiceData(prev => ({ ...prev, [key]: newData[key] }));

                    }
                }


            }

        } catch (error) {
            console.log("invalid JSON");
            alert("Error parsing JSON");

        }

    }
    return (
        <>
            <div className="light:bg-gray-100 light:text-black dark:bg-gray-700 dark:text-gray-800 min-h-screen flex items-center justify-center">
                <div className="bg-black backdrop-blur-lg bg-opacity-50 absolute inset-0 w-screen h-full z-10"></div>

                <div className=" fixed top-0 bg-white shadow-md rounded p-8 max-w-4xl w-full overflow-scroll max-h-screen z-50">
                    <h2 className="text-2xl font-semibold mb-4">Add Sub Service</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block" htmlFor="json">Json input auto fill: </label>
                            <textarea
                                className={"w-full ring-2 invalid:ring-red-500 p-3"}
                                name="json"
                                id=""
                                rows={7}
                                value={rawJson}
                                onChange={(event) => setRawJson(event.target.value)}
                            >
                            </textarea>
                            <button
                                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                                type="button"
                                onClick={() => parseJson(rawJson)}
                            >Parse Json</button>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Title:</label>
                            <input
                                type="text"
                                name="title"
                                className="mt-1 p-2 border rounded w-full"
                                value={subServiceData.title}
                                onChange={handleInputChange}
                                required
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
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Estimated time for 50%:</label>
                            <input
                                type="number"
                                name="estimated_hours_times_fifty_percent"
                                className="mt-1 p-2 border rounded w-full"
                                value={subServiceData.estimated_hours_times_fifty_percent == 0 ? "" : subServiceData.estimated_hours_times_fifty_percent}
                                onChange={handleNumberInputChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Estimated time for 100%:</label>
                            <input
                                type="number"
                                name="estimated_hours_times_one_hundred_percent"
                                className="mt-1 p-2 border rounded w-full"
                                value={subServiceData.estimated_hours_times_one_hundred_percent == 0 ? "" : subServiceData.estimated_hours_times_one_hundred_percent}
                                onChange={handleNumberInputChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Over-head Cost:</label>
                            <input
                                type="number"
                                name="overheadCost"
                                className="mt-1 p-2 border rounded w-full"
                                value={subServiceData.overheadCost == 0 ? "" : subServiceData.overheadCost}
                                onChange={handleNumberInputChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Service Usage Score:</label>
                            <input
                                type="number"
                                name="serviceUsageScore"
                                className="mt-1 p-2 border rounded w-full"
                                value={subServiceData.serviceUsageScore == 0 ? "" : subServiceData.serviceUsageScore}
                                onChange={handleNumberInputChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Complexity:</label>
                            <input
                                type="number"
                                name="complexity"
                                className="mt-1 p-2 border rounded w-full"
                                value={subServiceData.complexity == 0 ? "" : subServiceData.complexity}
                                onChange={handleNumberInputChange}
                                required
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
                                required
                            />
                        </div>
                        <div>
                            <DiscountsForm initial={subService?.discounts} onChange={(values) => setSubServiceData(prev => ({ ...prev, discounts: values }))} />
                        </div>
                        <div className="mb-4">
                            <ListInput
                                label="Service Deliverables"
                                initial={subServiceData.serviceDeliverables}
                                onChange={(values) => handleListChange('serviceDeliverables', values)}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Pricing Model:</label>
                            <select
                                name="pricingModel"
                                className="mt-1 p-2 border rounded w-full"
                                value={subServiceData.pricingModel}
                                onChange={handleInputChange}
                            >
                                {Object.keys(PricingModel).map((pricingModel, index) => (<option key={index} value={pricingModel}>{pricingModel}</option>))}

                            </select>
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

export default CreateSubService