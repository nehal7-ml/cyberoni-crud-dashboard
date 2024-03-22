'use client'
import React, { ReactNode, useEffect, useRef, useState } from 'react';

interface TooltipProps {
    text: string;
    children: ReactNode
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [position, setPosition] = useState<'above' | 'below'>('above');
    const tooltipRef = useRef<HTMLDivElement>(null);
    const tooltipContainerRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        function handleFocus(e: FocusEvent) {

            if (tooltipRef.current) {
                console.log("visible");
                const tooltipRect = tooltipRef.current.getBoundingClientRect();
                const viewportHeight = window.innerHeight;

                if (tooltipRect.bottom > viewportHeight) {
                    setPosition('above');
                } else {
                    setPosition('below');
                }
            }

        }
        if (tooltipContainerRef.current?.addEventListener) {
            tooltipContainerRef.current?.addEventListener('mouseenter', handleFocus)

        }

        return () => {
            if (tooltipContainerRef.current?.addEventListener) {
                tooltipContainerRef.current?.removeEventListener('mouseenter', handleFocus)

            }
        }
    }, []);
    return (
        <div className="relative inline-block">
            <div className="relative group" ref={tooltipContainerRef}  >
                {children}
                <div ref={tooltipRef} className={`absolute w-64 z-[99999] ${position === 'above' ? 'mb-8 bottom-0 left-0' : 'mt-2 top-full right-0'} text-center px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out`}>
                    {text}
                    <svg className={`absolute text-gray-800 h-2 w-full ${position === 'above' ? 'left-0 top-full' : 'left-0 bottom-full rotate-180'}`} x="0px" y="0px" viewBox="0 0 255 255">
                        <polygon className="fill-current" points="0,0 127.5,127.5 255,0" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default Tooltip;
