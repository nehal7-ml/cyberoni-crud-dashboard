"use client";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import Tooltip from "./ToolTip";
import { ChevronDown, HelpCircle } from "lucide-react";
import CopyButton from "../CopyButton";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";

function JsonInput({
    parseJson,
    rawJson,
    setRawJson,
    example,
}: {
    setRawJson: Dispatch<SetStateAction<string>>;
    rawJson: string;
    parseJson: (json: string) => void;
    example?: string | { name: string; json: string }[];
}) {
    const [currentExample, setCurrentExample] = useState(0);
    const copyButton = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        copyButton.current?.click();
        
    }, [currentExample]);
    return (
        <div className="mb-4">
            <label className="block" htmlFor="json">
                Json input auto fill:{" "}
            </label>
            <textarea
                className={"w-full p-3 ring-2 invalid:ring-red-500"}
                name="json"
                id=""
                rows={7}
                value={rawJson}
                onChange={(event) => setRawJson(event.target.value)}
            ></textarea>
            <div className="mt-4 flex items-center justify-center gap-2">
                <button
                    className="w-full flex-grow rounded bg-blue-500 p-2 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                    type="button"
                    onClick={() => parseJson(rawJson)}
                >
                    Parse Json
                </button>
                <Tooltip text={`click to copy example`}>
                    {Array.isArray(example) ? (
                        <>
                            <div className="flex items-center">
                                <CopyButton
                                    ref={copyButton}
                                    text={example[currentExample].json}
                                    showText={false}
                                />
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <ChevronDown />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="center">
                                        {example.map((example, index) => (
                                            <DropdownMenuRadioItem
                                                className={`cursor-pointer`}
                                                onSelect={() => {
                                                    setCurrentExample(index);
                                                }}
                                                key={index}
                                                value={index.toString()}
                                            >
                                                {example.name}{" "}
                                            </DropdownMenuRadioItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </>
                    ) : (
                        <CopyButton ref={copyButton} text={example ?? "{}"} showText={false} />
                    )}
                </Tooltip>
            </div>
        </div>
    );
}

export default JsonInput;
