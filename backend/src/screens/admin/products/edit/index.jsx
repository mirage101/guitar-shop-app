import { updateProduct } from "@/app/actions/productActions";
import ErrorMessageBox from "@/components/ErrorMessageBox";
import Button from "@/components/ui/Button";
import CustomFileInput from "@/components/ui/CustomFileInput";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import Switch from "@/components/ui/Switch";

const EditProduct = ({ productTypes, product, searchParams }) => {
  const { errorMessage } = searchParams;
  const handleUpdateProduct = async (formData) => {
    "use server";
    await updateProduct(formData, product.id, product.image);
  };
  return (
    <>
      <h1 className="text-3xl font-bold"> Add Product</h1>
      <form
        className="grid gap-6 mt-10 grid-cols-2"
        encType="multipart/form-data"
        method="POST"
        action={handleUpdateProduct}
      >
        {errorMessage && <ErrorMessageBox errorMessage={errorMessage} />}
        <div className="grid gap-2">
          <Label required>Product Name</Label>
          <Input
            defaultValue={product.name}
            type="text"
            name="name"
            placeholder="Enter Product Name"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label required>MRP</Label>
          <Input
            defaultValue={product.mrp}
            type="number"
            name="mrp"
            placeholder="Enter Product MRP"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label required>Selling Price</Label>
          <Input
            defaultValue={product.sellPrice}
            type="number"
            name="sellPrice"
            placeholder="Enter Selling Price"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label required>Image</Label>
          <CustomFileInput name="image" defaultValue={product.image} />
        </div>
        <div className="grid gap-2">
          <Label required>Product Type</Label>
          <select
            placeholder="Select Product Type"
            defaultValue={product.productTypeId}
            name="productType"
            required
            className="custom-input bg-white cursor-pointer"
          >
            <option value="">Select Product Type</option>

            {productTypes?.map((productType) => (
              <option value={productType.id} key={productType.id}>
                {productType.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-2">
          <Label required>Stock in Small Size</Label>
          <Input
            type="number"
            defaultValue={product.smallSize}
            name="smallSize"
            placeholder="Enter Current Stock"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label required>Stock in Medium Size</Label>
          <Input
            type="number"
            defaultValue={product.mediumSize}
            name="mediumSize"
            placeholder="Enter Current Stock"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label required>Stock in Large Size</Label>
          <Input
            type="number"
            defaultValue={product.largeSize}
            name="largeSize"
            placeholder="Enter Current Stock"
            required
          />
        </div>
        <div className="grid gap-2 max-h-[88px]">
          <Label required>Product Status</Label>
          <Switch
            name="isActive"
            defaultValue={product.isActive ? "on" : null}
          />
        </div>

        <div className="grid col-span-2 gap-2">
          <Label required>Description</Label>
          <textarea
            className="custom-input h-auto"
            name="description"
            defaultValue={product.description}
            rows={5}
            placeholder="Enter Product Description"
            required
          />
        </div>
        <Button type="submit" className="w-48 col-span-2">
          Submit
        </Button>
      </form>
    </>
  );
};

export default EditProduct;
