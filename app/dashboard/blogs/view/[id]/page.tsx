import BlogForm from "@/components/BlogForm";
import { CreateBlogDTO, read } from "@/crud/blog";
import { prisma } from "@/prisma/prismaClient";

async function UpdateBlogForm({ params }: { params: { id: string } }) {
    const blog = await read(params.id, prisma) as CreateBlogDTO


    return (
        <BlogForm initial={blog} method="PUT" action={`/api/blogs/${params.id}`} />
    )

};

export default UpdateBlogForm;
