import React, { useRef, useState, useEffect } from "react";
import { CiFilter } from "react-icons/ci";

const PrimaryDropDown = ({ children, text, onSearch, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  function toggleDropdown() {
    setIsOpen((isOpen) => !isOpen);
  }
  const searchHandler = (e) => {
    onSearch(e);
  };
  const selectHandler = (index) => {
    onSelect(index);
    toggleDropdown();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <>
      <div className="relative group">
        <button
          ref={buttonRef}
          onClick={toggleDropdown}
          id="dropdown-button"
          className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none cursor-pointer "
        >
          <CiFilter className="text-lg text-[#87888A]" strokeWidth={1} />
          <span className="mx-2 text-[#87888A]">{text}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 ml-2 -mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M6.293 9.293a1 1 0 011.414 0L10 11.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <div
          ref={dropdownRef}
          id="dropdown-menu"
          className={`${
            isOpen ? "" : "hidden"
          } absolute left-0 mt-1 rounded-md shadow-lg bg-white ring-1 ring-gray-300 ring-opacity-5 p-1 space-y-1`}
        >
          {onSearch && (
            <input
              onInput={searchHandler}
              id="search-input"
              className="block w-full px-4 py-2 text-gray-800 border rounded-md  border-gray-300 focus:outline-none"
              type="text"
              placeholder="Search items"
              autoComplete="off"
            />
          )}
          {React.Children.map(children, (child, index) =>
            React.cloneElement(child, {
              className:
                child.props.className +
                " " +
                "cursor-pointer hover:bg-gray-100 p-2",
              onClick: () => selectHandler(index),
            })
          )}
        </div>
      </div>
    </>
  );
};

export default PrimaryDropDown;
