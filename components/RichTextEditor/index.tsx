import { X } from "lucide-react";
import { useState, useEffect, ChangeEvent, useRef } from "react";
import { TinyMCE } from 'tinymce'
import { Editor as RichTextEditor, IAllProps } from '@tinymce/tinymce-react';
import { bufferToB64 } from "@/lib/utils";
import Script from "next/script";
import { markdownPlugin } from "./plugins/MarkDown";
import LoadingDots from "../shared/loading-dots";
interface BlobInfo {
    id: () => string;
    name: () => string;
    filename: () => string;
    blob: () => Blob;
    base64: () => string;
    blobUri: () => string;
    uri: () => string | undefined;
}
const filePickerCallback = async function loadFromComputer(cb: (value: string, meta?: Record<string, any>) => void, value: string, meta: Record<string, any>, editorRef: RichTextEditor | null) {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.addEventListener('change', async (e: Event) => {
        const target = e.target as HTMLInputElement
        let file = target.files ? target.files[0] : null;
        if (file) {
            // const newFileSrc = bufferToB64(await file.arrayBuffer(), file.type);
            const reader = new FileReader();
            reader.addEventListener('load', () => {

                const id = 'blobid' + (new Date()).getTime();
                if (!editorRef?.editor) return
                const blobCache = editorRef?.editor?.editorUpload.blobCache;
                const base64 = (reader.result as string).split(',')[1];
                const blobInfo = blobCache?.create(id, file, base64);
                blobCache?.add(blobInfo);
                // const res = await fetch('/api/cloudinary', {
                //     method: 'POST', body: JSON.stringify({
                //         file: newFileSrc,
                //         fileType: 'image',
                //         requestType: 'UPLOAD'
                //     })
                // })
                // const response = (await res.json())
                // console.log(response.data.url);
                cb(blobInfo.blobUri(), { title: file.name });
            })
            reader.readAsDataURL(file);


        }
    })

    input.click();

}

const uploadImages = async (blobInfo: BlobInfo, progress: (value: number) => void) => {
    progress(0)
    const file = bufferToB64(await blobInfo.blob().arrayBuffer(), blobInfo.blob().type)
    progress(90)
    const res = await fetch('/api/cloudinary', {
        method: 'POST', body: JSON.stringify({
            file: file,
            fileType: 'image',
            requestType: 'UPLOAD',
        })
    })
    progress(80)

    const { data } = await res.json();
    progress(100)

    return data.url as string
}

const deleteFile = async ({ src }: { src: string }) => {

    if (!src.startsWith('https://res.cloudinary.com')) return
    const res = await fetch('/api/cloudinary', {
        method: 'POST', body: JSON.stringify({
            src: src,
            fileType: 'image',
            requestType: 'DELETE'
        })
    })

    return
}
const Editor = ({ defaultValue, onChange }: { defaultValue?: string, onChange: (text: string) => void }) => {
    const [initialValue, setInitialValue] = useState(defaultValue || undefined);
    const [value, setValue] = useState<string>("");
    const [showPreview, setShowPreview] = useState(false);
    const editorRef = useRef<RichTextEditor>(null);
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

    function updatePreviewAndHandleChange(state: string) {

        onChange(state);
        setValue(state)
    }

    return (
        <div className="h-fit my-4">
            <div className="h-fit ">
                {isClient ? <RichTextEditor
                    ref={editorRef}
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
                        images_file_types: 'jpg,svg,webp',
                        file_picker_callback: async (cb, value, record) => filePickerCallback(cb, value, record, editorRef.current),
                        images_upload_handler: uploadImages,
                        image_advtab: true,
                        automatic_uploads: true,
                        extended_valid_elements: 'script[language|type|src], style[media|type]',
                        protect: [/<script>[\s\S]*?<\/script>/g, /<style>[\s\S]*?<\/style>/g],
                        setup: (editor) => {
                            markdownPlugin(editor);
                            editor.on("keydown", async function (e) {
                                if ((e.key === 'delete' || e.key == 'backspace') && editor.selection) {

                                }
                            });
                        }

                    }}
                    initialValue={initialValue}
                    onEditorChange={updatePreviewAndHandleChange}


                />

                    :
                    <>
                        <div className="my-5 flex justify-center items center">
                            <LoadingDots />
                        </div>

                    </>}

            </div>

        </div>
    );
};
export default Editor

