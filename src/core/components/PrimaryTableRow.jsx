import React from "react";

const PrimaryTableRow = ({ children, columns = [], classes }) => {
  const className = `flex w-full gap-1 items-center ${classes}`;

  return (
      <div className={className}>
        {React.Children.map(children, (child, index) =>
          React.cloneElement(child, {
            className: child.props.className + " " + columns[index],
          })
        )}
      </div>
  );
};

export default PrimaryTableRow;
