'use client'
import type { LexicalEditor, NodeKey } from "lexical";


import * as React from "react";
import { Suspense, useRef } from "react";
import { PanInfo, motion, useMotionValue } from "framer-motion";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { XCircle } from "lucide-react";
const imageCache = new Set();

function Resizable({ children, editable }: { children?: React.ReactNode, editable: boolean }) {
  const [isDragging, setIsDragging] = React.useState(false);
  const mHeight = useMotionValue(200);
  const mWidth = useMotionValue(200);
  const handleDrag = React.useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    let newHeight = mHeight.get() + info.delta.y;
    let newWidth = mWidth.get() + info.delta.x
    mHeight.set(newHeight);
    mWidth.set(newWidth);
  }, [mHeight, mWidth]);

  return (
    <div className="relative p-2 ">
      <div className={`${editable ? 'absolute top-0 left-0 ' : 'hidden'}  justify-center h-full w-full peer/image hover:visible hover:border-2`} >

        <motion.div
          className="absolute top-0 left-0 h-3 w-3  bg-black cursor-se-resize "
          drag={true}
          dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
          dragElastic={0}
          dragMomentum={false}
          onDrag={handleDrag}
          onDragEnd={() => {
            setIsDragging(false);
          }}
          onDragStart={() => {
            setIsDragging(true);
          }}
        >
        </motion.div>
        <motion.div
          className="absolute top-0 right-0  h-3 w-3  bg-black cursor-ne-resize "
          drag={true}
          dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
          dragElastic={0}
          dragMomentum={false}
          onDrag={handleDrag}
          onDragEnd={() => {
            setIsDragging(false);
          }}
          onDragStart={() => {
            setIsDragging(true);
          }}
        >
        </motion.div>
        <motion.div
          className="absolute bottom-0 left-0  h-3 w-3  bg-black cursor-ne-resize "
          drag={true}
          dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
          dragElastic={0}
          dragMomentum={false}
          onDrag={handleDrag}
          onDragEnd={() => {
            setIsDragging(false);
          }}
          onDragStart={() => {
            setIsDragging(true);
          }}
        >
        </motion.div>
        <motion.div
          className="absolute z-10 bottom-0 right-0  h-3 w-3  bg-black cursor-se-resize "
          drag={true}
          dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
          dragElastic={0}
          dragMomentum={false}
          onDrag={handleDrag}
          onDragEnd={() => {
            setIsDragging(false);
          }}
          onDragStart={() => {
            setIsDragging(true);
          }}
        >
        </motion.div>
      </div>
      <motion.div
        className={``}
        style={{
          height: mHeight,
          width: mWidth,
          maxWidth: '100%',
          maxHeight: '100%',
        }}
      >
        {children}
      </motion.div>

    </div>
  );
}
function useSuspenseImage(src: string) {
  if (!imageCache.has(src)) {
    throw new Promise((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        imageCache.add(src);
        resolve(null);
      };
    });
  }
}

function LazyImage({
  altText,
  className,
  imageRef,
  src,
  width,
  height,
  maxWidth
}: {
  altText: string;
  className: string | null;
  height: "inherit" | number;
  imageRef: { current: null | HTMLImageElement };
  maxWidth: number;
  src: string;
  width: "inherit" | number;
}): JSX.Element {
  useSuspenseImage(src);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={className || undefined}
      src={src}
      alt={altText}
      ref={imageRef}

    />
  );
}

export default function ImageComponent({
  src,
  altText,
  width,
  height,
  maxWidth,
  editable = false
}: {
  altText: string;
  caption: LexicalEditor;
  height: "inherit" | number;
  maxWidth: number;
  nodeKey: NodeKey;
  resizable: boolean;
  showCaption: boolean;
  src: string;
  width: "inherit" | number;
  captionsEnabled: boolean;
  editable?: boolean;
}): JSX.Element {
  const imageRef = useRef<null | HTMLImageElement>(null);
  const [editor] = useLexicalComposerContext()
  const editorRef = useRef(editor._rootElement)

  return (
    <div className="relative  peer cursor-pointer  max-h-full max-w-full">
      <Suspense fallback={null}>
        <>
          <Resizable editable={editor._editable}>
            <motion.div
              className="w-full h-full "
              drag={true}
              dragConstraints={editorRef}
              onDrag={
                (event, info) => console.log(info.point.x, info.point.y)
              }
            >
              <LazyImage
                className="w-full h-full"
                src={src}
                altText={altText}
                imageRef={imageRef}
                width={width}
                height={height}
                maxWidth={maxWidth}
              />
            </motion.div>
          </Resizable>
          <button
            type="button"
            onClick={() => {

            }}
            className={`hidden ${editor._editable ? 'peer-focus:inline-block' : 'hidden'}  absolute -right-3 top-0 hover`}>
            <XCircle className="text-rose-500" />
          </button>
        </>
      </Suspense>
    </div>
  );
}
