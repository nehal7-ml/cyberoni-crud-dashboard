import SidePanel from "@/components/SidePanel"

export default function DashboardLayout({
    children, // will be a page or nested layout
  }: {
    children: React.ReactNode
  }) {
    return (
      <section className="flex h-full w-full" >
        <SidePanel className="w-1/4 h-screen bg-blue-800"></SidePanel>          
        {children}
      </section>
    )
  }