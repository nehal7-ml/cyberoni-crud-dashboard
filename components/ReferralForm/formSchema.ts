import { ReferralPriority, ReferralType } from "@prisma/client";
import { FormSchema } from "../DynamicInput";

const referralFormSchema: FormSchema = {
    type: "object",
    title: "Referral Link Form",
    description: "Schema for creating a referral",
    required: true,
    properties: {
        prefix: { type: "string", title: "Prefix", required: true, pattern: "^.*$" },
        type: {
            type: "select",
            title: "Referral Type",
            required: true,
            options: Object.values(ReferralType).map(type => ({ label: type, value: type })),
        },
        campaignId: { type: "string", title: "Campaign ID", required: true },
        expires: { type: "date", title: "Expires", required: false },
        description: { type: "text", title: "Description", required: true },
        priority: {
            type: "select",
            title: "Priority",
            required: true,
            options: Object.values(ReferralPriority).map(priority => ({ label: priority, value: priority })),
        },
        redirect: { type: "string", title: "Redirect Link", required: true, disabled: true },
        link: { type: "string", title: "Forward to Link", required: true, pattern: '^(ftp|http|https)://\[^ "\]+$|^/.*$' },
        fallback: { type: "string", title: "Fallback Link", required: true, pattern: '^(ftp|http|https)://\[^ "\]+$|^/.*$' },
        utmProps: {
            type: "object",
            title: "UTM Properties",
            description: "UTM properties for tracking",
            required: false,
            properties: {
                utm_medium: { type: "string", title: "UTM Medium", required: false },
                utm_campaign: { type: "string", title: "UTM Campaign", required: false },
                utm_source: { type: "string", title: "UTM Source", required: false },
                utm_segment: { type: "string", title: "UTM Segment", required: false },
                utm_product_category: { type: "string", title: "UTM Product Category", required: false },
                utm_communication_theme: { type: "string", title: "UTM Communication Theme", required: false },
                utm_ad_type: { type: "string", title: "UTM Ad Type", required: false },
                utm_funnel_location: { type: "string", title: "UTM Funnel Location", required: false },
                utm_earned_or_paid: { type: "select", title: "UTM Earned or Paid", required: false, options: [{ label: "earned", value: "earned" }, { label: "paid", value: "paid" }] },
            },
            toString: object => object.utm_campaign || "",
        },
    },
};
export default referralFormSchema;