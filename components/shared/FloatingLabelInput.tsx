"use client";
import { DetailedHTMLProps } from "react";

function FloatingLabelInput(
    props: DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
    >,
) {
    return (
        <>
            <div className={props.className}>
                <div className="relative my-4">
                    <input
                        {...props}
                        placeholder=""
                        className=" disabled:bg-gray-300 disabled:cursor-not-allowed focus:shadow-outline peer w-full appearance-none rounded-xl border bg-transparent px-4 py-4 leading-tight text-gray-700 shadow-lg   focus:outline-blue-500 /dark:border-gray-200 /dark:text-gray-100"
                    ></input>

                    <label
                        className="/dark:bg-inherit /dark:text-gray-100 /dark:peer-placeholder-shown:bg-inherit absolute left-3 top-0 mb-2 block -translate-y-3 placeholder-shown:font-semibold rounded-full bg-white px-1 text-sm    text-gray-700  transition-transform peer-placeholder-shown:translate-y-3 peer-placeholder-shown:bg-white peer-disabled:bg-gray-300       peer-focus:-translate-y-3 peer-focus:text-blue-500 peer-focus:backdrop-blur-lg dark:backdrop-blur-sm"
                        htmlFor={props.name}
                    >
                        {props.placeholder}
                    </label>
                </div>
            </div>
        </>
    );
}

export default FloatingLabelInput;
