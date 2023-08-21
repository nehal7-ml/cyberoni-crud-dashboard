import React, { DetailedHTMLProps } from "react"


interface TableItemProps extends DetailedHTMLProps<React.HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement> {
  row: (any)[],
  index: number,
  key: string| number
}
export function TableItem(props: TableItemProps) {

  return (

    <tr onClick={props.onClick} className="border-b-2 hover:border-x-blue-800 hover:cursor-pointer hover:shadow-lg">
      {props.row.map((item: any, index: number) => {
        return <td key={index} className="text-sm text-center text-gray-900 font-light px-6 py-4 whitespace-nowrap">
          {item}
        </td>
      })}

    </tr>
  )
}