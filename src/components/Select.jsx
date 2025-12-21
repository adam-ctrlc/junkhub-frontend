import { ChevronDown } from "lucide-react";

export default function Select({
  children,
  className = "",
  containerClassName = "",
  iconSize = 16,
  ...props
}) {
  return (
    <div className={`relative inline-flex items-center ${containerClassName}`}>
      <select
        className={`appearance-none bg-white border border-gray-300 rounded-lg pl-4 pr-10 py-2.5 text-sm outline-none focus:border-[#FCD34D] focus:ring-1 focus:ring-[#FCD34D] cursor-pointer transition-colors h-[42px] ${className}`}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        size={iconSize}
        className="absolute right-3 text-gray-400 pointer-events-none"
      />
    </div>
  );
}
