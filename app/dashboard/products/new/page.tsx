import ProductForm from "@/components/ProductForm";

function CreateProductForm() {
  return (<>
  
  <ProductForm method='POST' action='/api/products/add'/>
  </>  );
}

export default CreateProductForm;