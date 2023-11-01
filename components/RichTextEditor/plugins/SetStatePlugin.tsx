import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $parseSerializedNode, EditorState } from "lexical";
function SetStatePlugin({ state }: { state: string }) {
    const [editor] = useLexicalComposerContext();

    
    editor.update(() => {
        const newState = editor.parseEditorState(state)
        editor.setEditorState(newState);
    })
    return (<></>);
}

export default SetStatePlugin;