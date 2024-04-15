"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { DetailedHTMLProps, MouseEvent, ReactNode } from "react";
import DeleteButton from "./DeleteButton";
import CopyButton from "../CopyButton";

interface TableItemProps
  extends DetailedHTMLProps<
    React.HTMLAttributes<HTMLTableRowElement>,
    HTMLTableRowElement
  > {
  row: (string | ReactNode)[];
  viewLink: string;
  index: string;
  key: string | number;
  type: string;
}
export function TableItem(props: TableItemProps) {
  const router = useRouter();

  function onClick(e: MouseEvent<HTMLTableRowElement>) {
    e.preventDefault()
    router.push(`/dashboard/${props.type}/view/${props.index}`);
  }
  return (
    <tr
      onClick={onClick}
      className="border-b-2 hover:cursor-pointer hover:border-x-blue-800 hover:shadow-lg"
    >
      <td onClick={e=>e.stopPropagation()}>
        <DeleteButton url={`/api/${props.type}/${props.index}`}></DeleteButton>
      </td>

      {props.viewLink !== "/" ? (
        <td className="whitespace-nowrap px-6 py-4 text-center text-sm font-light text-blue-600 underline">
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center"
          >
            <Link
              className="w-40 overflow-clip text-ellipsis"
              href={props.viewLink}
            >
              {props.viewLink}
            </Link>
            <CopyButton showText={false} text={`${props.viewLink}`} />
          </div>
        </td>
      ) : null}
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
