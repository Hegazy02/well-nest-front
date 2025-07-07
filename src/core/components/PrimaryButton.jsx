import { FaPlus } from "react-icons/fa";

const PrimaryButton = ({ children, onClick, className, hasIcon = true }) => {
  return (
    <button
      type="button"
      className={
        "bg-[#233955] text-sm text-white px-4 py-2 rounded-[8px] flex justify-center gap-2 items-center active:scale-99 active:bg-[#315078] cursor-pointer" +
        " " +
        className
      }
      onClick={onClick}
    >
      {hasIcon && <FaPlus className="text-white" />} {children}
    </button>
  );
};

export default PrimaryButton;
