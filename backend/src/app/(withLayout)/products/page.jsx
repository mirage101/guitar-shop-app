import { getProducts } from "@/app/actions/productActions";
import Products from "@/screens/admin/products";

const ProductManagementPage = async () => {
  const products = await getProducts();
  return <Products products={products} />;
};

export default ProductManagementPage;
