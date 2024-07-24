import SidePanel from "@/components/SidePanel";
import Pagination from "@/components/Pagination";
import CreateRecordButton from "@/components/CreateRecordButton";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { Loader } from "lucide-react";
import Loading from "@/components/Loading";
import IndexingRequest from "@/components/IndexingRequest";
import { Metadata } from "next";
import OrganizationSwitch from "@/components/OrganisationSwitch";


export default function DashboardLayout({
  children, // will be a page or nested layout
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  return (
    <section id="#user-dashboard" className="grid h-full w-full grid-cols-12 gap-2">
      <SidePanel className="col-span-2 h-screen  max-h-screen"></SidePanel>
      <div className="col-span-10 h-screen">
        <div className="flex items-center justify-between py-3">
          <OrganizationSwitch orgs={[{ name: "test_org-1", id: "test_id_1" },
          { name: "test_org-2", id: "test_id_1" },
          { name: "test_org-3", id: "test_id_3" }
          ]} />
          <div className="col-span-2">
            <IndexingRequest />
          </div>
          <CreateRecordButton className="col-span-2 flex justify-end"></CreateRecordButton>
        </div>

        <div className="relative h-full pr-5">{children}</div>
      </div>
    </section>
  );
}
