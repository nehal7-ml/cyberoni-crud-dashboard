import { FormSchema } from "../DynamicInput";

const blogFormSchema: FormSchema = {
    type: "object",
    title: "BlogForm",
    description: "Schema for the blog form",
    required: true,
    properties: {
      title: { type: "string", title: "Title", required: true },
      author: {
        type: "object",
        title: "Author",
        description: "Author details",
        required: true,
        properties: {
          email: { type: "string", title: "Email", required: true },
        },
        toString: (object) => object.email,
      },
      publishDate: { type: "date", title: "Publish Date", required: true },
      subTitle: { type: "string", title: "SubTitle", required: true },
      description: { type: "text", title: "Description", required: true },
      featured: { type: "boolean", title: "Featured", required: true },
      content: { type: "rich-text", title: "Content", required: true },
      templateId: {
        type: "select",
        title: "Template",
        required: true,
        options: [{ label: "default", value: "" }],
      },
      images: {
        type: "image",
        title: "Images",
        required: false,
        max: 1
      },
      tags: {
        type: "tags",
        title: "Tags",
        description: "Tags for the blog",
        max: 10
      },
    },
    toString: (object) => object.title,
  };
  export default blogFormSchema