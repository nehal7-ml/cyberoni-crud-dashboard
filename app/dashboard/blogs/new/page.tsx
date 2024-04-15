import BlogForm from "@/components/BlogForm";
import { getCategories, read } from "@/crud/blog";
import { CreateBlogDTO } from "@/crud/DTOs";
import { prisma } from "@/lib/prisma";

async function CreateBlogForm() {
  const categories = await getCategories(prisma);

  return <BlogForm method="POST" action={`/api/blogs/add`} categories={categories} />;
}

export default CreateBlogForm;
