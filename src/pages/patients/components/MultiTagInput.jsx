import React, { useState } from "react";
import CreatableSelect from "react-select/creatable";

const MultiTagInput = ({ label, defaultOptions = [], onChange }) => {
  const [options, setOptions] = useState(
    defaultOptions.map((opt) => ({ value: opt, label: opt }))
  );
  const [selected, setSelected] = useState([]);

  const handleChange = (newValue) => {
    setSelected(newValue);
    onChange(newValue.map((item) => item.value));
  };

  const handleCreate = (inputValue) => {
    const newOption = { value: inputValue, label: inputValue };
    const updatedOptions = [...options, newOption];
    setOptions(updatedOptions);
    const newSelected = [...selected, newOption];
    setSelected(newSelected);
    onChange(newSelected.map((item) => item.value));
  };

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <CreatableSelect
        isMulti
        options={options}
        value={selected}
        onChange={handleChange}
        onCreateOption={handleCreate}
        placeholder={`Type or select ${label?.toLowerCase()}...`}
        classNamePrefix="select"
      />
    </div>
  );
};

export default MultiTagInput;
