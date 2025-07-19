import React from "react";

const QueueRoundedImages = ({ images, text, className }) => {
  return (
    <div className={"flex gap-2 items-center " + className}>
      <div className="flex">
        {images?.map(
          (image, index) =>
            image && (
              <img
                key={index}
                src={image}
                alt="doctor"
                className={`w-10 h-10 rounded-full border border-gray-200 ${
                  index !== 0 && "-ml-2"
                }`}
              />
            )
        )}
      </div>
      <p className="text-gray-600 text-sm ml-2">{text}</p>
    </div>
  );
};

export default QueueRoundedImages;
