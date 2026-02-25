import { cn } from "@/lib/utils";

const Label = ({ className, required, children }) => {
  return (
    <div className={cn("text-sm lg:text-base text-gray h-fit", className)}>
      <span>{children}</span>
      {required && <span className="text-red-500"> * </span>}
    </div>
  );
};

export default Label;
