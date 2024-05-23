import { Dispatch, SetStateAction } from "react";

function JsonInput({ parseJson, rawJson, setRawJson }: { setRawJson: Dispatch<SetStateAction<string>>, rawJson: string, parseJson: (json: string) => void }) {
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
            <button
                className="w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                type="button"
                onClick={() => parseJson(rawJson)}
            >
                Parse Json
            </button>
        </div>);
}

export default JsonInput;