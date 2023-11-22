import CaseStudyForm from "@/components/CaseStudyForm";

async function CreateBlogForm() {

    return (
        <CaseStudyForm  method="POST" action={`/api/casestudies/add`} />
    )

};

export default CreateBlogForm;
