import { GptPrompt } from "@prisma/client";
import Table from "../Table";
import { TableItem } from "../Table/TableItem";

function PromptTableItems({ records, page }: { records: GptPrompt[], page: number }) {
    return (<>
        <Table
            view={false}
            page={page}
            type="prompts"
            headers={[
                { title: "Title", sort: true, sortKey: "title" },
                { title: "Description", sort: false },
                { title: "Profit Margin", sort: true, sortKey: "profitMargin" },
                { title: "Times Used", sort: true, sortKey: "timesUsed" },
                { title: "Times Integrated", sort: false }
              ]}
            rows={records.map((value, index) => {
                const row: any = [];
                row.push(value.title);
                row.push(value.description);
                row.push(value.profitMargin);
                row.push(value.timesUsed);
                row.push(value.timesIntegrated);

                return (
                    {

                        index: value.id,
                        row: row,
                        viewLink: "/"
                    }
                );
            })}
        >

        </Table>


    </>);
}

export default PromptTableItems;