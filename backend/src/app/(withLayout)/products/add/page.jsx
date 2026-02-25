import { getProductTypes } from "@/app/actions/productTypeActions";
import AddProduct from "@/screens/admin/products/add";

const AddProductPage = async () => {
  const productTypes = await getProductTypes();
  return <AddProduct productTypes={productTypes} />;
};

export default AddProductPage;
