import { DisplayUserDTO } from "@/crud/user";
import { TableItem } from "../Table/TableItem";
import Table from "../Table";

function UserTableItems({ records, page }: { records: DisplayUserDTO[], page:number }) {
  return (
    <>
      <Table
        page={page}
        type="users"
        view={false}
        headers={[
          { title: "First Name", sort: false },
          { title: "Last Name", sort: false },
          { title: "Email", sort: true, sortKey: "email" },
          { title: "Email Verified", sort: false },
          { title: "Role", sort: false }
        ]}
        rows={(records as DisplayUserDTO[]).map((value, index) => {
          const row: any = [];
          row.push(value.firstName);
          row.push(value.lastName);
          row.push(value.email);
          row.push(value.emailVerified ? "true" : "false");
          row.push(value.role);

          return {
            viewLink: "/",
            key: value.id,
            index: value.id,
            row: row,
          }
            ;
        })}
      >

      </Table>
    </>
  );
}

export default UserTableItems;
