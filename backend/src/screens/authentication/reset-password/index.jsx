"use client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

const schema = yup.object().shape({
  newPassword: yup
    .string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  confirmPassword: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("newPassword"), null], "Passwords must match"),
});
const ResetPassword = () => {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });
  const onSubmit = (data) => {
    console.log(data);
    router.push("/sign-in");
  };
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-xl rounded-xl shadow-lg sm:p-8 p-5 border border-gray-100 bg-white">
        <h1 className="text-4xl font-semibold text-center my-2">
          Reset Password
        </h1>
        <form className="grid gap-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <Label required>New Password</Label>
            <Controller
              name="newPassword"
              control={control}
              render={({ field }) => (
                <Input
                  type="password"
                  placeholder="Enter your new password"
                  {...field}
                />
              )}
            />
            {errors.newPassword && (
              <span className="text-red-500">{errors.newPassword.message}</span>
            )}
          </div>
          <div className="grid gap-2">
            <Label required>Confirm Password</Label>
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <Input
                  type="password"
                  placeholder="Confirm your new password"
                  {...field}
                />
              )}
            />
            {errors.confirmPassword && (
              <span className="text-red-500">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>
          <Button type="submit">Submit</Button>
          <span className="text-center">
            Back to&nbsp;
            <Link href={"/sign-in"} className="font-bold text-blue-800">
              Sign-in.
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
