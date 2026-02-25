import { createProductType } from "@/app/actions/productTypeActions";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";

const AddProductType = ({ searchParams }) => {
  const { errorMessage } = searchParams;
  return (
    <>
      <h1 className="text-3xl font-bold"> Add Product Type </h1>
      <form className="grid gap-6 mt-10 grid-cols-2" action={createProductType}>
        {errorMessage && <ErrorMessageBox errorMessage={errorMessage} />}
        <div className="grid gap-2">
          <Label required>Product Type</Label>
          <Input
            type="text"
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

export default AddProductType;
