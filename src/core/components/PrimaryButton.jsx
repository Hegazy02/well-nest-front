import { FaPlus } from "react-icons/fa";

const PrimaryButton = ({ children, onClick, className }) => {
  return (
    <button
      type="button"
      className={
        "bg-[#233955] text-white px-4 py-2 rounded-[8px] flex justify-center gap-2 items-center active:scale-99 active:bg-[#315078] cursor-pointer" +
        " " +
        className
      }
      onClick={onClick}
    >
      <FaPlus className="text-white" /> {children}
    </button>
  );
};

export default PrimaryButton;
