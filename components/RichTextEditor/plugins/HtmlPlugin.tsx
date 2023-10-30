import { $getRoot, $insertNodes, LexicalEditor } from "lexical"
import React, { useEffect, useState } from 'react'
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

function HtmlPlugin({ initial, onChange }: { initial?: string, onChange: (value: string) => void }) {
    const [editor] = useLexicalComposerContext();
    const [initalInsert, setInitalInsert] = useState(false);

    editor.registerUpdateListener(async ({ editorState }) => {
        // The latest EditorState can be found as `editorState`.
        // To read the contents of the EditorState, use the following API:
        editorState.read(() => {
            // Just like editor.update(), .read() expects a closure where you can use
            // the $ prefixed helper functions.
            if (editor) {
                const output = $generateHtmlFromNodes(editor);
                onChange(output);
            }

        });

    });
    useEffect(() => {
        if (initial && initial !== '<p class="editor-paragraph"><br></p>' && !initalInsert) {
            console.log("inital values are : ", initial, initalInsert);
            const parser = new DOMParser();
            const dom = parser.parseFromString(initial as string, 'text/html');
            console.log(dom);
            editor.update(() => {
                $generateNodesFromDOM(editor, dom)
                const nodes = $generateNodesFromDOM(editor, dom);

                // Select the root
                $getRoot().select();

                // Insert them at a selection.
                $insertNodes(nodes);
                setInitalInsert(true);
            })
        }
    }, [editor, initalInsert, initial]);

    return <></>
}

export default HtmlPlugin