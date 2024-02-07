import CaseStudyForm from "@/components/CaseStudyForm";
import { read } from "@/crud/casestudy";
import { CreateCaseStudy } from "@/crud/DTOs";
import { getAll } from "@/crud/service";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

async function UpdateCaseForm({ params }: { params: { id: string } }) {
    const caseStudy = await read(params.id, prisma) as CreateCaseStudy
    const service = await getAll(0, 0, prisma);

    if (caseStudy) return (
        <CaseStudyForm types={service.records} initial={caseStudy} method="PUT" action={`/api/casestudies/${params.id}`} />
    )
    else redirect('/404')

};

export default UpdateCaseForm;
