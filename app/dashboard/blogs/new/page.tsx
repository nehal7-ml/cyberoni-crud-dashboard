import BlogForm from "@/components/BlogForm";
import { CreateBlogDTO, read } from "@/crud/blog";
import { prisma } from "@/prisma/prismaClient";

async function CreateBlogForm() {

    return (
        <BlogForm  method="POST" action={`/api/blogs/add`} />
    )

};

export default CreateBlogForm;
