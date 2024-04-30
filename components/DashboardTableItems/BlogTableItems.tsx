import { CreateBlogDTO, DisplayBlogDTO } from "@/crud/DTOs";
import FeaturedCheckbox from "../BlogForm/FeaturedCheckBox";
import { TableItem } from "../Table/TableItem";
import { seoUrl, stripSlashes } from "@/lib/utils";
import Table from "../Table";

function BlogTable({
  records,
  page,
}: {
  records: DisplayBlogDTO[];
  page: number;
}) {
  return (
    <>
      <Table
        view={true}
        headers={[
          { title: "Title", sort: true, sortKey: "title" },
          { title: "Featured", sort: false },
          { title: "Publish Date", sort: true, sortKey: "publishDate" },
          { title: "Author", sort: false },
          { title: "Template", sort: false },
        ]}
        page={page}
        type="blogs"
        rows={records.map((value, index) => {
          const row: any = [];
          row.push(value.title);
          row.push(
            <FeaturedCheckbox
              initial={value as CreateBlogDTO}
              action={`/api/blogs/${value.id}`}
            />,
          );
          row.push(value.publishDate.toLocaleDateString());
          row.push(
            value.author.firstName
              ? value.author.firstName
              : value.author.email,
          );
          row.push("default");
          return {
            index: value.id,
            row: row,

            viewLink: `${stripSlashes(process.env.NEXT_PUBLIC_APP_URL!)}/blogs/post${seoUrl(value.title, value.id)}`,
          };
        })}
      ></Table>
    </>
  );
}

export default BlogTable;
