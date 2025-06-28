import PrimaryTableRow from "./PrimaryTableRow";
import React, { memo } from "react";

const RowWrapper = memo(({ child, isLast }) => (
  <>
    {child}
    {!isLast && <hr className="border-gray-300" />}
  </>
));

const PrimaryTable = ({ children, columns }) => {
  const childArray = React.Children.toArray(children);

  return (
    <div className="flex flex-col gap-4 border rounded-2xl border-gray-300">
      <PrimaryTableRow
        columns={columns.map((item) => item.className)}
        classes="bg-gray-200 primary-bg-gray rounded-t-2xl secondary-color-gray px-2  py-3"
      >
        {columns.map((item, index) => (
          <div key={index}>{item.name}</div>
        ))}
      </PrimaryTableRow>
      {childArray.map((child, index) => (
        <RowWrapper
          key={child.key}
          child={child}
          isLast={index === childArray.length - 1}
        />
      ))}
    </div>
  );
};

export default memo(PrimaryTable);
