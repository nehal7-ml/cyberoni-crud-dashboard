"use client";
import { CreateTagDTO } from "@/crud/DTOs";
import React, { useEffect, useState } from "react";

function AddTags({
  defaultTags,
  onTagsChange,
}: {
  defaultTags?: CreateTagDTO[];
  onTagsChange: (tags: CreateTagDTO[]) => void;
}) {
  const [tags, setTags] = useState<CreateTagDTO[]>(defaultTags || []);
  const [newTagName, setNewTagName] = useState("");

  const handleRemoveTag = (tagToRemove: CreateTagDTO) => {
    let newTags = tags.filter((tag) => tag.name !== tagToRemove.name);

    setTags(newTags);
    onTagsChange(newTags);
  };

  const handleAddTag = () => {
    if (newTagName) {
      let addedTags = newTagName
        .trim()
        .split(",")
        .filter((tag) => tag.trim() !== "");
      let newTags = [...tags, ...addedTags.map((tag) => ({ name: tag }))];

      setTags(newTags);
      setNewTagName("");
      onTagsChange(newTags);
    }
  };

  useEffect(() => {
    if (defaultTags && defaultTags.length > 0) {
      setTags(defaultTags);
    }
  }, [defaultTags]);

  return (
    <>
      <h2 className="mb-2 text-lg font-semibold">Add Tags</h2>
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <div
              key={tag.name}
              className="flex items-center rounded bg-blue-200 p-2 text-blue-800"
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
          className="w-full rounded border p-2"
          placeholder="Tag Name"
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
        />
        <button
          type="button"
          className="mt-2 rounded bg-blue-500 p-2 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          onClick={handleAddTag}
        >
          Add Tag
        </button>
      </div>
    </>
  );
}

export default AddTags;
