import { cn } from "@/lib/utils";
import Input from "./Input";

const Switch = ({ name, className, defaultValue }) => {
  return (
    <label
      className={cn("inline-flex items-center cursor-pointer w-fit", className)}
    >
      <Input
        type="checkbox"
        defaultChecked={defaultValue}
        name={name} // Use name attribute for form submission
        className="sr-only peer"
      />
      <div class="relative w-16 h-8 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-blue-600" />
    </label>
  );
};

export default Switch;
