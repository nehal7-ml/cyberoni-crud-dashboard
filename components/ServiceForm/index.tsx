'use client'
import AddImagesAndTags from "@/components/AddImagesAndTags"
import { CreateImageDTO } from "@/crud/DTOs";
import { CreateServiceDTO, CreateServiceDescription, DisplayServiceDTO } from "@/crud/DTOs";
import { ServiceSchema } from "@/crud/jsonSchemas";
import { CreateTagDTO } from "@/crud/DTOs";
import React, { useEffect, useState } from 'react'
import { Edit, PlusCircle, X } from "lucide-react";
import { CreateSubServiceDTO } from "@/crud/DTOs";

import Notification, { NotificationType } from "@/components/Notification";
import CreateSubServcie from "./SubServiceForm";
import { PricingModel, Service } from "@prisma/client";
import Image from "next/image";
import DescriptionForm from "./DescriptionSection";
import ListInput from "../ListInput";
import { redirect, useRouter } from "next/navigation";
import Ajv from 'ajv'
import addFormats from "ajv-formats"
import { generateUUID } from "@/lib/utils";

const ajv = new Ajv()
//addFormats(ajv)
const validate = ajv.compile(ServiceSchema);

function SerivceForm({ method, action, initial }: { method: 'POST' | 'PUT', action: string, initial?: DisplayServiceDTO }) {
    const [notify, setNotify] = useState(false);
    const [notifyMessage, setNotifyMessage] = useState("");
    const [notifyType, setNotifyType] = useState<'success' | 'fail'>('fail');

    const [showDialog, setShowDialog] = useState(false);
    const [serviceData, setServiceData] = useState<CreateServiceDTO>({
        hourlyRate: 0,
        featured: false,
        previewContent: "",
        skillsUsed: [],
        title: "",
        htmlEmbed: "",
        valueBrought: [],
        SubServices: [],
        ServiceDescription: [],
        tags: [],
        image: undefined
    });
    const [editSubservice, setEditSubservice] = useState<number >(-1);

    const [descriptionForm, setDescriptionForm] = useState(false);
    const [rawJson, setRawJson] = useState(JSON.stringify(serviceData, null, 2));
    const [json, setJson] = useState<{ [key: string]: any }>({});

    const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setServiceData({
            ...serviceData,
            [name]: Number(value)
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
    function handleChangedImage(image: CreateImageDTO[], tags: CreateTagDTO[]) {
        setServiceData((prevData) => ({
            ...prevData,
            image: image[0],
            tags
        }))

    }
    const router = useRouter()
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer your-access-token',
        };
        // Send the userData to your backend for creating the user
        const res = await fetch(action, { method, body: JSON.stringify(serviceData), headers })
        let resJson = await res.json();

        if (res.status == 200) {
            message('success', resJson.message);
            router.replace(`/dashboard/services/view/${resJson.data.id}`)

        } else {
            message('fail', resJson.message)

        }
    };

    function message(type: NotificationType, message: string) {
        setNotify(true);
        setNotifyType(type);
        setNotifyMessage(message);

    }

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;


        setServiceData(prevData => ({
            ...prevData,
            [name]: checked,
        }));
    };


    function handleSubServiceChange(subServices: CreateSubServiceDTO[]) {

        setServiceData((prevData) => ({
            ...prevData,
            SubServices: subServices
        }))

        setShowDialog(false)

    }

    function handleRemoveSubService(subServiceToRemove: CreateSubServiceDTO) {

        if (subServiceToRemove.id) {
            setServiceData((prevData) => ({
                ...prevData,
                SubServices: prevData.SubServices?.filter(subService => subService.id !== subServiceToRemove.id)
            }))

        } else {
            setServiceData((prevData) => ({
                ...prevData,
                SubServices: prevData.SubServices?.filter(subService => subService.title !== subServiceToRemove.title)
            }))
        }


    }

    function handleDescritionChange(description: CreateServiceDescription) {
        setServiceData(prev => ({
            ...prev,
            ServiceDescription: [...prev.ServiceDescription, description]
        }))

        setDescriptionForm(false)
    }

    useEffect(() => {
        if (initial) setServiceData(initial as CreateServiceDTO)
    }, [initial]);


    function parseJson(json: string) {
        try {
            const newData = JSON.parse(json)

            const valid = validate(newData);
            if (!valid) alert(validate.errors?.map(err => (`${err.instancePath} ${err.message} (${err.schemaPath}) `)).join('\n'));
            else {

                setJson(newData);
                if (Object.keys(newData).length > 0) {
                    console.log(newData);
                    for (let key of Object.keys(serviceData)) {
                        setServiceData(prev => ({ ...prev, [key]: newData[key] }));

                    }
                }


            }

        } catch (error) {
            console.log("invalid JSON", error);
            alert("Error parsing JSON" + error);

        }

    }



    return (
        <>
            <div className="light:bg-gray-100 light:text-black dark:bg-gray-700 dark:text-gray-800 min-h-screen flex items-center justify-center container mx-auto">
                <div className="bg-white shadow-md rounded p-8 max-w-4xl w-full overflow-y-scroll max-h-screen">
                    <h2 className="text-2xl font-semibold mb-4"> {method === 'PUT' ? 'Update' : 'Create'} Service</h2>
                    <form onSubmit={handleSubmit} className="flex flex-col">
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
                                value={serviceData.title}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Featured:
                                <input
                                    type="checkbox"
                                    name="featured"
                                    className="ml-2"
                                    checked={serviceData.featured}
                                    onChange={handleCheckboxChange}
                                />
                            </label>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Hourly Rate:</label>
                            <input
                                type="number"
                                name="hourlyRate"
                                className="mt-1 p-2 border rounded w-full"
                                value={serviceData.hourlyRate == 0 ? '' : serviceData.hourlyRate}
                                onChange={handleNumberInputChange}
                                required
                            />
                        </div>

                        <div className="mb-4 h-fit   flex-grow">
                            <label className="block text-sm font-medium text-gray-700">Description:</label>
                            {serviceData.ServiceDescription?.map((section, index) => {

                                return <div className={`flex gap-5 w-full my-4 border-dotted border-2 p-2 ${section.imageOnLeft ? 'flex-row' : 'flex-row-reverse'}`} key={index}>
                                    <div className="flex justify-end ">
                                        <button className="self-end   mx-10 my-3" onClick={() => setServiceData(prev =>
                                        ({
                                            ...prev,
                                            ServiceDescription: prev.ServiceDescription.filter((desc, ind) => (ind !== index))

                                        }))} ><X color="red" className="cursor-pointer" /></button>
                                    </div>
                                    <div className="w-1/3 ">
                                        <Image src={section.image.src} alt={`${index}-section`} height={500} width={500} ></Image>
                                    </div>
                                    <div className="w-2/3 justify-evenly">
                                        <div className="font-bold text-3xl">{section.title}</div>
                                        <div>{section.content}</div>
                                    </div>

                                </div>
                            })}

                            <div className="w-full flex justify-center items-end  p-2">
                                <button type="button" onClick={() => {
                                   setDescriptionForm(true)
                                }} className="p-2 hover:shadow-lg hover:bg-blue-600 bg-blue-500 rounded-full" >
                                    <PlusCircle className=" text-white" />
                                </button>
                            </div>


                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Preview Content:</label>
                            <textarea
                                name="previewContent"
                                rows={4} // Adjust the number of rows as needed
                                className="mt-1 p-2 border rounded w-full"
                                value={serviceData.previewContent}
                                onChange={handleInputChange}
                                required

                            />
                        </div>
                        <div className="mb-4">

                            <ListInput
                                label="Value Brought"
                                initial={serviceData.valueBrought}
                                onChange={(values) => setServiceData(prev => ({ ...prev, valueBrought: values }))}
                            />
                        </div >
                        <div className="mb-4">
                            <ListInput
                                label="Skills used"
                                initial={serviceData.skillsUsed}
                                onChange={(values) => setServiceData(prev => ({ ...prev, skillsUsed: values }))}
                            />
                        </div >

                        <div className="my-4 flex flex-wrap gap-2">
                            {serviceData.SubServices?.map((subService, index) => {
                                return (
                                    <div key={index} className="bg-blue-200 text-blue-800 p-2 rounded flex items-center">
                                        <button type="button" className="flex gap-2" onClick={() => {
                                            setEditSubservice(index);
                                            setShowDialog(true);
                                        }}>
                                            <span>{subService.title}</span>
                                            <Edit />

                                        </button>
                                        <button
                                            type="button"
                                            className="ml-2 text-red-600 hover:text-red-800 focus:outline-none focus:ring focus:ring-red-300"
                                            onClick={() => handleRemoveSubService(subService)}
                                        >
                                            X
                                        </button>
                                    </div>)
                            })}

                            <button type="button" onClick={() =>{
                                                                            setEditSubservice(-1);

                                setShowDialog(!showDialog)}} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300">Add Subservice</button>
                        </div>

                        <AddImagesAndTags maxImages={1} onImagesAndTagsChange={handleChangedImage} images={serviceData?.image ? [serviceData?.image] : []} tags={serviceData?.tags}></AddImagesAndTags>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                        >
                            {method === 'PUT' ? 'Update Service' : 'Create Service'}
                        </button>
                    </form>

                    <div className={`fixed flex flex-col w-screen top-0 left-0 justify-center ${showDialog ? '' : ' hidden'}`}>
                        <div className="flex justify-end z-30 ">
                            <button className="self-end   mx-10 my-3" onClick={() => setShowDialog(!showDialog)} ><X color="red" className="cursor-pointer" /></button>
                        </div>
                        <CreateSubServcie current={editSubservice} subServices={serviceData.SubServices ?? []} handleSubServiceChange={handleSubServiceChange}></CreateSubServcie>
                    </div>
                    <div className={`fixed flex flex-col w-screen top-0 left-0 justify-center ${descriptionForm ? '' : ' hidden'}`}>
                        <div className="flex justify-end z-30">
                            <button type="button" className="self-end mx-10 my-3" onClick={() => setDescriptionForm(false)} ><X color="red" className="cursor-pointer" /></button>
                        </div>
                        <DescriptionForm handleDescritionChange={handleDescritionChange} />
                    </div>
                </div>
            </div>
            <Notification visible={notify} setVisible={setNotify} message={notifyMessage} type={notifyType}></Notification>

        </>
    )
}

export default SerivceForm