'use client'
import React, { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from 'react';
// import BlotFormatter from 'quill-blot-formatter';
import './theme/styles.css';
import { X } from "lucide-react";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';

import ToolbarPlugin from "./plugins/Toolbar";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS } from "@lexical/markdown";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import ListMaxIndentLevelPlugin from "./plugins/ListMaxIndentLevelPlugin";
import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin";
import AutoLinkPlugin from "./plugins/AutoLinkPlugin";
import Theme from "./theme";
import ImagePlugin from "./plugins/ImagePlugin";
//import { ImageNode } from "./nodes/ImageNode";
import HtmlPlugin from "./plugins/HtmlPlugin";
import { ImageNode } from "./nodes/ImageNode";
import { LexicalEditor } from "lexical";
import { parseEditorState } from "lexical/LexicalUpdates";
import type { EditorState } from "lexical";
import SetStatePlugin from "./plugins/SetStatePlugin";

function Placeholder() {
    return <div className="editor-placeholder">Enter some rich text...</div>;
}

const previewConfig = {
    editable: false,
    namespace: 'Preview',
    onError(error: any) {
        console.log(error)
        // Any custom nodes go here
    },
    nodes: [
        HeadingNode,
        ListNode,
        ListItemNode,
        QuoteNode,
        CodeNode,
        CodeHighlightNode,
        TableNode,
        TableCellNode,
        TableRowNode,
        AutoLinkNode,
        LinkNode,
        ImageNode
    ]
}

const editorConfig = {
    // The editor theme
    theme: Theme,
    // Handling of errors during update
    onError(error: any) {
        console.log(error)
        // Any custom nodes go here
    },
    namespace: '@lexical/react',
    nodes: [
        HeadingNode,
        ListNode,
        ListItemNode,
        QuoteNode,
        CodeNode,
        CodeHighlightNode,
        TableNode,
        TableCellNode,
        TableRowNode,
        AutoLinkNode,
        LinkNode,
        ImageNode
    ]
};
let ReactRichText = ({ initial, onChange }: { initial?: string, onChange: (value: EditorState) => void }, ) => {


    function handleChange() {

        // console.log(event)
        onChange
    }
    return (
        <LexicalComposer initialConfig={editorConfig} >
            <div className="editor-container z-30">
                <ToolbarPlugin />
                <div className="editor-inner">
                    <RichTextPlugin
                        contentEditable={<ContentEditable onChange={handleChange} className="editor-input" />}
                        placeholder={<Placeholder />}
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                    <OnChangePlugin onChange={editorState => onChange(editorState)} />
                    <HistoryPlugin />
                    <AutoFocusPlugin />
                    <CodeHighlightPlugin />
                    <ListPlugin />
                    <LinkPlugin />
                    <ImagePlugin />
                    <AutoLinkPlugin />
                    <ListMaxIndentLevelPlugin maxDepth={7} />
                    <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
                </div>
            </div>
        </LexicalComposer>
    );
};

const Preview = ({ value }: { value: string }) => {

    // console.log(value);
    const editorRef = useRef<LexicalEditor>(null);
    return (
    <LexicalComposer  initialConfig={{ ...previewConfig}}  >
        <div className="editor-inner">
            <RichTextPlugin
                contentEditable={<ContentEditable className="editor-input" />}
                placeholder={<Placeholder />}
                ErrorBoundary={LexicalErrorBoundary}

            />
            <SetStatePlugin  state={value}/>
            <HistoryPlugin />
            <AutoFocusPlugin />
            <CodeHighlightPlugin />
            <ListPlugin />
            <LinkPlugin />
            <ImagePlugin />
            <AutoLinkPlugin />
            <ListMaxIndentLevelPlugin maxDepth={7} />
            <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        </div>
    </LexicalComposer>)

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

    function updatePreviewAndHandleChange(editorState: EditorState) {
        onChange(JSON.stringify(editorState.toJSON()));
        setValue(JSON.stringify(editorState.toJSON()))
    }

    return (
        <div className="h-fit my-4">
            <div className="h-fit ">
                {isClient && <ReactRichText initial={initialValue} onChange={updatePreviewAndHandleChange} />}
                <button type="button" onClick={togglePreview} className=" bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300">Preview</button>

            </div>

            <div className={"w-screen h-screen fixed top-0 left-0 light:bg-gray-100 light:text-black dark:bg-gray-700 dark:text-gray-800 flex flex-col items-center justify-start" + `${showPreview ? '' : ' hidden'}`}>
                <div className="bg-black backdrop-blur-lg bg-opacity-50 absolute inset-0 w-screen h-full z-10"></div>
                <div className="flex self-end mr-10 justify-end z-30">
                    <button type="button" className="self-end m-3" onClick={togglePreview} ><X color="red" className="cursor-pointer" /></button>
                </div>
                <div className="absolute top-0 z-30 w-3/4 h-full">
                    {isClient && <Preview value={value as string} />}
                </div>
            </div>
        </div>
    );
};
export default Editor
