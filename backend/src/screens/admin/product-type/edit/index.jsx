import { updateProductType } from "@/app/actions/productTypeActions";
import ErrorMessageBox from "@/components/ErrorMessageBox";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";

const EditProductType = ({ productType, searchParams }) => {
  const { errorMessage } = searchParams;
  const handleUpdateProductType = async (formData) => {
    "use server";
    await updateProductType(formData, productType.id);
  };
  return (
    <>
      <h1 className="text-3xl font-bold"> Edit Product Type </h1>
      <form
        className="grid gap-6 mt-10 grid-cols-2"
        action={handleUpdateProductType}
      >
        {errorMessage && <ErrorMessageBox errorMessage={errorMessage} />}
        <div className="grid gap-2">
          <Label required>Product Type</Label>
          <Input
            type="text"
            defaultValue={productType.name}
            id="name"
            name="name"
            placeholder="Enter Product Type"
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

export default EditProductType;
