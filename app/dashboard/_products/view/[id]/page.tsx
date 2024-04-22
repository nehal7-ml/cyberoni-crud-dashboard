import ProductForm from "@/components/ProductForm";
import { CreateProductDTO, read } from "@/crud/product";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import React, { useEffect, useState } from "react";

const UpdateProduct = async ({ params }: { params: { id: string } }) => {
  const res = await read(params.id, prisma);
  if (!res) redirect("/404");
  const { reviews, ...product } = res;
  // console.log(event);
  return (
    <ProductForm
      method="PUT"
      initial={product as CreateProductDTO}
      action={`/api/products/${params.id}`}
    />
  );
};

export default UpdateProduct;
