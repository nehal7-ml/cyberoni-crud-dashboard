'use client'
import AddImagesAndTags from "@/components/AddImagesAndTags";
import { CreateImageDTO } from "@/crud/DTOs";
import { CreateGptPromptDTO } from "@/crud/prompt";
import { CreateTagDTO } from "@/crud/DTOs";
import React, { useState } from 'react';
import Notification, { NotificationType } from "@/components/Notification";
import ListInput from "../ListInput";
import { redirect, useRouter } from "next/navigation";

const GptPromptForm = ({ method, action, initial }: { method: 'POST' | 'PUT', action: string, initial?: CreateGptPromptDTO }) => {

    const [notify, setNotify] = useState(false);
    const [notifyMessage, setNotifyMessage] = useState("");
    const [notifyType, setNotifyType] = useState<'success' | 'fail'>('fail');

    const [gptPromptData, setGptPromptData] = useState<CreateGptPromptDTO>(initial || {
        description: '',
        prompt: '',
        temperature: 0,
        max_tokens: 0,
        top_p: 0,
        best_of: 0,
        frequency_penalty: 0,
        presence_penalty: 0,
        stop: [],
        timesUsed: 0,
        timesIntegrated: 0,
        costPerToken: 0,
        profitMargin: 0,
        tags: [],
        image: undefined,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setGptPromptData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };
 const router = useRouter()
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer your-access-token',
        };
        // Send the userData to your backend for creating the user

        const res = await fetch(`${action}`, { method, body: JSON.stringify(gptPromptData), headers })
        let resJson = await res.json();
        console.log(res.status);
        if (res.status == 200) {
            message('success', resJson.message)
            router.replace(`/dashboard/prompts/view/${resJson.data.id}`)


        } else {
            message('fail', resJson.message)

        }
    };

    function message(type: NotificationType, message: string) {
        setNotify(true);
        setNotifyType(type);
        setNotifyMessage(message);

    }
    function handleChangedImage(images: CreateImageDTO[], tags: CreateTagDTO[]) {
        setGptPromptData((prevData) => ({
            ...prevData,
            image: images[0],
            tags
        }))

    }

    function handleNumberInput(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setGptPromptData(prevData => ({
            ...prevData,
            [name]: value === "" ? "" : Number(value),
        }));
    }

    function handleListInput(name: string, value: string[]) {
        setGptPromptData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    }

    return (
        <div className="light:bg-gray-100 light:text-black dark:bg-gray-700 dark:text-gray-800 max-h-screen p-2 flex items-center justify-center">
            <div className="bg-white shadow-md rounded p-8 max-w-md w-full overflow-scroll max-h-screen m-1">
                <h2 className="text-2xl font-semibold mb-4">{method === 'POST' ? 'Create' : 'Update'} GPT Prompt</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Description:</label>
                        <input
                            type="text"
                            name="description"
                            className="mt-1 p-2 border rounded w-full"
                            value={gptPromptData.description}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Prompt:</label>
                        <textarea
                            name="prompt"
                            rows={3}
                            className="mt-1 p-2 border rounded w-full"
                            value={gptPromptData.prompt}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <ListInput initial={gptPromptData.stop} label="Stop sequences (comma separated):" onChange={(value) => handleListInput('stop', value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-1 ">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">frequency penalty :</label>
                            <input
                                type="number"
                                name="frequency_penalty"
                                className="mt-1 p-2 border rounded w-full"
                                value={gptPromptData.frequency_penalty}
                                onChange={handleNumberInput}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">best of:</label>
                            <input
                                type="number"
                                name="best_of"
                                className="mt-1 p-2 border rounded w-full"
                                value={gptPromptData.best_of}
                                onChange={handleNumberInput}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">presence penalty:</label>
                            <input
                                type="number"
                                name="presence_penalty"
                                className="mt-1 p-2 border rounded w-full"
                                value={gptPromptData.presence_penalty}
                                onChange={handleNumberInput}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">temperature:</label>
                            <input
                                type="number"
                                name="temperature"
                                className="mt-1 p-2 border rounded w-full"
                                value={gptPromptData.temperature}
                                onChange={handleNumberInput}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">cost Per Token:</label>
                            <input
                                type="number"
                                name="costPerToken"
                                className="mt-1 p-2 border rounded w-full"
                                value={gptPromptData.costPerToken}
                                onChange={handleNumberInput}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">max tokens:</label>
                            <input
                                type="number"
                                name="max_tokens"
                                className="mt-1 p-2 border rounded w-full"
                                value={gptPromptData.max_tokens}
                                onChange={handleNumberInput}
                            />
                        </div>
                    </div>
                    <AddImagesAndTags maxImages={1} onImagesAndTagsChange={handleChangedImage}></AddImagesAndTags>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                    >
                        {method === 'POST' ? 'Create' : 'Update'}  GPT Prompt
                    </button>
                </form>
            </div>
            <Notification visible={notify} setVisible={setNotify} message={notifyMessage} type={notifyType}></Notification>

        </div>
    );

};

export default GptPromptForm;
