'use client'
import { GitFork } from "lucide-react";
import { useRouter } from "next/navigation";
import { MouseEvent } from "react";

function DuplicateItem({ type, itemId }: { type: 'referrals', itemId: string }) {

    const router = useRouter();

    function handleDuplicate(e: MouseEvent<HTMLButtonElement>) {
        e.stopPropagation()
        e.preventDefault()

        router.push(`/dashboard/${type}/new?duplicate=true&id=${itemId}`);
    }
    return (
        <button type="button" onClick={handleDuplicate} className="flex items-center hover:text-green-500 hover:shadow-inner rounded-md p-3">
            <GitFork />
        </button>

    );
}


export default DuplicateItem;