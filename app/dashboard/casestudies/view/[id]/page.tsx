import CaseStudyForm from "@/components/CaseStudyForm";
import { CreateCaseStudy, read } from "@/crud/casestudy";
import { prisma } from "@/prisma/prismaClient";
import { redirect } from "next/navigation";

async function UpdateCaseForm({ params }: { params: { id: string } }) {
    const caseStudy = await read(params.id, prisma) as CreateCaseStudy
    if (caseStudy) return (
        <CaseStudyForm initial={caseStudy} method="PUT" action={`/api/casestudies/${params.id}`} />
    )
    else redirect('/404')

};

export default UpdateCaseForm;
