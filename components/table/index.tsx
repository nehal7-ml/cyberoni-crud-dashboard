import React from "react"
import TableHead from "./TableHead"

function Table({ headers, children }: { headers: string[], children:JSX.Element[] | undefined }) {
    return (
        <><div className="flex overflow-x-auto w-full flex-col Table bg-slate-50 font-medium">
            <div className="w-full">
                <div className="inline-block min-w-full">
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