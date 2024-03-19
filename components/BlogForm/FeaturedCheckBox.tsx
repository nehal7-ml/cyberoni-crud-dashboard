"use client";

import { CreateBlogDTO } from "@/crud/DTOs";
import Notification, { toast } from "../Notification";
import { useState } from "react";
import Loading from "../Loading";

function FeaturedCheckbox({
  initial,
  action,
}: {
  initial: CreateBlogDTO;
  action: string;
}) {
  const [blogData, setBlogData] = useState<CreateBlogDTO>(
    initial || {
      title: "",
      subTitle: "",
      description: "",
      featured: false,
      date: new Date(),
      publishDate: new Date(),
      content: "",
      author: { email: "" },
      tags: [],
      images: [],
    },
  );

  const [loading, setLoading] = useState(false);

  async function updateFeatured(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, checked } = e.target;
    setBlogData((prevData) => ({
      ...prevData,
      featured: e.target.checked,
    }));
    setLoading(true);
    const res = await fetch(`${action}`, {
      method: "PUT",
      body: JSON.stringify({
        ...blogData,
        featured: e.target.checked,
      }),
    });
    let resJson = await res.json();
    setLoading(false);
    if (res.status == 200) {
      toast(`${resJson.message}`, {
        autoClose: 5000,
        type: "success",
      });
    } else {
      toast(`${resJson.message}`, {
        autoClose: 5000,
        type: "error",
      });
    }
  }

  return (
    <div className="p-3" onClick={(e) => e.stopPropagation()}>
      <input
        className="cursor-pointer text-green-500 outline-green-400 ring-green-500"
        type="checkbox"
        checked={blogData.featured}
        onChange={updateFeatured}
      />
      {loading ? <Loading /> : null}
      <Notification />
    </div>
  );
}

export default FeaturedCheckbox;
