import { cn } from "@/lib/utils";

const Loader = ({ className }) => {
  return (
    <div className={cn("lds-ellipsis text-white", className)}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default Loader;
