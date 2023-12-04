import { CreateTagDTO } from "@/crud/tags";
import { X } from "lucide-react";
import React, { useEffect, useState } from 'react'

type chipProps = {
    handleRemoveTag: (tag: CreateTagDTO) => void;
    tags: Array<CreateTagDTO>;
}

function TagChips({ tags, handleRemoveTag }: chipProps) {
    const [currentTags, setTags] = useState<CreateTagDTO[]>(tags);

    const handleClick = (tagToRemove: CreateTagDTO) => {
        setTags(prevTags => { return prevTags.filter(tag => tag.name === tagToRemove.name); });
        handleRemoveTag(tagToRemove)
    };

    useEffect(() => {
        setTags(tags)
    }, [tags]);

    return (
        <>
            {currentTags.map(tag => (
                <div
                    key={tag.name}
                    className="bg-blue-200 text-blue-800 p-2 rounded flex items-center"
                >
                    <span>{tag.name}</span>
                    <button
                        type="button"
                        className="ml-2 text-red-600 hover:text-red-800 focus:outline-none focus:ring focus:ring-red-300"
                        onClick={() => handleRemoveTag(tag)}
                    >
                       <X color="red" />
                    </button>
                </div>
            ))}
        </>
    )
}

export default TagChips