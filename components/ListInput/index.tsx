'use client'

import { useEffect, useState } from "react";

function ListInput({ label, initial, onChange }: { label: string, initial: string[], onChange: (value: string[]) => void }) {

    const [list, setList] = useState<string[]>(initial || []);
    const [newTagName, setNewTagName] = useState('');

    const handleRemoveTag = (tagToRemove: string) => {
        let newTags = list.filter(tag => tag !== tagToRemove)

        setList(newTags);
        onChange(newTags)
    };

    const handleAddTag = () => {
        if (newTagName) {
            let addedTags = newTagName.trim().split(',');
            let newTags = [...list, ...addedTags]

            setList(newTags);
            setNewTagName('');
            onChange(newTags)
        }
    };




    useEffect(() => {
        if (initial && initial.length > 0) {
            setList(initial)
        }

    }, [initial]);

    return (
        <div>
            <label>{label}</label>

            <div className="flex flex-col gap-2 my-1">
                {list.map(tag => (
                    <div
                        key={tag}
                        className="bg-blue-200 text-blue-800 p-2 rounded flex items-center justify-around"
                    >
                        <span className="line-clamp-1">{tag}</span>
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
            <input type="text"
                className="p-2 border rounded w-full"
                placeholder={label}
                value={newTagName}
                onChange={e => setNewTagName(e.target.value)} />
            <button
                type="button"
                className="mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                onClick={handleAddTag}
            >
                Add List item
            </button>
        </div>

    );
}

export default ListInput;