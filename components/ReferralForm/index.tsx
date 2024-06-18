"use client";
import { CreateReferralDTO } from "@/crud/DTOs";
import { EventStatus, ReferralPriority, ReferralType } from "@prisma/client";
import React, { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Notification, {
  NotificationType,
  useNotify,
} from "@/components/Notification";
import { redirect, useRouter } from "next/navigation";
import { stripSlashes } from "@/lib/utils";
import DateInput from "../DateInput";
import LoadingDots from "../shared/loading-dots";
import JsonInput from "../shared/JsonInput";
import DynamicInput from "../DynamicInput";
import referralFormSchema from "./formSchema";
import example from './example.json'
import { ReferralSchema } from "../zodSchemas";
const appUrl = process.env.NEXT_PUBLIC_APP_URL as string;

const ReferralForm = ({
  method,
  action,
  initial,
}: {
  method: "POST" | "PUT";
  action: string;
  initial?: CreateReferralDTO;
}) => {
  const [loading, setLoading] = useState(false);


  const { toast } = useNotify();

  const [linkType, setLinkType] = useState<"External" | "Internal">(
    initial?.link.includes(appUrl) ? "Internal" : "External",
  );

  const utmPraram = useRef(
    new URLSearchParams(initial?.utmProps ? initial.utmProps : {}),
  );

  const [referralData, setReferralData] = useState<CreateReferralDTO>(
    initial
      ? {
        ...initial,
        link: initial?.link.includes(appUrl)
          ? `${initial.link.replace(appUrl, "")}`
          : initial.link,
        redirect: `${stripSlashes(appUrl)}${initial.type === "REDIRECT" ? "/referrals" : "/affiliate"}/${initial.prefix}?${utmPraram.current.toString()}`,
        utmProps: initial.utmProps
          ? {
            ...initial.utmProps,
          }
          : {
            utm_campaign: "",
            utm_medium: "",
            utm_source: "",
            utm_ad_type: "",
            utm_communication_theme: "",
            utm_earned_or_paid: "earned",
            utm_funnel_location: "",
            utm_product_category: "",
            utm_segment: "",
          },
      }
      : {
        campaignId: "",
        description: "",
        click: 0,
        expires: null,
        fallback: "",
        link: "",
        prefix: "",
        priority: ReferralPriority.LOW,
        type: ReferralType.REDIRECT,
        redirect: "",
        utmProps: {
          utm_campaign: "",
          utm_medium: "",
          utm_source: "",
        },
      },
  );

  const defaultJson = useMemo(() => {
    if(method ==='POST') return JSON.stringify(referralData, null, 2)
      
      else return JSON.stringify(ReferralSchema.parse(referralData), null, 2)
  },[method, referralData])

  const [rawJson, setRawJson] = useState(defaultJson);

  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = { ...referralData };

    console.log(payload);
    let valid = ReferralSchema.safeParse(referralData);
    if (!valid.success) {
      for (const e of valid.error.errors) {
        toast(`${e.path} ${e.message}`, { type: "error" });
      }
      setLoading(false);

      return
    }
    const res = await fetch(`${action}`, {
      method,
      body: JSON.stringify(payload),
    });
    let resJson = await res.json();
    setLoading(false);

    if (res.status === 200) {
      message("success", resJson.message);
      router.push(`/dashboard/referrals/view/${resJson.data.id}`);
    } else message("error", resJson.message);


  };

  function message(type: NotificationType, message: string) {
    toast(message, {
      type,
    });
  }

  function handleDataChange(data: CreateReferralDTO) {
    setReferralData((prev) => ({
      ...prev,
      ...data,
      redirect: `${stripSlashes(appUrl)}${data.type === "REDIRECT" ? "/referrals" : "/affiliate"}/${data.prefix}?${new URLSearchParams(data.utmProps).toString()}`,
    }));
  }


  function parseJson(json: string) {
    try {
      const newData = JSON.parse(json);

      const valid = ReferralSchema.safeParse(newData);
      if (!valid.success) {
        for (const e of valid.error.errors) {
          toast(`${e.path} ${e.message}`, {
            type: "error",
          });
        }
      } else {
        setReferralData((prev) => ({
          ...prev,
          ...valid.data,
          redirect: `${stripSlashes(appUrl)}${valid.data.type === "REDIRECT" ? "/referrals" : "/affiliate"}/${valid.data.prefix}?${new URLSearchParams(valid.data.utmProps).toString()}`,
        }));
      }
    } catch (error) {
      console.log("invalid JSON", error);
      alert("Error parsing JSON" + error);
    }
  }

  return (
    <div className="light:bg-gray-100 light:text-black flex min-h-screen items-center justify-center dark:bg-gray-700 dark:text-gray-800">
      <div className="max-h-screen w-full max-w-4xl overflow-scroll rounded bg-white p-8 shadow-md">
        <h2 className="mb-4 text-2xl font-semibold">
          {method === "POST" ? "Create" : "Update"} Referral {referralData.type}
        </h2>
        <form onSubmit={handleSubmit} className="">
          <JsonInput
            parseJson={parseJson}
            rawJson={rawJson}
            setRawJson={setRawJson}
            example={JSON.stringify(example, null, 2)}
          />
          <DynamicInput
            defaultValue={referralData}
            onChange={handleDataChange}
            schema={referralFormSchema}
          />
          <button
            disabled={loading}
            type="submit"
            className="flex w-full items-center justify-center rounded bg-blue-500 p-2 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            {loading ? <LoadingDots /> : null}
            {method === "POST" ? "Create" : "Update"} Referral
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReferralForm;
