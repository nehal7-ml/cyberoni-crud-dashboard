import React from "react"
import TableHead from "./TableHead"

function Table({ headers, children }: { headers: string[], children:JSX.Element[] }) {
    return (
        <><div className="flex flex-col Table bg-slate-50 font-medium">
            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="overflow-hidden">
                        <table className="min-w-full">
                            <TableHead headers={headers}></TableHead>
                            <tbody>
                                {children}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div></>
    )
}

export default Table