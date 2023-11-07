'use client'

import { useEffect, useState } from "react";
import AddImagesAndTags from "../AddImagesAndTags";
import Notification from "../Notification";
import { CreateBlogDTO, DisplayBlogDTO } from "@/crud/blog";
import { useParams } from "next/navigation";
import { CreateImageDTO } from "@/crud/images";
import { CreateTagDTO } from "@/crud/tags";
import Editor from "../RichTextEditor";

function BlogForm({ method, action, initial }: { method: 'POST' | 'PUT', action: string, initial?: CreateBlogDTO }) {
    const [notify, setNotify] = useState(false);
    const [notifyMessage, setNotifyMessage] = useState("");
    const [notifyType, setNotifyType] = useState<'success' | 'fail'>('fail');
    const [initialContent, setInitialContent] = useState("");

    const [blogData, setBlogData] = useState<CreateBlogDTO>({
        title: '',
        subTitle: '',
        description: '',
        featured: false,
        date: new Date(),
        content: '',
        template: '',
        author: { email: '' },
        tags: [],
        images: []

    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name == "author") {
            setBlogData(prevData => ({
                ...prevData,
                author: { email: value },
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
            setNotify(true); setNotifyMessage(resJson.message);
            setNotifyType('success');
        } else {
            setNotify(true); setNotifyMessage(resJson.message);
            setNotifyType('fail');
        }
    };

    function setQuillData(value: string) {
        setBlogData(prevData => ({
            ...prevData,
            content: value
        }))
    }


    const params = useParams();

    useEffect(() => {
        if(initial)  setBlogData(initial)
    }, [initial]);


    function handleChangedImageAndTag(images: CreateImageDTO[], tags: CreateTagDTO[]) {
        setBlogData((prevData) => ({
            ...prevData,
            images,
            tags
        }))

        console.log(tags)

    }


    return (
        <div className="light:bg-gray-100 light:text-black dark:bg-gray-700 dark:text-gray-800  bg-gray-100 min-h-screen flex items-center justify-center ">
            <div className="bg-white shadow-md rounded p-8 max-w-3xl w-full">
                <h2 className="text-2xl font-semibold mb-4">Create Blog</h2>
                <form onSubmit={handleSubmit} className="h-fit">
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
                        <input
                            type="text"
                            name="template"
                            className="mt-1 p-2 border rounded w-full"
                            value={blogData.template}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <AddImagesAndTags tags={blogData.tags} images={blogData.images} onImagesAndTagsChange={handleChangedImageAndTag} maxImages={10}></AddImagesAndTags>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                    >
                        {method==='POST'? 'Create Blog':'Update Blog'}
                    </button>
                </form>
            </div>
            <Notification visible={notify} setVisible={setNotify} message={notifyMessage} type={notifyType}></Notification>
        </div>
    );
}

export default BlogForm;