import React from "react";
import { Controller } from "react-hook-form";
import CreatableSelect from "react-select/creatable";

const MultiTagInput = ({ control, name, label, options = [] }) => {
  const selectOptions = options.map((opt) => ({ value: opt, label: opt }));
  return (
    <div>
      <label className="block text-sm font-medium text-[#233955] mb-2">
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const valueAsObjects =
            field.value?.map((item) => ({ value: item, label: item })) || [];

          const handleChange = (selectedOptions) => {
            const values = selectedOptions
              ? selectedOptions.map((option) => option.value)
              : [];
            field.onChange(values);
          };

          return (
            <CreatableSelect
              isMulti
              {...field}
              options={selectOptions}
              value={valueAsObjects}
              onChange={handleChange}
              placeholder={`Type or select ${label?.toLowerCase()}...`}
              classNamePrefix="select"
              styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  borderRadius: "0.75rem", // rounded-xl
                  padding: "0.35rem", // custom padding
                  borderWidth: "2px",
                  borderColor: state.isFocused ? "#e5e7eb" : "#e5e7eb", // border-gray-200
                  "&:hover": {
                    borderColor: "#e5e7eb",
                  },
                }),
              }}
            />
          );
        }}
      />
    </div>
  );
};

export default MultiTagInput;
