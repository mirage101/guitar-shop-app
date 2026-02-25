import { loginUser } from "@/app/actions/authActions";
import ErrorMessageBox from "@/components/ErrorMessageBox";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";

const Login = ({ searchParams }) => {
  const { errorMessage } = searchParams;
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-xl rounded-xl shadow-lg p-10 border border-gray-100 bg-white">
        <h1 className="text-4xl font-medium text-center mb-7"> Admin Login </h1>
        {errorMessage && (
          <ErrorMessageBox
            errorMessage={errorMessage}
            className="w-full text-center my-3"
          />
        )}
        <form className="grid gap-6" action={loginUser}>
          <div className="grid gap-2">
            <Label required>UserName</Label>
            <Input type="text" placeholder="Enter User Name" name="userName" />
          </div>
          <div className="grid gap-2">
            <Label required>Password</Label>
            <Input
              type="password"
              placeholder="Enter your password"
              name="password"
            />
          </div>
          <Button type="submit">Submit</Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
