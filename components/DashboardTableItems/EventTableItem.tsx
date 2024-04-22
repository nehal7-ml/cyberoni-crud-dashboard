import { Event } from "@prisma/client";
import { TableItem } from "../Table/TableItem";
import Table from "../Table";

function EventTableItems({ records, page }: { records: Event[], page: number }) {
    return (
        <>
            <Table
                view={true}
                page={page}
                type="events"
                headers={[
                    { title: "Name", sort: false },
                    { title: "Date", sort: true, sortKey: "date" },
                    { title: "Location", sort: false },
                    { title: "Link", sort: false },
                    { title: "Status", sort: false }
                ]}
                rows={(records as Event[]).map((value, index) => {
                    const row: any = [];
                    row.push(value.name);
                    row.push(new Date(value.date).toLocaleDateString());
                    row.push(value.location);
                    row.push(value.eventLink);
                    row.push(value.status);

                    return (
                        {
                            index: value.id,
                            row: row,
                            viewLink: value.eventLink
                        }
                    );
                })}            >

            </Table>
        </>
    );
}

export default EventTableItems;
