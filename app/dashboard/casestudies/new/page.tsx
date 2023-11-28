import CaseStudyForm from "@/components/CaseStudyForm";
import { getAll } from "@/crud/service";
import { prisma } from "@/prisma/prismaClient";
import { Service } from "@prisma/client";

async function CreateBlogForm() {
    const service = await getAll(0, 0, prisma);
    return (
        <CaseStudyForm types={service.records} method="POST" action={`/api/casestudies/add`} />
    )

};

export default CreateBlogForm;
