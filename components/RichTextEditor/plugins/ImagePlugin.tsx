import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $wrapNodeInElement, mergeRegister } from "@lexical/utils";
import {
  $createParagraphNode,
  $insertNodes,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  LexicalCommand
} from "lexical";
import { useCallback, useEffect, useState } from "react";

import { $createImageNode, ImageNode, ImagePayload } from "../nodes/ImageNode";
import { motion, useMotionValue } from "framer-motion";

export type InsertImagePayload = Readonly<ImagePayload>;

export const INSERT_IMAGE_COMMAND: LexicalCommand<InsertImagePayload> = createCommand(
  "INSERT_IMAGE_COMMAND"
);


export default function ImagesPlugin({
  captionsEnabled
}: {
  captionsEnabled?: boolean;
}): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([ImageNode])) {
      throw new Error("ImagesPlugin: ImageNode not registered on editor");
    }

    return mergeRegister(
      editor.registerCommand<InsertImagePayload>(
        INSERT_IMAGE_COMMAND,
        (payload) => {
          const imageNode = $createImageNode(payload);
          return $insertNodes([imageNode]);

        },
        COMMAND_PRIORITY_EDITOR
      )
    );
  }, [captionsEnabled, editor]);

  return null;
}
