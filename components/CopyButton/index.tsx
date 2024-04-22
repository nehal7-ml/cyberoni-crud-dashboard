"use client";
import { Copy, CopyCheckIcon } from "lucide-react";
import React, { useState } from "react";

const CopyButton = ({
  text,
  showText,
}: {
  text: string;
  showText?: boolean;
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log("Text copied to clipboard:", text);
        setCopied(true);
        setTimeout(() => setCopied(false), 750); // Reset copied state after 3 seconds
      })
      .catch((err) => {
        console.error("Error copying text to clipboard:", err);
      });
  };

  return (
    <div className="flex gap-3 w-full items-center justify-center">
      {showText ? (
        <div className="w-40 overflow-clip text-ellipsis">{text}</div>
      ) : null}
      <button onClick={copyToClipboard} className="p-3">
        {copied ? <CopyCheckIcon className="text-green-400" /> : <Copy />}
      </button>
    </div>
  );
};

export default CopyButton;
