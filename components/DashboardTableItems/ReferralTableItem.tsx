import { Referral } from "@prisma/client";
import CopyButton from "../CopyButton";
import DuplicateItem from "../DuplicateItem";
import { TableItem } from "../Table/TableItem";
import Table from "../Table";
import { OrderTableBy } from "@/types/global";
import { stripSlashes } from "@/lib/utils";
const appUrl = process.env.NEXT_PUBLIC_APP_URL as string;
function ReferralTableItems({
  records,
  page,
}: {
  records: Referral[];
  page: number;
}) {
  return (
    <>
      <Table
        view={false}
        headers={[
          { title: "Link", sort: false },
          { title: "CampaignId", sort: false },
          { title: "Expires", sort: true, sortKey: "expires" as OrderTableBy },
          { title: "Clicks", sort: true, sortKey: "click" as OrderTableBy },
          { title: "Type", sort: false },
          { title: "Prefix/Username", sort: true, sortKey: "prefix" },
          { title: "Click to Duplicate", sort: false },
        ]}
        type="referrals"
        page={page}
        rows={(records as Referral[]).map((value, index) => {
          const row: any = [];
          row.push(
            <CopyButton
              showText={true}
              text={`${stripSlashes(appUrl)}${
                value.type === "REDIRECT" ? "/referrals" : "/affiliate"}/${
                value.prefix}?${
                new URLSearchParams((value.utmProps as Record<string, string>) ?? {})}`}
            />,
          );
          row.push(value.campaignId);
          row.push(
            value.expires ? new Date(value.expires).toLocaleDateString() : "NA",
          );
          row.push(value.click);
          row.push(value.type);
          row.push(value.prefix);
          row.push(<DuplicateItem type="referrals" itemId={value.id} />);

          return {
            key: value.id,
            index: value.id,
            row,
            viewLink: "/",
          };
        })}
      ></Table>
    </>
  );
}

export default ReferralTableItems;
