import BlogForm from "@/components/BlogForm";
import { read } from "@/crud/blog";
import { CreateBlogDTO } from "@/crud/DTOs";
import { prisma } from "@/lib/prisma";

async function CreateBlogForm() {
  return <BlogForm method="POST" action={`/api/blogs/add`} />;
}

export default CreateBlogForm;
