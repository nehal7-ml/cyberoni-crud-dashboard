"use client";
import { CreateReferralDTO } from "@/crud/DTOs";
import { EventStatus, ReferralPriority, ReferralType } from "@prisma/client";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import Notification, {
  NotificationType,
  useNotify,
} from "@/components/Notification";
import { redirect, useRouter } from "next/navigation";
import { stripSlashes } from "@/lib/utils";
import DateInput from "../DateInput";
import LoadingDots from "../shared/loading-dots";

const ReferralForm = ({
  method,
  action,
  initial,
}: {
  method: "POST" | "PUT";
  action: string;
  initial?: CreateReferralDTO;
}) => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL as string;

  const [loading, setLoading] = useState(false);
  const toast = useNotify();
  const [invalidLink, setInvalidLink] = useState(false);
  const [expiry, setExpiry] = useState(initial?.expires ? true : false);
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
  const [date, setDate] = useState(
    (initial?.expires || new Date()).toISOString().split("T")[0],
  );
  function handleUtmChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = e.target;

    setReferralData((prev) => ({
      ...prev,
      utmProps: {
        ...prev.utmProps,
        [name]: value,
      },
    }));

    utmPraram.current.set(name, value);
  }
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    if (name === "expires") {
      console.log(new Date(value));
      setReferralData((prevData) => ({
        ...prevData,
        expires: new Date(value),
      }));
    }
    if (name === "prefix") {
      setReferralData((prevData) => ({
        ...prevData,
        prefix: value,
        redirect: `${stripSlashes(appUrl)}${referralData.type === "REDIRECT" ? "/referrals" : "/affiliate"}/${value}?${utmPraram.current.toString()}`,
      }));
    } else {
      console.log(name, value);
      setReferralData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = { ...referralData };

    try {
      if (linkType === "Internal") {
        Object.assign(payload, {
          link: `${stripSlashes(appUrl)}${referralData.link}`,
        });
      }
    } catch (error) {
      return;
    }
    console.log(payload);
    const res = await fetch(`${action}`, {
      method,
      body: JSON.stringify(payload),
    });
    let resJson = await res.json();

    if (res.status === 200) {
      message("success", resJson.message);
      router.push(`/dashboard/referrals/view/${resJson.data.id}`);
    } else {
      if (linkType === "Internal") {
        referralData.link = `${referralData.link.replace(appUrl, "")}`;
      }

      message("error", resJson.message);

      if (res.status === 406) {
        setInvalidLink(true);
      }
    }

    setLoading(false);
  };

  function message(type: NotificationType, message: string) {
    toast(message, {
      type,
    });
  }

  function handleLinkChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value, name } = e.target;
    setInvalidLink(false);
    if (linkType === "External") {
      setReferralData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
    if (linkType === "Internal") {
      setReferralData((prevData) => ({
        ...prevData,
        [name]: `${value}`,
      }));
    }
  }

  return (
    <div className="light:bg-gray-100 light:text-black flex min-h-screen items-center justify-center dark:bg-gray-700 dark:text-gray-800">
      <div className="max-h-screen w-full max-w-4xl overflow-scroll rounded bg-white p-8 shadow-md">
        <h2 className="mb-4 text-2xl font-semibold">
          {method === "POST" ? "Create" : "Update"} Referral {referralData.type}
        </h2>
        <form onSubmit={handleSubmit} className="">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Refrral type:
            </label>
            <select
              name="type"
              className="mt-1 w-full rounded border p-2  invalid:text-rose-500 invalid:outline-red-500 invalid:ring-2 invalid:ring-rose-600"
              value={referralData.type}
              onChange={handleInputChange}
              required
            >
              {Object.values(ReferralType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            {
              <label className="block text-sm font-medium text-gray-700">
                {referralData.type === "REDIRECT" ? "prefix" : "username"} :
              </label>
            }
            <input
              type="text"
              name="prefix"
              className="mt-1 w-full rounded border p-2 invalid:text-rose-500 invalid:outline-red-500 invalid:ring-2 invalid:ring-rose-600"
              value={referralData.prefix as string}
              onChange={handleInputChange}
              pattern="^[^\x3B\s\/\?:@&=+\$,%\{\}\|\\\^~\[\]`<>\#]*$"
              title="only allowed alphanumeric - and _"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="expiry" className="flex gap-2">
              <input
                onChange={() => {
                  if (!expiry)
                    setReferralData((prev) => ({
                      ...prev,
                      expires: new Date(),
                    }));
                  else setReferralData((prev) => ({ ...prev, expires: null }));
                  setExpiry((prev) => !prev);
                }}
                id="expiry"
                type="checkbox"
                checked={expiry}
              ></input>
              <p>Expires?</p>
            </label>
          </div>

          {expiry && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Expires :
              </label>
              <DateInput
                name="expires"
                value={referralData.expires as Date}
                required={true}
                onDateChange={(referral) => {
                  setReferralData((prev) => ({
                    ...prev,
                    expires: new Date(referral.target.value),
                  }));
                }}
              />
            </div>
          )}

          <div className="my-4">
            <select
              name="linkType"
              className="mt-1 w-full rounded border p-2  invalid:text-rose-500 invalid:outline-red-500 invalid:ring-2 invalid:ring-rose-600"
              value={linkType}
              onChange={(e) =>
                setLinkType(e.target.value as "External" | "Internal")
              }
              required
            >
              <option value={"External"}>Link to external Website</option>
              <option value={"Internal"}>Internal</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Redirect Link:
            </label>
            <input
              disabled
              type="text"
              name="redirect"
              className="mt-1 w-full rounded border p-2 invalid:text-rose-500 invalid:outline-red-500 invalid:ring-2 invalid:ring-rose-600"
              value={referralData.redirect}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Page To Link:
            </label>
            <input
              type="text"
              name="link"
              className={`mt-1 w-full rounded border p-2 ${invalidLink ? "text-rose-500 outline-red-500 ring-rose-600" : ""} invalid:text-rose-500 invalid:outline-red-500 invalid:ring-2 invalid:ring-rose-600`}
              value={referralData.link}
              onChange={handleLinkChange}
              pattern={
                linkType == "External" ? '^(ftp|http|https)://[^ "]+$' : "^/.*$"
              }
              title="Enter valid url: https://...(external)) or /..(internal)"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              fallback Link:
            </label>
            <input
              type="text"
              name="fallback"
              className="mt-1 w-full rounded border p-2 invalid:text-rose-500 invalid:outline-red-500 invalid:ring-2 invalid:ring-rose-600"
              value={referralData.fallback}
              onChange={handleLinkChange}
              pattern={
                linkType == "External" ? '^(ftp|http|https)://[^ "]+$' : "^/.*$"
              }
              title="Enter valid url: https://...(external)) or /..(internal)"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Refrral type:
            </label>
            <select
              name="priority"
              className="mt-1 w-full rounded border p-2  invalid:text-rose-500 invalid:outline-red-500 invalid:ring-2 invalid:ring-rose-600"
              value={referralData.priority}
              onChange={handleInputChange}
              required
            >
              {Object.values(ReferralPriority).map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Description:
            </label>
            <textarea
              name="description"
              rows={4} // Adjust the number of rows as needed
              className="mt-1 w-full rounded border p-2 invalid:text-rose-500 invalid:outline-red-500 invalid:ring-2 invalid:ring-rose-600"
              value={referralData.description}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              campaignId :
            </label>
            <input
              name="campaignId"
              className="mt-1 w-full rounded border p-2 invalid:text-rose-500 invalid:outline-red-500 invalid:ring-2 invalid:ring-rose-600"
              value={referralData.campaignId}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="flex flex-col gap-2 pl-4">
            <div>UTM Properties :</div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Source :
              </label>
              <input
                name="utm_source"
                className="mt-1 w-full rounded border p-2 invalid:text-rose-500 invalid:outline-red-500 invalid:ring-2 invalid:ring-rose-600"
                value={
                  (referralData.utmProps as Record<string, string>).utm_source
                }
                onChange={handleUtmChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Segment :
              </label>
              <input
                name="utm_segment"
                className="mt-1 w-full rounded border p-2 invalid:text-rose-500 invalid:outline-red-500 invalid:ring-2 invalid:ring-rose-600"
                value={
                  (referralData.utmProps as Record<string, string>)
                    .utm_segment ?? ""
                }
                onChange={handleUtmChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Product Category :
              </label>
              <input
                name="utm_product_category"
                className="mt-1 w-full rounded border p-2 invalid:text-rose-500 invalid:outline-red-500 invalid:ring-2 invalid:ring-rose-600"
                value={
                  (referralData.utmProps as Record<string, string>)
                    .utm_product_category ?? ""
                }
                onChange={handleUtmChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Comunication Theme :
              </label>
              <input
                name="utm_communication_theme"
                className="mt-1 w-full rounded border p-2 invalid:text-rose-500 invalid:outline-red-500 invalid:ring-2 invalid:ring-rose-600"
                value={
                  (referralData.utmProps as Record<string, string>)
                    .utm_communication_theme ?? ""
                }
                onChange={handleUtmChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Funnel Location :
              </label>
              <input
                name="utm_funnel_location"
                className="mt-1 w-full rounded border p-2 invalid:text-rose-500 invalid:outline-red-500 invalid:ring-2 invalid:ring-rose-600"
                value={
                  (referralData.utmProps as Record<string, string>)
                    .utm_funnel_location
                }
                onChange={handleUtmChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Ad Type :
              </label>
              <input
                name="utm_ad_type"
                className="mt-1 w-full rounded border p-2 invalid:text-rose-500 invalid:outline-red-500 invalid:ring-2 invalid:ring-rose-600"
                value={
                  (referralData.utmProps as Record<string, string>).utm_ad_type
                }
                onChange={handleUtmChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Earned Or Paid :
              </label>
              <select
                name="utm_earned_or_paid"
                className="mt-1 w-full rounded border p-2 invalid:text-rose-500 invalid:outline-red-500 invalid:ring-2 invalid:ring-rose-600"
                value={
                  (referralData.utmProps as Record<string, string>)
                    .utm_earned_or_paid ?? "earned"
                }
                onChange={handleUtmChange}
              >
                <option value="earned">Earned</option>
                <option value="paid">Paid</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Medium :
              </label>
              <input
                name="utm_medium"
                className="mt-1 w-full rounded border p-2 invalid:text-rose-500 invalid:outline-red-500 invalid:ring-2 invalid:ring-rose-600"
                value={
                  (referralData.utmProps as Record<string, string>).utm_medium
                }
                onChange={handleUtmChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Campaign Name:{" "}
              </label>
              <input
                name="utm_campaign"
                className="mt-1 w-full rounded border p-2 invalid:text-rose-500 invalid:outline-red-500 invalid:ring-2 invalid:ring-rose-600"
                value={
                  (referralData.utmProps as Record<string, string>).utm_campaign
                }
                onChange={handleUtmChange}
              />
            </div>
          </div>
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
      <Notification />
    </div>
  );
};

export default ReferralForm;
