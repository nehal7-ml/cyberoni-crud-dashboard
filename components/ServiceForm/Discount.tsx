"use client";

import { Discount } from "@/crud/DTOs";
import { useEffect, useState } from "react";
import { z } from 'zod';
import  Notification, { toast } from '@/components/Notification'
const valueSchema = z.number().min(1).max(25);
const nameSchema = z.string().refine(name => /^[a-z0-9]+$/i.test(name), {
  message: 'Discount Name must be alphanumeric',
});
const discountSchema = z.object({
  name: nameSchema,
  value: valueSchema,
});

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
    value: 0,
  });



  const handleRemoveTag = (tagToRemove: Discount) => {
    let newTags = list.filter((tag) => tag !== tagToRemove);

    setList(newTags);
    onChange(newTags);
  };

  const handleAddTag = () => {
    const result = discountSchema.safeParse(newTagName);


    if (!result.success) {
      console.log(result.error.issues[0]);
      toast(`${result.error.issues[0].code}: ${result.error.issues[0].path[0]} - ${result.error.issues[0].message}`, {
        type: 'error',
      })
      return
    }
    let addedTags = { ...newTagName, name: newTagName.name.toUpperCase() };
    let newTags = [...list, addedTags];

    setList(newTags);
    setNewTagName({
      name: "",
      value: 0,
    });
    onChange(newTags);

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
              <span className="line-clamp-1">{tag.value}%</span>
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
          className="text-input"
          placeholder="Value of the discount"
          value={newTagName.value.toString()}
          title="Enter value between 1-25"
          pattern="^(0*[1-9]|1[0-9]|2[0-5])$"
          onChange={(e) =>
            setNewTagName((prev) => ({ ...prev, value: isNaN(Number(e.target.value)) ? 0 : Number(e.target.value) }))
          }
        />
        <button
          className="w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          type="button"
          onClick={handleAddTag}
        >
          Add Discount
        </button>
        <Notification />
      </div>
    </>
  );
}

export default DiscountsForm;
