import { CaseStudy } from "@prisma/client";
import { TableItem } from "../Table/TableItem";
import { seoUrl, stripSlashes } from "@/lib/utils";
import Table from "../Table";
import { CreateCaseStudyDTO } from "@/crud/DTOs";
import { string } from "zod";

function CaseStudyTable({
  records,
  page,
}: {
  records:( CreateCaseStudyDTO & { id: string })[];
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
          row.push(value.goals.goals as string );
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
