import React from "react";

export const NumberBtn = ({ step }) => {
  const steps = [
    { number: 1, label: "Basic Details" },
    { number: 2, label: "Emergency Details" },
    { number: 3, label: "Medical information" },
  ];

  const getCircleStyle = (currentStep) =>
    currentStep <= step ? "bg-custom-blue1 text-white" : "bg-stone-300 text-white";

  return (
    <div className="flex justify-around text-center gap-4">
      {steps.map(({ number, label }) => (
        <div key={number} className="flex flex-col items-center">
          <div
            className={`${getCircleStyle(
              number
            )} w-10 h-10 flex items-center justify-center rounded-full shadow-md`}
          >
            <span className="text-lg font-semibold">{number}</span>
          </div>
          <span className="mt-2 text-sm font-medium text-gray-700">{label}</span>
        </div>
      ))}
    </div>
  );
};
