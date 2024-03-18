import SidePanel from "@/components/SidePanel";
import Pagination from "@/components/Pagination";
import CreateRecordButton from "@/components/CreateRecordButton";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { Loader } from "lucide-react";
import Loading from "@/components/Loading";

export default function DashboardLayout({
  children, // will be a page or nested layout
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  return (
    <section className="grid h-full w-full grid-cols-12 gap-2">
      <SidePanel className="col-span-2 h-screen  max-h-screen"></SidePanel>
      <div className="col-span-10 h-screen">
        <div className="flex justify-between">
          <h2 className="col-span-2"></h2>
          <CreateRecordButton className="col-span-2 flex justify-end"></CreateRecordButton>
        </div>

        <div className="relative h-full pr-5">{children}</div>
      </div>
    </section>
  );
}
