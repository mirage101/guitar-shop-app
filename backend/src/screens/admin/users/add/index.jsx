import { createUser } from "@/app/actions/userActions";
import ErrorMessageBox from "@/components/ErrorMessageBox";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
const AddUser = ({ searchParams }) => {
  const { errorMessage } = searchParams;
  return (
    <>
      <h1 className="text-3xl font-bold">Add User</h1>
      <form action={createUser} className="grid gap-6 mt-8 grid-cols-2">
        {errorMessage && <ErrorMessageBox errorMessage={errorMessage} />}
        <div className="grid gap-2">
          <Label htmlFor="userName" required>
            Username
          </Label>
          <Input
            type="text"
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
          <Label htmlFor="password" required>
            Password
          </Label>
          <Input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirmPassword" required>
            Confirm Password
          </Label>
          <Input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm your new password"
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

export default AddUser;
