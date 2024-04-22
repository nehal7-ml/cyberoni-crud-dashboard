import { DisplayProductDTO } from "@/crud/DTOs";
import { TableItem } from "../Table/TableItem";
import Table from "../Table";

function ProductTableItems({ records, page }: { records: DisplayProductDTO[], page: number }) {
  return (
    <>
      <Table
        view={false}
        page={page}

        type="products"
        headers={[
          { title: "SKU", sort: false },
          { title: "Name", sort: true, sortKey: "name" },
          { title: "Inventory", sort: true , sortKey: "inventory"},
          { title: "Price", sort: true, sortKey: "price" },
          { title: "Profit Margin", sort: true, sortKey: "profitMargin" },
          { title: "Category", sort: false }
        ]}

        rows={records.map((value, index) => {
          const row: any = [];
          row.push(value.sku);
          row.push(value.name);
          row.push(value.inventory);
          row.push(value.price);
          row.push(value.profitMargin);
          row.push(value.category);

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
    </>
  );
}

export default ProductTableItems;
