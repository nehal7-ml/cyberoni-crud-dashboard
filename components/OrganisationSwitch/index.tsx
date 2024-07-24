'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

interface OrganizationSwitchProps {
    orgs: { name: string, id: string }[]
}
function OrganizationSwitch({ orgs }: OrganizationSwitchProps) {

    const [selected, setSelected] = useState(0);

    const { data: session, status, update } = useSession()
    async function changeSelectedOrg(index: number) {
        await update({ ...session?.user, orgId: orgs[index].id })
        setSelected(index)
    }
    return (

        <DropdownMenu>
            <DropdownMenuTrigger className="flex gap-4 hover:border-1 rounded-md p-2 cursor-pointer">{orgs[selected].name} <ChevronDown /></DropdownMenuTrigger>
            <DropdownMenuContent >
                <DropdownMenuRadioGroup value={selected.toString()} onValueChange={(value) => changeSelectedOrg(Number(value))}>
                    {orgs.map((org, index) => (
                        <DropdownMenuRadioItem
                            key={index}
                            value={index.toString()}
                        >
                            {org.name}
                        </DropdownMenuRadioItem >
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>);
}

export default OrganizationSwitch;