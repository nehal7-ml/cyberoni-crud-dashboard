"use client";
import { Product } from "@prisma/client";
import React, { useEffect, useState } from "react";

function FetchedProduct({ sku }: { sku: string }) {
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      const res = await fetch(`/api/products/cjshipping/products/${sku}`);

      const product: Product = (await res.json()).data;
      setProduct(product);
    }
    if (sku) {
      fetchProduct();
    }
  }, [sku]);
  return (
    <div className="container mx-auto">
      <div>FetchedProduct</div>

      <div className="flex flex-col items-start justify-center">
        <div>Product name: {product?.name}</div>
        <div>Cj Price: {}</div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

export default FetchedProduct;
