"use client";
import { CreateTagDTO } from "@/crud/DTOs";
import React, { useEffect, useState } from "react";
import Notification, { toast } from "../Notification";
import * as z from "zod";

// Define a Zod schema for tag names
const TagNameSchema = z
  .string()
  .regex(/^[a-zA-Z0-9-_;:]+$/)
  .max(50);

function AddTags({
  defaultTags,
  onTagsChange,
  maxTags,
}: {
  defaultTags?: CreateTagDTO[];
  maxTags?: number;
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
        .filter((tag) => {
          let valid = tag.trim() !== "";
          if (!valid) {
            toast("Invalid tag name", { type: "error", autoClose: 3000 });
            return false;
          }
          try {
            // Validate the tag name using the Zod schema
            TagNameSchema.parse(tag.trim());
            return true;
          } catch (error) {
            toast("Invalid tag name", { type: "error", autoClose: 3000 });
            return false;
          }
        })
        .map((tag) => ({ name: tag.trim() }));
      let newTags = [...tags, ...addedTags];

      if (newTags.length > (maxTags || 10)) {
        setNewTagName("");

        toast(`Max ${maxTags || 10} allowed`, {
          type: "error",
          autoClose: 3000,
        });

        return;
      }
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
        <div className="flex gap-2">
          <button
            type="button"
            className="mt-2 rounded bg-blue-500 p-2 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
            onClick={handleAddTag}
          >
            Add Tag
          </button>
          <button
            type="button"
            className="mt-2 rounded bg-red-500 p-2 text-white hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300"
            onClick={() => (setTags([]), onTagsChange([]))}
          >
            Delete All Tags
          </button>
        </div>
        <Notification />
      </div>
    </>
  );
}

export default AddTags;
