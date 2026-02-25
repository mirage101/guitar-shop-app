import { cn } from "@/lib/utils";

const Button = ({
  className,
  type = "button",
  onClick,
  children,
  ...props
}) => {
  return (
    <button
      className={cn("custom-button", className)}
      onClick={onClick}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
