import { stripSlashes, seoUrl } from "@/lib/utils";
import { Service } from "@prisma/client";
import Table from "../Table";
import { TableItem } from "../Table/TableItem";

function ServiceTableItems({ records, page }: { records: Service[] , page:number}) {
  return (
    <>
      {" "}
      <Table
        view={true}
        page={page}
        type="services"
        headers={[
          { title: "Service Name", sort: true, sortKey: "title" },
          { title: "Rate", sort: false },
          { title: "Value Bought", sort: false },
          { title: "Skills Used", sort: false }
        ]}
        rows= {((records as Service[]) || []).map((value, index) => {
          const row: any = [];
          row.push(value.title);
          row.push(value.hourlyRate);
          row.push(value.valueBrought);
          row.push(value.skillsUsed);

          return (
            {
              index:value.id,
              row:row,
              viewLink:`${stripSlashes(process.env.NEXT_PUBLIC_APP_URL!)}/services/${seoUrl(value.title, value.id)}`
            }
          );
        })}
      >
       
      </Table>
    </>
  );
}

export default ServiceTableItems;
