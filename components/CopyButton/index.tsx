"use client";
import { Copy, CopyCheckIcon } from "lucide-react";
import React, { useState } from "react";

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
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
    <div className="flex gap-3">
      <div className="w-40 overflow-clip text-ellipsis">{text}</div>
      <button onClick={copyToClipboard}>
        {copied ? <CopyCheckIcon className="text-green-400" /> : <Copy />}
      </button>
    </div>
  );
};

export default CopyButton;
