'use client'
import { createTagDTO } from "@/crud/tags";
import React, { useEffect, useState } from 'react'

function AddTags({ defaultTags, onTagsChange }: { defaultTags?: createTagDTO[], onTagsChange: (tags: createTagDTO[]) => void }) {
     const [initialTags, setInitialTags] = useState<createTagDTO[]>([]);
    const [tags, setTags] = useState<createTagDTO[]>([]);
    const [newTagName, setNewTagName] = useState('');

    const handleRemoveTag = (tagToRemove: createTagDTO) => {
        setTags(prevTags => prevTags.filter(tag => tag.name !== tagToRemove.name));
    };

    const handleAddTag = () => {
        if (newTagName) {
            setTags(prevTags => [...prevTags, { name: newTagName }]);
            setNewTagName('');
        }
    };

    useEffect(() => {
        if(tags.length > 0) {
        onTagsChange(initialTags.concat(tags))

        }
    }, [tags])


    useEffect(() => {
        setInitialTags(defaultTags || [])
        setTags([])
    }, [defaultTags]);


    return (
        <>
            <h2 className="text-lg font-semibold mb-2">Add Tags</h2>
            <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                    {(initialTags.concat(tags)).map(tag => (
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
                                X
                            </button>
                        </div>
                    ))}
                </div>
                <input
                    type="text"
                    className="p-2 border rounded w-full"
                    placeholder="Tag Name"
                    value={newTagName}
                    onChange={e => setNewTagName(e.target.value)}
                />
                <button
                    type="button"
                    className="mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                    onClick={handleAddTag}
                >
                    Add Tag
                </button>
            </div>
        </>
    )
}

export default AddTags
