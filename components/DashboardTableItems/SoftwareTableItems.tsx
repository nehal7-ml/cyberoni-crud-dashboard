import { seoUrl, stripSlashes } from "@/lib/utils";
import Table from "../Table";
import { DisplaySoftwareProductDTO } from "@/crud/DTOs";

function SoftwareTableItems({
    records,
    page,
  }: {
    records: DisplaySoftwareProductDTO[];
    page: number;
  }) {
    return (
      <>
        <Table
          view={true}
          headers={[
            { title: "Title", sort: true, sortKey: "title" },
            { title: "Status", sort: true , sortKey: "status"},
            { title: "Pricing", sort: true, sortKey: "pricing" },
            { title: "Link", sort: false },
          ]}
          page={page}
          type="softwares"
          rows={records.map((value, index) => {
            const row: any = [];
            row.push(value.title);
            row.push(value.status);
            row.push(value.pricing);
            row.push("default");
            return {
              index: value.id,
              row: row,
  
              viewLink: `${stripSlashes(process.env.NEXT_PUBLIC_APP_URL!)}/softwares/${seoUrl(value.title, value.id)}`,
            };
          })}
        ></Table>
      </>
    );
  }
export default SoftwareTableItems;