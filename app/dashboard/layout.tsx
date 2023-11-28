import SidePanel from "@/components/SidePanel"
import Pagination from "@/components/Pagination"
import CreateRecordButton from "@/components/CreateRecordButton"
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { Loader } from "lucide-react";
import Loading from "@/components/Loading";

export default function DashboardLayout({
  children,  // will be a page or nested layout
  params
}: {
  children: React.ReactNode,
  params: any
}) {
  return (
    <section className="grid grid-cols-12 gap-2 h-full w-full" >
      <SidePanel className="col-span-3 h-screen bg-blue-800"></SidePanel>
      <div className="col-span-9 h-screen">
        <div className="flex justify-between">
          <h2 className="col-span-2"></h2>
          <CreateRecordButton className="col-span-2 flex justify-end"></CreateRecordButton>
        </div>

          <div className="col-span-4 row-span-5">
            {children}
          </div>
      </div>
    </section>
  )
}