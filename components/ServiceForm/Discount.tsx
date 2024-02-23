"use client";

import { Discount } from "@/crud/DTOs";
import { useEffect, useState } from "react";

function DiscountsForm({
  initial,
  onChange,
}: {
  initial?: Discount[];
  onChange: (values: Discount[]) => void;
}) {
  const [list, setList] = useState<Discount[]>(initial || []);
  const [newTagName, setNewTagName] = useState<Discount>({
    name: "",
    value: "",
  });

  const handleRemoveTag = (tagToRemove: Discount) => {
    let newTags = list.filter((tag) => tag !== tagToRemove);

    setList(newTags);
    onChange(newTags);
  };

  const handleAddTag = () => {
    if (newTagName.name.trim() && newTagName.value.trim()) {
      let addedTags = newTagName;
      let newTags = [...list, addedTags];

      setList(newTags);
      setNewTagName({
        name: "",
        value: "",
      });
      onChange(newTags);
    }
  };

  useEffect(() => {
    if (initial && initial.length > 0) {
      setList(initial);
    }
  }, [initial]);

  return (
    <>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          discounts :
        </label>
        <div className="my-1 flex flex-col gap-2">
          {list.map((tag) => (
            <div
              key={tag.name}
              className="flex items-center justify-around rounded bg-blue-200 p-2 text-blue-800"
            >
              <span className="line-clamp-1">{tag.name}</span>
              <span className="line-clamp-1">{tag.value}</span>
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
          className="mt-1 w-full rounded border p-2"
          placeholder="Name of the discount"
          value={newTagName.name}
          onChange={(e) =>
            setNewTagName((prev) => ({ ...prev, name: e.target.value }))
          }
        />
        <input
          type="text"
          className="mt-1 w-full rounded border p-2"
          placeholder="Value of the discount"
          value={newTagName.value}
          onChange={(e) =>
            setNewTagName((prev) => ({ ...prev, value: e.target.value }))
          }
        />
        <button
          className="w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          type="button"
          onClick={handleAddTag}
        >
          Add Discount
        </button>
      </div>
    </>
  );
}

export default DiscountsForm;
