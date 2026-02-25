import { cn } from "@/lib/utils";

const Input = ({ type = "text", className, ...props }) => {
  return (
    <input type={type} className={cn("custom-input", className)} {...props} />
  );
};

export default Input;
