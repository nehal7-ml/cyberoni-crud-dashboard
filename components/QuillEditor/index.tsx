'use client'
import React, { useRef, useState } from 'react';
import Quill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { X } from "lucide-react";
// react-quill QuillEditor
const QuillEditor = ({ onChange }: { onChange: (text: string) => void }) => {
    const [value, setValue] = useState<Quill.Value>("");
    const [showPreview, setShowPreview] = useState(false);
    const [fullScreen, setfullScreen] = useState(false);
    const editorRef = useRef(null);
    const previewRef = useRef(null);
    function textUpdate(value: string) {
        setValue(value)
        onChange(value);
    }
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
            ['link', 'image', 'video', 'code'],
            ['clean'],

        ],
    }

    const emptyModules = { toolbar: false }

    function togglePreview() {
        setShowPreview(!showPreview);
    }
    return (
        <div className="max-h-96 h-fit my-4">
            <div className="h-96">
                <Quill
                    ref={editorRef}
                    value={value}
                    onChange={textUpdate}
                    modules={modules}
                    theme="snow"
                    className="h-52 mb-4"

                />
                <button type="button" onClick={togglePreview} className="mt-16 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300">Preview</button>

            </div>

            <div className={"w-screen h-screen fixed top-0 left-0 light:bg-gray-100 light:text-black dark:bg-gray-700 dark:text-gray-800 flex flex-col items-center justify-start" + `${showPreview ? '' : ' hidden'}`}>
                <div className="bg-black backdrop-blur-lg bg-opacity-50 absolute inset-0 w-screen h-full z-10"></div>
                <div className="flex self-end mr-10 justify-end z-30">
                    <button type="button" className="self-end m-3" onClick={togglePreview} ><X color="red" className="cursor-pointer" /></button>
                </div>
                <div className="absolute top-0 z-30 w-3/4 h-full">
                    <Quill
                        ref={previewRef}
                        readOnly
                        defaultValue={value}
                        value={value}
                        theme="snow"
                        modules={emptyModules}
                        className="bg-white z-30 w-full h-full"
                    />
                </div>
            </div>
        </div>
    );
};
export default QuillEditor
