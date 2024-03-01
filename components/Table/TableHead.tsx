import React from "react";

function TableHead({ headers }: { headers: string[] }) {
  return (
    <>
      <thead className="bg-blue-100">
        <tr>
          <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">
            Delete Row
          </th>
          {headers.map((item: string, index: number) => {
            return (
              <th
                key={index}
                scope="col"
                className="px-6 py-4 text-center text-sm font-medium text-gray-900"
              >
                {item}
              </th>
            );
          })}
        </tr>
      </thead>
    </>
  );
}

export default TableHead;
