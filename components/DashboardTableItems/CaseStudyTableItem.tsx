import { CaseStudy } from "@prisma/client";
import { TableItem } from "../Table/TableItem";
import { seoUrl, stripSlashes } from "@/lib/utils";
import Table from "../Table";

function CaseStudyTable({
  records,
  page,
}: {
  records: CaseStudy[];
  page: number;
}) {
  return (
    <>
      <Table
        page={page}
        type="casestudies"
        view={true}
        headers={[
          { title: "Title", sort: true, sortKey: "title" },
          { title: "Goals", sort: false },
          { title: "Preview", sort: false }
        ]}
        rows={records.map((value, index) => {
          const row: any = [];
          row.push(value.title);
          row.push((value.goals as string[]).join("/n"));
          row.push(value.preview);
          return {
            index: value.id,
            row: row,
            viewLink: `${stripSlashes(process.env.NEXT_PUBLIC_APP_URL!)}/casestudies/${seoUrl(value.title, value.id)}`,
          };
        })}
      ></Table>
    </>
  );
}

export default CaseStudyTable;
