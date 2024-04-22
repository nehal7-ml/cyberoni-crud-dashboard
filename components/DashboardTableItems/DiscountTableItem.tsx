import { Discount } from "@prisma/client";
import CopyButton from "../CopyButton";
import { TableItem } from "../Table/TableItem";
import Table from "../Table";

function DiscountTableItems({ records, page }: { records: Discount[], page: number }) {
  return (
    <>
      <Table
        view={false}
        page={page}
        type="discounts"
        headers={[
          { title: "Discount Code", sort: false },
          { title: "Value", sort: true, sortKey: "value" },
          { title: "Expires", sort: true, sortKey: "expires" }
        ]}
        rows={records.map((value, index) => {
          const row: any = [];
          row.push(<CopyButton showText={true} text={value.name} />);
          row.push(value.value + "%");
          row.push(
            value.expires ? new Date(value.expires).toLocaleDateString() : "NA",
          );

          return {
            index: value.id,
            row: row,
            viewLink: "/",
          };
        })}
      ></Table>
    </>
  );
}

export default DiscountTableItems;
