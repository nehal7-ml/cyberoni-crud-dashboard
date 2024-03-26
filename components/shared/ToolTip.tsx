"use client";
import React, { ReactNode, useEffect, useRef, useState } from "react";

interface TooltipProps {
  text: string;
  children: ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [position, setPosition] = useState<"above" | "below">("above");
  const tooltipRef = useRef<HTMLDivElement>(null);
  const tooltipContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleFocus(e: FocusEvent) {
      if (tooltipRef.current) {
        console.log("visible");
        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        if (tooltipRect.bottom > viewportHeight) {
          setPosition("above");
        } else {
          setPosition("below");
        }
      }
    }
    if (tooltipContainerRef.current?.addEventListener) {
      tooltipContainerRef.current?.addEventListener("mouseenter", handleFocus);
    }

    return () => {
      if (tooltipContainerRef.current?.addEventListener) {
        tooltipContainerRef.current?.removeEventListener(
          "mouseenter",
          handleFocus,
        );
      }
    };
  }, []);
  return (
    <div className="relative inline-block">
      <div className="group relative" ref={tooltipContainerRef}>
        {children}
        <div
          ref={tooltipRef}
          className={`absolute z-[99999] ${position === "above" ? "bottom-0 left-0 mb-8" : "right-0 top-full mt-2"} rounded-md bg-gray-800 px-2 py-1 text-center text-xs text-white opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100`}
        >
          {text}
          <svg
            className={`absolute h-2 w-full text-gray-800 ${position === "above" ? "left-0 top-full" : "bottom-full left-0 rotate-180"}`}
            x="0px"
            y="0px"
            viewBox="0 0 255 255"
          >
            <polygon className="fill-current" points="0,0 127.5,127.5 255,0" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Tooltip;
