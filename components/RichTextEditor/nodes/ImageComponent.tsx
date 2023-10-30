'use client'
import type { LexicalEditor, NodeKey } from "lexical";


import * as React from "react";
import { Suspense, useRef } from "react";
import { motion, useMotionValue } from "framer-motion";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
const imageCache = new Set();

function Resizable({ children }: { children?: React.ReactNode }) {
  const [isDragging, setIsDragging] = React.useState(false);
  const mHeight = useMotionValue(200);

  const handleDrag = React.useCallback((_event: any, info: { delta: { y: number; }; }) => {
    let newHeight = mHeight.get() + info.delta.y;
    if (newHeight > 200 && newHeight < 400) {
      mHeight.set(mHeight.get() + info.delta.y);
    }
  }, [mHeight]);

  return (
    <div>
      <motion.div
        className={`bg-sky-400 h-[${mHeight}] cursor-row-resize`}
        onDoubleClick={() => {
          console.log("Dbl click");
          mHeight.set(900);
        }}
      >
        {children}
      </motion.div>
      <div className="flex justify-center" >
        <motion.div
          className=""
          drag="y"
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
      style={{
        height,
        maxWidth,
        width
      }}
    />
  );
}

export default function ImageComponent({
  src,
  altText,
  width,
  height,
  maxWidth
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
}): JSX.Element {
  const imageRef = useRef<null | HTMLImageElement>(null);
  const [editor] = useLexicalComposerContext()
  const editorRef = useRef(editor._rootElement)

  return (
    <Suspense fallback={null}>
      <>
        <Resizable>
          <motion.div
            className="w-fit h-auto"
            dragTransition={{ bounceStiffness: 600, bounceDamping: 10 }}
            drag
            dragConstraints={editorRef}
            onDrag={
              (event, info) => console.log(info.point.x, info.point.y)
            }
            whileHover={{
              scale: 1.2,
              transition: { duration: 1 },
            }}
          >
            <LazyImage
              className=""
              src={src}
              altText={altText}
              imageRef={imageRef}
              width={width}
              height={height}
              maxWidth={maxWidth}
            />
          </motion.div>
        </Resizable>

      </>
    </Suspense>
  );
}
