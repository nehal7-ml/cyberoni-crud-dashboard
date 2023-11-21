import CaseStudyForm from "@/components/CaseStudyForm";

async function CreateBlogForm() {

    return (
        <CaseStudyForm  method="POST" action={`/api/blogs/add`} />
    )

};

export default CreateBlogForm;
