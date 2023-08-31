'use client'
import AddImagesAndTags from "@/components/AddImagesAndTags"
import { createImageDTO } from "@/crud/images";
import { createServiceDTO } from "@/crud/service";
import { createTagDTO } from "@/crud/tags";
import React, { useEffect, useState } from 'react'
import { X } from "lucide-react";
import QuillEditor from "@/components/QuillEditor";
import { createSubServiceDTO } from "@/crud/subService";
import { createUserDTO } from "@/crud/user";
import { useParams } from "next/navigation";
import CreateSubServcie from "./CreateSubService";

function CreateServcie() {
    const [notify, setNotify] = useState(false);
    const [notifyMessage, setNotifyMessage] = useState("");
    const [notifyType, setNotifyType] = useState<'success' | 'fail'>('fail');

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


    const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setServiceData({
            ...serviceData,
            [name]: Number(e.target.value)
        })
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        console.log(name, ":   ", typeof value)
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer your-access-token',
        };
        // Send the userData to your backend for creating the user
        const res = await fetch(`${apiUrl}/services/${params.id}`, { method: 'PUT', body: JSON.stringify(serviceData), headers })
        let resJson = await res.json();

        if (res.status == 200) {
            setNotify(true); setNotifyMessage(resJson.message);
            setNotifyType('success');
        } else {
            setNotify(true); setNotifyMessage(resJson.message);
            setNotifyType('fail');
        }
    };


    function setQuillData(value: string) {
        setServiceData(prevData => ({
            ...prevData,
            description: value
        }))
    }


    function handleSubServiceAdd(subService: createSubServiceDTO) {

        setServiceData((prevData) => ({
            ...prevData,
            subServices: [...(prevData.subServices || []), subService]
        }))

        setShowDialog(false)

    }

    function handleRemoveSubService(subServiceToRemove: createSubServiceDTO) {
        setServiceData((prevData) => ({
            ...prevData,
            subServices: prevData.subServices?.filter(subService => subService.title !== subServiceToRemove.title)
        }))

    }

    const params = useParams();

    useEffect(() => {

        async function fetchData() {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;

            const headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer your-access-token',
            };
            // Send the userData to your backend for creating the user
            const res = await fetch(`${apiUrl}/services/${params.id}`, { method: 'GET', headers })
            let resJson = await res.json();
            console.log(resJson)

            if (res.status == 200) {
                setServiceData(resJson.data as createServiceDTO);
            } else {
                setNotify(true); setNotifyMessage(resJson.message);
                setNotifyType('fail');
            }
        }

        fetchData()
    }, []);
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
                                onChange={handleNumberInputChange}
                            />
                        </div>

                        <div className="mb-4 h-96 flex-grow">
                            <label className="block text-sm font-medium text-gray-700">Description:</label>
                            <QuillEditor defaultValue={serviceData.description} onChange={setQuillData} ></QuillEditor>
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
                            <label className="block text-sm font-medium text-gray-700">Value Brought:</label>
                            <input
                                type="text"
                                name="valueBrought"
                                className="mt-1 p-2 border rounded w-full"
                                value={serviceData.valueBrought}
                                onChange={handleInputChange}
                            />
                        </div >
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

                        <div className="my-4 flex flex-wrap gap-2">
                            {serviceData.subServices?.map((subService, index) => {
                                return (
                                    <div key={index} className="bg-blue-200 text-blue-800 p-2 rounded flex items-center">
                                        <span>{subService.title}</span>
                                        <button
                                            type="button"
                                            className="ml-2 text-red-600 hover:text-red-800 focus:outline-none focus:ring focus:ring-red-300"
                                            onClick={() => handleRemoveSubService(subService)}
                                        >
                                            X
                                        </button>
                                    </div>)
                            })}

                            <button type="button" onClick={() => setShowDialog(!showDialog)} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300">Add Subservice</button>
                        </div>

                        <AddImagesAndTags maxImages={1} onImagesAndTagsChange={handleChangedImage}></AddImagesAndTags>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                        >
                            Update Service
                        </button>
                    </form>

                    <div className={`fixed flex flex-col w-screen top-0 left-0 justify-center ${showDialog ? '' : ' hidden'}`}>
                        <div className="flex justify-end z-30">
                            <button className="self-end m-3" onClick={() => setShowDialog(!showDialog)} ><X color="red" className="cursor-pointer" /></button>
                        </div>
                        <CreateSubServcie handleSubServiceAdd={handleSubServiceAdd}></CreateSubServcie>
                    </div>
                </div>
            </div>

        </>
    )
}

export default CreateServcie