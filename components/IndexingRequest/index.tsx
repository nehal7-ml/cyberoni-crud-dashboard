"use client";
import { InfoIcon, SearchCheck, X } from "lucide-react";
import Tooltip from "../shared/ToolTip";
import Modal from "../shared/Modal";
import { FormEvent, useEffect, useState } from "react";
import { indexEverything } from "./submit";
import Loading from "../Loading";
import Notification, { toast } from "../Notification";
import LoadingDots from "../shared/loading-dots";
import Link from "next/link";

function IndexingRequest() {
    const [loading, setLoading] = useState(false);
    const [infoModal, setInfoModal] = useState(false);
    const [progress, setProgress] = useState(0);

    async function requestIndexing(event: FormEvent) {
        event.preventDefault()
        setLoading((prev) => !prev);
        try {
            await indexEverything();
        } catch (error) {
            toast((error as Error).toString(), {
                type: 'error'
            })
            console.error("Error occurred while indexing:", error);
        }

        toast('Requested indexing successfully ', {
            type: 'success'
        })
        setLoading((prev) => !prev);
    }

    return (
        <div className="z-30">
            <form onSubmit={requestIndexing}>
                <Tooltip text="Index all blogs and services">
                    <div className="flex gap-2">
                        <button type="submit" className="flex rounded-md p-2 shadow-md">
                            <SearchCheck />
                            Request Indexing
                        </button>
                        <button type="button" onClick={() => setInfoModal((prev) => !prev)}><InfoIcon /></button>
                    </div>
                </Tooltip>
            </form>
            <Modal show={infoModal} setShow={setInfoModal}>
                <div className="relative w-fit bg-gray-50 rounded-md flex flex-col justify-center items-center">
                    <button onClick={() => setInfoModal((prev) => !prev)} className="absolute hover:text-red-500 top-5 right-5"><X></X></button>
                    <div className="flex container p-5 flex-col justify-center items-center text-center">
                        <InfoIcon className="h-10 w-10 text-gray-500" />
                        <span>the time it takes for Google to index blog pages varies significantly based on several factors, including the size of the website, the quality of the content, and the website's crawl budget.</span>
                        <span>Maximum requests by default is 200/day add quota in <Link className="underline text-blue-400" target="_blank" href={'https://console.cloud.google.com/projectselector2/apis/dashboard?organizationId=0&supportedpurview=project'}>Cloud console </Link> for more</span>
                        <span>View Indexing information about you site on the <Link className="underline text-blue-400" href={"https://search.google.com/search-console"} target="_blank" >Search Console</Link> </span>
                    </div>
                </div>
            </Modal>
            {loading && <div className="z-[9999]">
                <Loading />
            </div>}
            <Notification />
        </div>
    );
}

export default IndexingRequest;
