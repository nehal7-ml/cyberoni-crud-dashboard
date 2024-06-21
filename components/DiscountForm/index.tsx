"use client";

import { CreateDiscountDTO, Discount } from "@/crud/DTOs";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { z } from "zod";
import Notification, { useNotify } from "@/components/Notification";
import { FormProps } from "@/crud/commonDTO";
import DateInput from "../DateInput";
import { useRouter } from "next/navigation";
import LoadingDots from "../shared/loading-dots";
import JsonInput from "../shared/JsonInput";
import { DiscountSchema } from "../zodSchemas";
import example from "./example.json";

function DiscountsForm({ initial, method, action }: FormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useNotify();

  const [discountData, setDiscountData] = useState<CreateDiscountDTO>(
    (initial as CreateDiscountDTO) || {
      name: "",
      value: 0,
      expires: null,
    },
  );
  const defaultJson = useMemo(() => {
    if (method === "POST") {
      return JSON.stringify(discountData, null, 2);
    } else return JSON.stringify(DiscountSchema.parse(discountData), null, 2);
  }, [discountData, method]);

  
  const [rawJson, setRawJson] = useState(defaultJson);

  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    let discount = DiscountSchema.safeParse(discountData);

    if (!discount.success) {
      console.log(discount.error.issues[0]);
      toast(
        `${discount.error.issues[0].code}: ${discount.error.issues[0].path[0]} - ${discount.error.issues[0].message}`,
        {
          type: "error",
        },
      );
      setLoading(false);

      return;
    }
    setLoading(true);

    const res = await fetch(`${action}`, {
      method,
      body: JSON.stringify(discountData),
    });
    let resJson = await res.json();

    if (res.status === 200) {
      toast(resJson.message, { type: "success" });
      router.push(`/dashboard/discounts/view/${resJson.data.id}`);
    } else toast(resJson.message, { type: "error" });

    setLoading(false);
  }

  function parseJSon(json: string) {
    let valid = DiscountSchema.safeParse(JSON.parse(json));

    if (valid.success) setDiscountData(valid.data);
    else {
      for (const e of valid.error.errors) {
        toast(`${e.path} ${e.message}`, { type: "error" });
      }
    }
  }

  return (
    <div className="light:bg-gray-100 light:text-black flex min-h-screen items-center justify-center dark:bg-gray-700 dark:text-gray-800">
      <div className="max-h-screen w-full max-w-4xl overflow-scroll rounded bg-white p-8 shadow-md">
        <h2 className="mb-4 text-2xl font-semibold">
          {method === "POST" ? "Create" : "Update"} Discount
        </h2>
        <form onSubmit={handleSubmit} className="">
          <JsonInput
            rawJson={rawJson}
            setRawJson={setRawJson}
            parseJson={parseJSon}
            example={JSON.stringify(example, null, 2)}
          />
          <div className="mb-4">
            <input
              type="text"
              className="mt-1 w-full rounded border p-2"
              placeholder="Name of the discount"
              value={discountData.name}
              onChange={(e) =>
                setDiscountData((prev) => ({
                  ...prev,
                  name: e.target.value.toUpperCase(),
                }))
              }
            />
            <input
              type="text"
              className="text-input"
              placeholder="Value of the discount"
              value={discountData.value.toString()}
              title="Enter value between 1-25"
              onChange={(e) =>
                setDiscountData((prev) => ({
                  ...prev,
                  value: isNaN(Number(e.target.value))
                    ? 0
                    : Number(e.target.value),
                }))
              }
            />
          </div>

          <div className="mb-4">
            <label htmlFor="expiry" className="flex gap-2">
              <input
                onChange={() => {
                  if (!discountData.expires)
                    setDiscountData((prev) => ({
                      ...prev,
                      expires: new Date(),
                    }));
                  else setDiscountData((prev) => ({ ...prev, expires: null }));
                }}
                checked={discountData.expires ? true : false}
                id="expiry"
                type="checkbox"
              ></input>
              <p>Expires?</p>
            </label>
          </div>

          {discountData.expires && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Expires :
              </label>
              <DateInput
                name="expires"
                value={discountData.expires as Date}
                required={true}
                onDateChange={(referral) => {
                  setDiscountData((prev) => ({
                    ...prev,
                    expires: new Date(referral.target.value),
                  }));
                }}
              />
            </div>
          )}
          <button
            disabled={loading}
            type="submit"
            className="flex w-full items-center justify-center rounded bg-blue-500 p-2 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            {loading ? <LoadingDots /> : null}
            {method === "POST" ? "Create" : "Update"} Discount Code
          </button>
        </form>
      </div>
    </div>
  );
}

export default DiscountsForm;
