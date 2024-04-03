import BlogForm from "@/components/BlogForm";
import { getCategories, read } from "@/crud/blog";
import { CreateBlogDTO } from "@/crud/DTOs";
import { prisma } from "@/lib/prisma";

async function UpdateBlogForm({ params }: { params: { id: string } }) {
  const blog = (await read(params.id, prisma)) as CreateBlogDTO;
  const categories = await getCategories(prisma);

  return (
    <BlogForm initial={blog} method="PUT" action={`/api/blogs/${params.id}`} categories={categories} />
  );
}

export default UpdateBlogForm;
