"use client";
import { DetailedHTMLProps } from "react";

function FloatingLabelTextArea(
    props: DetailedHTMLProps<
        React.TextareaHTMLAttributes<HTMLTextAreaElement>,
        HTMLTextAreaElement
    >,
) {
    return (
        <>
            <div className={props.className}>
                <div className="relative my-3">
                    <textarea
                        {...props}
                        placeholder=""
                        className="disabled:bg-gray-300 disabled:cursor-not-allowed focus:shadow-outline peer w-full appearance-none rounded-xl border bg-transparent px-4 py-10 leading-tight text-gray-700 shadow-lg focus:outline-none  /dark:border-gray-200 /dark:text-gray-100 lg:py-4"
                    ></textarea>

                    <label
                        className="/dark:bg-transparent /dark:text-gray-100 /dark:backdrop-blur-sm /peer-placeholder-shown:dark:bg-inherit absolute left-3 top-0 mb-2 block  -translate-y-3 rounded-full bg-white px-1  text-sm  font-bold  text-gray-900 transition-transform peer-placeholder-shown:translate-y-3   peer-placeholder-shown:bg-white peer-focus:-translate-y-3 peer-focus:text-blue-500 peer-focus:backdrop-blur-lg"
                        htmlFor={props.name}
                    >
                        {props.placeholder}
                    </label>
                </div>
            </div>
        </>
    );
}

export default FloatingLabelTextArea;
