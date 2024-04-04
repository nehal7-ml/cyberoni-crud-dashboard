"use client";

import { useEffect, useState } from "react";

function ListInput({
  label,
  initial,
  onChange,
}: {
  label: string;
  initial: string[];
  onChange: (value: string[]) => void;
}) {
  const [list, setList] = useState<string[]>(initial || []);
  const [newTagName, setNewTagName] = useState("");

  const handleRemoveTag = (tagToRemove: string) => {
    let newTags = list.filter((tag) => tag !== tagToRemove);

    setList(newTags);
    onChange(newTags);
  };

  const handleAddTag = () => {
    if (newTagName) {
      // Split the input by commas, then trim each tag to remove leading/trailing whitespace
      let addedTags = newTagName.trim().split(",").map(tag => tag.trim());
      // Filter out any empty strings that might result from the trimming in case of multiple commas
      let newTags = [...list, ...addedTags.filter(tag => tag !== '')];
  
      setList(newTags);
      setNewTagName("");
      onChange(newTags);
    }
  };

  useEffect(() => {
    if (initial && initial.length > 0) {
      setList(initial);
    }
  }, [initial]);

  return (
    <div>
      <label>{label}</label>

      <div className="my-1 flex flex-wrap gap-2">
        {list.map((tag, index) => (
          <div
            key={index}
            className="flex items-center justify-around rounded bg-blue-200 p-2 text-blue-800"
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
      <input
        type="text"
        className="w-full rounded border p-2"
        placeholder={label}
        value={newTagName}
        onChange={(e) => setNewTagName(e.target.value)}
      />
      <button
        type="button"
        className="mt-2 rounded bg-blue-500 p-2 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
        onClick={handleAddTag}
      >
        Add List item
      </button>
    </div>
  );
}

export default ListInput;
