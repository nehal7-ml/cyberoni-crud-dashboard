"use client";
import { Copy, CopyCheckIcon } from "lucide-react";
import React, { useState } from "react";
import { forwardRef } from "react";

const CopyButton = forwardRef<
  HTMLButtonElement,
  { text: string; showText?: boolean }
>(({ text, showText }, ref) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    navigator.clipboard
      .writeText(text)
      .then(() => {
        // console.log("Text copied to clipboard:", text);
        setCopied(true);
        setTimeout(() => setCopied(false), 750); // Reset copied state after 3 seconds
      })
      .catch((err) => {
        console.error("Error copying text to clipboard:", err);
      });
  };

  return (
    <div className="flex w-full items-center justify-center gap-3">
      {showText ? (
        <div className="w-40 overflow-clip text-ellipsis">{text}</div>
      ) : null}
      <button ref={ref} type="button" onClick={copyToClipboard} className="p-3">
        {copied ? <CopyCheckIcon className="text-green-400" /> : <Copy />}
      </button>
    </div>
  );
});

CopyButton.displayName = "CopyButton";

export default CopyButton;
