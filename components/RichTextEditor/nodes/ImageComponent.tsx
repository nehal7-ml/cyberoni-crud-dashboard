'use client'
import type { LexicalEditor, NodeKey } from "lexical";


import * as React from "react";
import { Suspense, useRef } from "react";
import { PanInfo, motion, useMotionValue } from "framer-motion";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Trash, XCircle } from "lucide-react";
import Loading from "@/components/Loading";
import { deleteFile } from "@/lib/cloudinary";
const imageCache = new Set();

function Resizable({ children, editable, show }: { children?: React.ReactNode, editable: boolean, show: boolean }) {
  const [isDragging, setIsDragging] = React.useState(false);
  const mHeight = useMotionValue(200);
  const mWidth = useMotionValue(200);
  const handleDrag = React.useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    let newHeight = mHeight.get() + info.delta.y;
    let newWidth = mWidth.get() + info.delta.x
    mHeight.set(newHeight);
    mWidth.set(newWidth);
  }, [mHeight, mWidth]);

  const [resize, setResize] = React.useState(false);
  function handleFocus() {
    setResize(prev => !prev);
  }
  return (
    <div className="relative p-2 w-fit" onClick={handleFocus} onBlur={() => { setResize(false) }}>
      <motion.div
        className={`z-20`}
        tabIndex={1}
        style={{
          height: mHeight,
          width: mWidth,
          maxWidth: '100%',
          maxHeight: '100%',
        }}
      >
        {children}

      </motion.div>

      <div tabIndex={2}
 className={`${editable && show ? 'absolute top-0 left-0 ' : 'hidden'}  justify-center h-full w-full peer/image hover:visible hover:border-2 z-10`} >

        <motion.div
          className="absolute top-0 left-0 h-3 w-3  border-black border-l-4 border-t-4 cursor-se-resize "
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
          className="absolute top-0 right-0  h-3 w-3  border-black border-r-4 border-t-4 cursor-ne-resize "
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
          className="absolute bottom-0 left-0  h-3 w-3 bg-transparent border-black border-l-4 border-b-4 cursor-ne-resize "
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
          className="absolute z-10 bottom-0 right-0  h-3 w-3  border-black border-r-4 border-b-4 cursor-se-resize "
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

function LazyImage(
  props

: React.ImgHTMLAttributes<HTMLImageElement >): JSX.Element {
  useSuspenseImage(props.src  as string);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}

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
}){
  const imageRef = useRef<null | HTMLImageElement>(null);
  const [editor] = useLexicalComposerContext()
  const editorRef = useRef(editor._rootElement)
  const [showDelete, setShowDelete] = React.useState(false);
  const [position, setPosition] = React.useState({x: 0, y: 0});
  const [deleted, setDeleted] = React.useState(false);
  function handleFocus() {
    //setShowDelete(prev => !prev);
    console.log("toggle");
  }

  async function handleDelete() {
    const id = src.split('/').slice(-1)[0].split('.')[0] as string;
    await  fetch ('/api/cloudinary' ,{method: 'POST', body: JSON.stringify({
      fileId: id,
      requestType: 'DELETE',
      fileType: 'image',
    })} );
    setDeleted(true)
    
  }
  return  (<div className="relative  peer w-fit  max-h-full max-w-full" >
      <Suspense fallback={<Loading />}>
        <>
          <Resizable editable={editor._editable} show={showDelete}>
            <motion.div
              className="relative w-full h-full "
              drag={true}
              dragConstraints={editorRef}
              onDrag={
                (event, info) => setPosition({x:info.point.x, y:info.point.y})
              }
            >
              <LazyImage
                className="w-full h-full cursor-pointer z-20"
                src={src}                
                alt={altText}
                width={width}
                height={height}
                onClick={handleFocus}
                onBlur={handleFocus}
              />
              <button
                type="button"
                onClick={() => {

                }}
                className={` ${editor._editable && showDelete ? 'inline-block animate-fade-right' : 'hidden'}  absolute -right-6 top-1/2 hover`}>
                <Trash className="text-rose-500 shadow-sm bg-gray-300  hover:text-white hover:bg-rose-500 rounded-sm p-1" />
              </button>
            </motion.div>

          </Resizable>

        </>
      </Suspense>
    </div>)
  
}
