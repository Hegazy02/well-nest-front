import { IoSearchOutline } from "react-icons/io5";

const PrimaryInput = ({
  children,
  placeholder = "Search",
  type = "text",
  onChange,
}) => {
  return (
    <div className="flex items-center gap-2 py-2 px-4 bg-[#f0f0f0] w-fit rounded-md ">
      {children ? (
        children
      ) : (
        <IoSearchOutline className="text-xl text-[#4B4D4F]" />
      )}
      <input
        type={type}
        placeholder={placeholder}
        className="decoration-none outline-none"
        onChange={onChange}
      />
    </div>
  );
};

export default PrimaryInput;
