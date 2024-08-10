"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import {  useSession } from "next-auth/react";
import {  useState } from "react";

interface OrganizationSwitchProps {
    orgs: { name: string; id: string }[];
}
function OrganizationSwitch({ orgs }: OrganizationSwitchProps) {
    const [selected, setSelected] = useState(0);

    const { data: session,  update } = useSession();

    async function changeSelectedOrg(index: number) {
        await update({ ...session?.user, orgId: orgs[index].id });
        setSelected(index);
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="hover:border-1 flex cursor-pointer gap-4 rounded-md p-2">
                {orgs.length > 0 ? orgs[selected].name : "Default"} <ChevronDown />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuRadioGroup
                    value={selected.toString()}
                    onValueChange={(value) => changeSelectedOrg(Number(value))}
                >
                    {orgs.map((org, index) => (
                        <DropdownMenuRadioItem key={index} value={index.toString()}>
                            {org.name}
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default OrganizationSwitch;
