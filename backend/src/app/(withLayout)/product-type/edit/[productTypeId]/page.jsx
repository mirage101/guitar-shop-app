import { getProductTypeById } from "@/app/actions/productTypeActions";
import EditProductType from "@/screens/admin/product-type/edit";

const EditProductTypePage = async ({ params, searchParams }) => {
  const productType = await getProductTypeById(params.productTypeId);
  return (
    <EditProductType productType={productType} searchParams={searchParams} />
  );
};

export default EditProductTypePage;
