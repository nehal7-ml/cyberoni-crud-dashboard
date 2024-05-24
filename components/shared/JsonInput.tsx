import { Dispatch, SetStateAction } from "react";
import Tooltip from "./ToolTip";
import { HelpCircle } from "lucide-react";
import CopyButton from "../CopyButton";

function JsonInput({ parseJson, rawJson, setRawJson, example }: { setRawJson: Dispatch<SetStateAction<string>>, rawJson: string, parseJson: (json: string) => void , example?: string }) {
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
            <div className="mt-4 flex gap-2 items-center justify-center">
                <button
                    className="w-full flex-grow rounded bg-blue-500 p-2 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                    type="button"
                    onClick={() => parseJson(rawJson)}
                >
                    Parse Json
                </button>
                <Tooltip  text={`click to copy example`}>
                    <CopyButton text={example ?? "{}"} showText={false} />
                </Tooltip>
            </div>
        </div>);
}

export default JsonInput;