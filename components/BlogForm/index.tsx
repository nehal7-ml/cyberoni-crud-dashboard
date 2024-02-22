'use client'

import { useEffect, useState } from "react";
import AddImagesAndTags from "../AddImagesAndTags";
import Notification from "../Notification";
import { BlogSchema } from "@/crud/jsonSchemas";
import { CreateBlogDTO, CreateTagDTO, DisplayBlogDTO } from "@/crud/DTOs";
import { redirect, useParams, useRouter } from "next/navigation";
import { CreateImageDTO } from "@/crud/DTOs";
import Editor from "../RichTextEditor";
import Ajv from 'ajv'
import addFormats from "ajv-formats"
import DateInput from "../DateInput";
const ajv = new Ajv()
addFormats(ajv)
const validate = ajv.compile(BlogSchema);


function BlogForm({ method, action, initial }: { method: 'POST' | 'PUT', action: string, initial?: CreateBlogDTO }) {
    const [notify, setNotify] = useState(false);
    const [notifyMessage, setNotifyMessage] = useState("");
    const [notifyType, setNotifyType] = useState<'success' | 'fail'>('fail');
    const [initialContent, setInitialContent] = useState(initial?.content || "");


    const [blogData, setBlogData] = useState<CreateBlogDTO>(initial ||{
        title: '',
        subTitle: '',
        description: '',
        featured: false,
        date: new Date(),
        publishDate: new Date(),
        content: '',
        author: { email: '' },
        tags: [],
        images: []

    });
    const [rawJson, setRawJson] = useState(JSON.stringify(blogData, null, 2));
    const [json, setJson] = useState<{ [key: string]: any }>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | { target: { name: string, value: string | number | Date } }) => {
        const { name, value } = e.target;

        if (name == "author") {
            setBlogData(prevData => ({
                ...prevData,
                author: { email: value as string },
            }));
        }
        else {
            setBlogData(prevData => ({
                ...prevData,
                [name]: value,
            }));
        }

    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;


        setBlogData(prevData => ({
            ...prevData,
            [name]: checked,
        }));
    };
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer your-access-token',
        };
        // Send the userData to your backend for creating the user
        console.log(blogData)
        const res = await fetch(`${action}`, { method: method, body: JSON.stringify(blogData), headers })
        let resJson = await res.json();

        if (res.status == 200) {
            setNotifyType('success');
            setNotifyMessage(resJson.message);
            setNotify(true);

            router.replace(`/dashboard/blogs/view/${resJson.data.id}`)


        } else {
            setNotifyType('fail');
            setNotifyMessage(resJson.message);
            setNotify(true);

        }
    };

    function setQuillData(value: string) {
        setBlogData(prevData => ({
            ...prevData,
            content: value
        }))
    }



    useEffect(() => {
        if (initial) setBlogData(initial)
    }, [initial]);


    function handleChangedImageAndTag(images: CreateImageDTO[], tags: CreateTagDTO[]) {
        setBlogData((prevData) => ({
            ...prevData,
            images,
            tags
        }))

        console.log(images)

    }


    function parseJson(json: string) {
        try {
            const newData = JSON.parse(json)

            const valid = validate(newData);
            if (!valid) alert(validate.errors?.map(err => (`${err.instancePath} ${err.message} (${err.schemaPath}) `)).join('\n'));
            else {

                setJson(newData);
                if (Object.keys(newData).length > 0) {
                    console.log(newData);
                    for (let key of Object.keys(blogData)) {
                        console.log(key, newData[key]);
                        setBlogData(prev => ({ ...prev, [key]: newData[key] }));

                    }
                }

                if (newData.content as string) {
                    setInitialContent(newData.content as string);
                }

            }

        } catch (error) {
            console.log("invalid JSON", error);
            alert("Error parsing JSON" + error);

        }

    }


    return (
        <div className="light:bg-gray-100 light:text-black dark:bg-gray-700 dark:text-gray-800  bg-gray-100 min-h-screen flex items-center justify-center ">
            <div className="bg-white shadow-md rounded p-8 max-w-3xl w-full">
                <h2 className="text-2xl font-semibold mb-4">Create Blog</h2>
                <form onSubmit={handleSubmit} className="h-fit">

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
                    <div className="my-4 text-center font-bold  flex items-center justify-center gap-3"><hr className="w-1/3" /> OR <hr className="w-1/3" /></div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Title:</label>
                        <input
                            type="text"
                            name="title"
                            className="mt-1 p-2 border rounded w-full"
                            value={blogData.title}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Author email/username:</label>
                        <input
                            type="text"
                            name="author"
                            className="mt-1 p-2 border rounded w-full"
                            value={blogData.author.email}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Publish Date:</label>
                        <DateInput
                            name="publishDate"
                            value={blogData.publishDate}
                            onDateChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">SubTitle:</label>
                        <input
                            type="text"
                            name="subTitle"
                            className="mt-1 p-2 border rounded w-full"
                            value={blogData.subTitle}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Description:</label>
                        <textarea
                            name="description"
                            rows={7}
                            className="mt-1 p-2 border rounded w-full"
                            value={blogData.description}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Featured:
                            <input
                                type="checkbox"
                                name="featured"
                                className="ml-2"
                                checked={blogData.featured}
                                onChange={handleCheckboxChange}
                            />
                        </label>
                    </div>
                    <div className="mb-4 h-fit">
                        <label className="block text-sm font-medium text-gray-700">Content:</label>
                        <Editor onChange={setQuillData} defaultValue={initialContent}></Editor>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Template:</label>
                        <select
                            name="templateId"
                            className="mt-1 p-2 border rounded w-full"
                        >
                            <option value={undefined}>default</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <AddImagesAndTags tags={blogData.tags} images={blogData.images} onImagesAndTagsChange={handleChangedImageAndTag} maxImages={1}></AddImagesAndTags>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                    >
                        {method === 'POST' ? 'Create Blog' : 'Update Blog'}
                    </button>
                </form>
            </div>
            <Notification visible={notify} setVisible={setNotify} message={notifyMessage} type={notifyType}></Notification>
        </div>
    );
}

export default BlogForm;