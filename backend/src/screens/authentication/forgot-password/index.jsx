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
  email: yup.string().email("Invalid email").required("Email is required"),
});

const ForgotPassword = () => {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
    },
  });
  const onSubmit = (data) => {
    console.log(data);
    router.push("/reset-password");
  };
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-xl rounded-xl shadow-lg sm:p-8 p-5 border border-gray-100 bg-white">
        <h1 className="text-4xl font-semibold text-center my-2">
          Forgot Password?
        </h1>
        <h1 className="text-xl font-medium text-center my-3 text-gray-400">
          No worries, we got your back.
        </h1>
        <form className="grid gap-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <Label required>Email</Label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input type="email" placeholder="Enter your email" {...field} />
              )}
            />
            {errors.email && (
              <span className="text-red-500">{errors.email.message}</span>
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

export default ForgotPassword;
