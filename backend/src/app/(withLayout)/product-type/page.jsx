import { getProductTypes } from "@/app/actions/productTypeActions";
import ProductType from "@/screens/admin/product-type";

const ProductTypePage = async () => {
  const productTypes = await getProductTypes();
  return <ProductType productTypes={productTypes} />;
};

export default ProductTypePage;
