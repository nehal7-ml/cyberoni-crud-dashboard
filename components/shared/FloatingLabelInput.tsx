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
            className=" focus:shadow-outline /dark:border-gray-200 /dark:text-gray-100 peer w-full appearance-none rounded-xl border bg-transparent px-4 py-4 leading-tight text-gray-700 shadow-lg   focus:outline-blue-500 disabled:cursor-not-allowed disabled:bg-gray-300 invalid:border-red-400 invalid:text-red-400 invalid:outline-red-400"
          ></input>

          <label
            className="/dark:bg-inherit /dark:text-gray-100 /dark:peer-placeholder-shown:bg-inherit absolute left-3 top-0 mb-2 block -translate-y-3 rounded-full bg-white px-1 text-sm text-gray-700    transition-transform  placeholder-shown:font-semibold peer-placeholder-shown:translate-y-3 peer-placeholder-shown:bg-white peer-focus:-translate-y-3   peer-focus:text-blue-500 peer-focus:backdrop-blur-lg peer-disabled:bg-gray-300 dark:backdrop-blur-sm"
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
