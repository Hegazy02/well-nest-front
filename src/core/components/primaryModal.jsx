import React, { useState, useEffect } from "react";
import PrimaryButton from "./PrimaryButton";

const PrimaryModal = ({
  children,
  title = "Are you sure you want to delete this item?",
  content,
  confirmText = "Yes, I'm sure",
  cancelText = "No, cancel",
  onConfirm,
  onCancel,
  showIcon = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const handleConfirm = () => {
    onConfirm?.();
    toggleModal();
  };

  const handleCancel = () => {
    onCancel?.();
    toggleModal();
  };

  // Close modal when pressing Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        toggleModal();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Get the first child element to use as trigger
  const triggerElement = React.Children.toArray(children)[0];

  return (
    <>
      {/* Clone the first child and add modal trigger props */}
      {triggerElement &&
        React.cloneElement(triggerElement, {
          onClick: (e) => {
            toggleModal();
            if (triggerElement.props.onClick) {
              triggerElement.props.onClick(e);
            }
          },
          "aria-haspopup": "dialog",
          "aria-expanded": isOpen,
        })}

      {/* Modal Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={toggleModal}
          aria-hidden="true"
        />
      )}

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="relative w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow">
            {/* Close Button */}
            <button
              type="button"
              className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={toggleModal}
              aria-label="Close modal"
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
            </button>

            {/* Modal Content */}
            <div className="p-4 md:p-5 text-center">
              {showIcon && (
                <svg
                  className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="red"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              )}

              <h3
                id="modal-title"
                className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400"
              >
                {title}
              </h3>

              {content && (
                <div className="mb-5 text-sm text-gray-500 dark:text-gray-400">
                  {content}
                </div>
              )}

              <div className="flex justify-center gap-4">
                <button
                  type="button"
                  className="cursor-pointer text-white bg-red-600 hover:bg-red-800  font-medium rounded-lg text-sm px-5 py-2.5 transition-colors"
                  onClick={handleConfirm}
                >
                  {confirmText}
                </button>

                <PrimaryButton onClick={handleCancel} hasIcon={false}>
                  {cancelText}
                </PrimaryButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrimaryModal;
