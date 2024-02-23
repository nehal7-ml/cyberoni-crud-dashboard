import BlogForm from "@/components/BlogForm";
import { read } from "@/crud/blog";
import { CreateBlogDTO } from "@/crud/DTOs";
import { prisma } from "@/lib/prisma";

async function UpdateBlogForm({ params }: { params: { id: string } }) {
  const blog = (await read(params.id, prisma)) as CreateBlogDTO;

  // console.log(blog);
  return (
    <BlogForm initial={blog} method="PUT" action={`/api/blogs/${params.id}`} />
  );
}

export default UpdateBlogForm;
