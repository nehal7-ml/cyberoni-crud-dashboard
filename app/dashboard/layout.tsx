import SidePanel from "@/components/SidePanel"
import Pagination from "@/components/Pagination"
import CreateRecordButton from "@/components/CreateRecordButton"

export default function DashboardLayout({
    children, // will be a page or nested layout
  }: {
    children: React.ReactNode
  }) {
    return (
      <section className="grid grid-cols-12 gap-2 h-full w-full" >
        <SidePanel className="col-span-3 h-screen bg-blue-800"></SidePanel>
        <div className="col-span-9">
          <CreateRecordButton className="flex justify-end"></CreateRecordButton>
          {children}

        </div>
      </section>
    )
  }