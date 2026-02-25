import { getProductById } from "@/app/actions/productActions";
import { getProductTypes } from "@/app/actions/productTypeActions";
import EditProduct from "@/screens/admin/products/edit";

const EditProductType = async ({ params, searchParams }) => {
  const product = await getProductById(params.productId);
  const productTypes = await getProductTypes();

  return (
    <EditProduct
      product={product}
      productTypes={productTypes}
      searchParams={searchParams}
    />
  );
};

export default EditProductType;
