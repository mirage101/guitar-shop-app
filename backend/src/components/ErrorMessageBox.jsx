import { cn } from "@/lib/utils";

const ErrorMessageBox = ({ errorMessage, className }) => {
  return (
    <div className={cn("col-span-2 border border-red-500 rounded-xl px-5 py-3 bg-red-50 w-fit", className)}>
      <span className="text-red-500 col-span-2 text-lg my-0 font-500">
        {errorMessage}
      </span>
    </div>
  );
};

export default ErrorMessageBox;
