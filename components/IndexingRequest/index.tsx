'use client'
import { InfoIcon, SearchCheck } from "lucide-react";
import Tooltip from "../shared/ToolTip";
import Modal from "../shared/Modal";
import { useEffect, useState } from "react";
import { indexEverything } from "./submit";
import Loading from "../Loading";

function IndexingRequest() {
    const [showProgress, setShowProgress] = useState(false);
    const [progress, setProgress] = useState(0);

    async function requestIndexing() {
        setShowProgress(prev=> !prev);
        const res = await indexEverything();

        setShowProgress(prev=> !prev);
    }

    useEffect(() => {
        console.log(showProgress);
    }, [showProgress]);
    return (
        <div>
            <form action={requestIndexing}>
                <Tooltip text="Index all blogs and services">
                    <button type="submit" className="flex rounded-md p-2 shadow-md">        <SearchCheck />
                        Request Indexing
                    </button>
                </Tooltip>

            </form>
            <Modal show={showProgress} setShow={setShowProgress}>
                <div className="w-fit">
                    <Loading />
                </div>
            </Modal>
        </div>);
}

export default IndexingRequest;