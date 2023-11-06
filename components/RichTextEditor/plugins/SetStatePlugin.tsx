import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
function SetStatePlugin({ state }: { state: string }) {
    const [editor] = useLexicalComposerContext();
      // 'empty' editor
  const value = '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}';

    useEffect(() => {
        setTimeout(() => {
            editor.update(() => {
                const newState = editor.parseEditorState(state ||value)
                editor.setEditorState(newState);
            }, {discrete:true})
        })
        
    }, [state, editor])

    return (<></>);
}

export default SetStatePlugin;