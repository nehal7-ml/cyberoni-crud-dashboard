import { X } from "lucide-react";
import { useState, useEffect, ChangeEvent } from "react";
import { Editor as TinyMCE } from 'tinymce'
import { Editor as RichTextEditor, IAllProps } from '@tinymce/tinymce-react';
import { bufferToB64 } from "@/lib/utils";


const filePickerCallback = async function loadFromComputer(cb: (value: string, meta?: Record<string, any>) => void, value: string, meta: Record<string, any>) {


    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.addEventListener('change', async (e: Event) => {
        const target = e.target as HTMLInputElement
        let file = target.files ? target.files[0] : null;
        if (file) {
            const newFileSrc = bufferToB64(await file.arrayBuffer(), file.type);
            const res = await fetch('/api/cloudinary', {
                method: 'POST', body: JSON.stringify({
                    file: newFileSrc,
                    fileType: 'image',
                    requestType: 'UPLOAD'
                })
            })
            const response = (await res.json())
            console.log(response.data.url);
            cb(response.data.url, { title: file.name });

        }
    })

    input.click();

}

const Editor = ({ defaultValue, onChange }: { defaultValue?: string, onChange: (text: string) => void }) => {
    const [initialValue, setInitialValue] = useState(defaultValue || undefined);
    const [value, setValue] = useState<string>();
    const [showPreview, setShowPreview] = useState(false);
    // const editorRef = useRef<ReactQuill>(null);
    // const previewRef = useRef<ReactQuill>(null);

    const [isClient, setIsClient] = useState(false);




    function togglePreview() {
        setShowPreview(!showPreview);
    }

    useEffect(() => {
        setInitialValue(defaultValue || "");
        setValue(defaultValue || "");
    }, [defaultValue]);

    useEffect(() => {
        setIsClient(true)
    }, []);

    function updatePreviewAndHandleChange(state: string, editor: TinyMCE) {

        onChange(state);
        setValue(state)
    }

    return (
        <div className="h-fit my-4">
            <div className="h-fit ">
                {isClient && <RichTextEditor
                    apiKey={'w5nc9aqbzcv7ao6jscyo80kncaq1vbpp63v2wqazfsbjkowp'}
                    init={{
                        content_css: 'writer',
                        plugins: [
                            "advlist", "autolink", "lists", "link", "charmap", "preview", "anchor", "pagebreak",
                            "searchreplace", 'wordcount', 'visualblocks', "visualchars", "fullscreen",
                            "insertdatetime", "media", "nonbreaking", "save", "table", "directionality",
                            "emoticons", "template",
                            "image",
                            "code",
                            "media"

                        ],
                        toolbar1: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent  | fullscreen",
                        toolbar2: "link image code media",
                        file_picker_types: 'image',
                        file_picker_callback: filePickerCallback,
                        image_advtab: true

                    }}
                    initialValue={initialValue}
                    onEditorChange={updatePreviewAndHandleChange}
                />}
                <button type="button" onClick={togglePreview} className=" bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300">Preview</button>

            </div>

            <div className={"w-screen h-screen fixed top-0 left-0 light:bg-gray-100 light:text-black dark:bg-gray-700 dark:text-gray-800 flex flex-col items-center justify-start z-30" + `${showPreview ? '' : ' hidden'}`}>
                <div className="bg-black backdrop-blur-lg bg-opacity-50 absolute inset-0 w-screen h-full z-10"></div>
                <div className="flex self-end mr-10 justify-end z-30">
                    <button type="button" className="self-end m-3" onClick={togglePreview} ><X color="red" className="cursor-pointer" /></button>
                </div>
                <div className="absolute top-0 z-30 w-3/4 h-fit">
                    {isClient && <RichTextEditor
                        apiKey={'w5nc9aqbzcv7ao6jscyo80kncaq1vbpp63v2wqazfsbjkowp'}
                        init={
                            {
                                readOnly: true,
                                toolbar: "",
                                menu: {},

                            }
                        }
                        initialValue={value as string}
                    />}
                </div>
            </div>
        </div>
    );
};
export default Editor

