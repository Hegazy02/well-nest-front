import React from "react";
import { FaCamera } from "react-icons/fa";

export const Input = ({
  inputName,
  value,
  handleChange,
  name,
  type = "text",
  options = null,
  selectedValue = null,
}) => {
  if (type === "file") {
    return (
      <div className="my-5">
        <label htmlFor={name} className="cursor-pointer inline-block">
          <div className="w-20 h-20 bg-custom-blue1 rounded-full flex items-center justify-center shadow-md hover:bg-blue-600 transition">
            <FaCamera className="text-white text-3xl" />
          </div>
        </label>
        <input
        
          id={name}
          type="file"
          name={name}
          accept="image/*"
          onChange={(event) => {
            handleChange(event.target.files?.[0]);
          }}
          className="hidden"
        />
      </div>
    );
  }

  if (type === "radio") {
    return (
      <div className="my-5">
        <label className="block mb-1">{inputName}</label>
        <div className="flex gap-4">
          {options.map(({ label, value }) => (
            <label key={value} className="flex items-center gap-1">
              <input
                type="radio"
                name={name}
                value={value}
                checked={Number(selectedValue) === Number(value)}
                onChange={handleChange}
              />
              {label}
            </label>
          ))}
        </div>
      </div>
    );
  }
  if (type === "select") {
    return (
      <div className="my-5">
        <label className="block mb-1">{inputName}</label>
        <select
          name={name}
          value={value}
          onChange={handleChange}
          className="border-2 custom-blue1 rounded-md h-10 w-full "
        >
          <option value="">Select...</option>
          {options.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
    );
  }
if (type === "submit") {
  return (
    <div className="my-5">
      <input
        className="bg-custom-blue1 text-white font-semibold rounded-md px-4 py-2 cursor-pointer hover:bg-blue-700 w-272"
        type="submit"
        name={name}
        value={inputName || "Submit"}
      />
    </div>
  );
}
  
  return (
    <div className="my-5">
      <label className="block mb-1">{inputName}</label>
      <input
        className="border-2 custom-blue1 rounded-md w-full h-10 px-2"
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
};
