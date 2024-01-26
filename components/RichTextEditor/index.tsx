import { X } from "lucide-react";
import { useState, useEffect, ChangeEvent } from "react";
import { Editor as TinyMCE } from 'tinymce'
import { Editor as RichTextEditor, IAllProps } from '@tinymce/tinymce-react';
import { bufferToB64 } from "@/lib/utils";
import Script from "next/script";
import { markdownPlugin } from "./plugins/MarkDown";


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
    const [value, setValue] = useState<string>("");
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
                            "image", "code", "media"



                        ],
                        toolbar1: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent  | fullscreen",
                        toolbar2: "link image code media  markdown",
                        file_picker_types: 'image',
                        file_picker_callback: filePickerCallback,
                        image_advtab: true,
                        extended_valid_elements: 'script[language|type|src], style',
                        protect: [/<script>[\s\S]*?<\/script>/g , /<style>[\s\S]*?<\/style>/g],
                        setup: (editor)=> {
                           markdownPlugin(editor);
                            
                        }
                    }}
                    initialValue={initialValue}
                    onEditorChange={updatePreviewAndHandleChange}
                    
                    
                />}

            </div>

        </div>
    );
};
export default Editor

