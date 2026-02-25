import { updateUser } from "@/app/actions/userActions";
import ErrorMessageBox from "@/components/ErrorMessageBox";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";

const EditUser = ({ user, searchParams }) => {
  const { errorMessage } = searchParams;
  const handleUpdateUser = async (formData) => {
    "use server";
    await updateUser(formData, user.id);
  };
  return (
    <>
      <h1 className="text-3xl font-bold"> Edit Product</h1>
      <form action={handleUpdateUser} className="grid gap-6 mt-10 grid-cols-2">
        {errorMessage && <ErrorMessageBox errorMessage={errorMessage} />}
        <div className="grid gap-2">
          <Label htmlFor="userName" required>
            Username
          </Label>
          <Input
            type="text"
            defaultValue={user.userName}
            id="userName"
            name="userName"
            placeholder="Enter User Name"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="userType" required>
            User Type
          </Label>
          <select
            id="userType"
            defaultValue={user.userType}
            name="userType"
            className="custom-input bg-white cursor-pointer"
            required
          >
            <option value="">Select User Type</option>
            <option value="Super Admin">Super Admin</option>
            <option value="Admin">Admin</option>
            <option value="manager">Manager</option>
          </select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm your new password"
          />
        </div>
        <Button type="submit" className="w-48 col-span-2 mt-2">
          Submit
        </Button>
      </form>
    </>
  );
};

export default EditUser;
