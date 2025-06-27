import PrimaryTableRow from "./PrimaryTableRow";
import React from "react";

const PrimaryTable = ({ children, headerData }) => {
  const columns = children?.[0]?.props?.columns;
  return (
    <div className="flex flex-col gap-4 border rounded-2xl border-gray-300">
      <PrimaryTableRow
        columns={columns}
        classes={
          "bg-gray-200 primary-bg-gray rounded-t-2xl secondary-color-gray px-2  py-3"
        }
      >
        {headerData.map((item, index) => (
          <div key={index}>{item}</div>
        ))}
      </PrimaryTableRow>
      {React.Children.map(children, (child, index) =>
        React.cloneElement(
          <>
            {child}
            {index !== children.length - 1 && (
              <hr className="border-gray-300" />
            )}
          </>
        )
      )}{" "}
    </div>
  );
};

export default PrimaryTable;
