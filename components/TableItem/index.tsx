import Link from "next/link"
import { useRouter } from "next/navigation"
import React, { DetailedHTMLProps } from "react"


interface TableItemProps extends DetailedHTMLProps<React.HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement> {
  row: (any)[],
  index: string,
  key: string| number,
  type: string
}
export function TableItem(props: TableItemProps) {

  // console.log(props)
  return (

    <tr onClick={props.onClick} className="border-b-2 hover:border-x-blue-800 hover:cursor-pointer hover:shadow-lg">
      <td className="text-sm text-center text-blue-600 underline font-light px-6 py-4 whitespace-nowrap">
        <Link href={`/dashboard/${props.type}/view/${props.index}`}> {`${props.type}/view/${props.index}`}</Link>
      </td>
      {props.row.map((item: any, index: number) => {
        return <td key={index} className="text-sm text-center text-gray-900 font-light px-6 py-4 whitespace-nowrap">
          {item}
        </td>
      })}

    </tr>
  )
}