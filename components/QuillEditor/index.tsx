'use client'
import React, { useEffect, useMemo, useRef, useState } from 'react';
import type ReactQuill from "react-quill";
import { Value } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { X } from "lucide-react";
import dynamic from "next/dynamic";
// react-quill QuillEditor
const QuillEditor = ({ defaultValue, onChange }: { defaultValue: string, onChange: (text: string) => void }) => {
    const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

    const [value, setValue] = useState<Value>(defaultValue);
    const [showPreview, setShowPreview] = useState(false);
    const [fullScreen, setfullScreen] = useState(false);
    const editorRef = useRef<ReactQuill>(null);
    const previewRef = useRef<ReactQuill>(null);

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

    useEffect(() => {
        setValue(defaultValue)
    }, [ defaultValue]);
    return (
        <div className="max-h-96 h-fit my-4">
            <div className="h-96">
                <ReactQuill
                    defaultValue={defaultValue}
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
                    <ReactQuill
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
