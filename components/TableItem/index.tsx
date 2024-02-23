import { Delete } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { DetailedHTMLProps, ReactNode } from "react";
import DeleteButton from "./DeleteButton";

interface TableItemProps
  extends DetailedHTMLProps<
    React.HTMLAttributes<HTMLTableRowElement>,
    HTMLTableRowElement
  > {
  row: (string | ReactNode)[];
  index: string;
  key: string | number;
  type: string;
}
export function TableItem(props: TableItemProps) {
  return (
    <tr
      onClick={props.onClick}
      className="border-b-2 hover:cursor-pointer hover:border-x-blue-800 hover:shadow-lg"
    >
      <td>
        <DeleteButton url={`/api/${props.type}/${props.index}`}></DeleteButton>
      </td>

      <td className="whitespace-nowrap px-6 py-4 text-center text-sm font-light text-blue-600 underline">
        <Link href={`/dashboard/${props.type}/view/${props.index}`}>
          {" "}
          {`${props.type}/view/${props.index}`}
        </Link>
      </td>
      {props.row.map((item, index: number) => {
        return (
          <td
            key={index}
            className="whitespace-nowrap px-6 py-4 text-center text-sm font-light text-gray-900"
          >
            {item}
          </td>
        );
      })}
    </tr>
  );
}
