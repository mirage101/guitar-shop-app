import { CloseIcon, TrashIcon } from "@/app/icons";
import Loader from "../Loader";
import Button from "./Button";

const DeleteConfirmationModal = ({
  setIsOpen,
  onConfirm,
  onCancel,
  isLoading,
  message,
}) => {
  const closeModal = () => setIsOpen(false);

  const handleConfirm = () => {
    onConfirm();
  };

  const handleCancel = () => {
    onCancel();
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={closeModal}
      ></div>
      <div className="relative p-4 w-full max-w-xl h-full md:h-auto">
        <div className="relative text-center bg-white rounded-lg shadow-lg p-5">
          <button
            type="button"
            className="close-icon-button"
            onClick={closeModal}
          >
            <CloseIcon />
            <span className="sr-only">Close modal</span>
          </button>
          <div className="flex items-center justify-center text-red-500">
            <TrashIcon className="h-16 w-16" />
          </div>
          <p className="my-4 font-semibold text-xl">
            {message || "Are you sure you want to delete?"}
          </p>
          <div className="flex justify-end items-center space-x-4">
            <Button
              onClick={handleCancel}
              type="button"
              className="bg-transparent text-black border border-gray-600"
            >
              Cancel
            </Button>
            <Button onClick={handleConfirm} type="submit">
              {isLoading ? <Loader /> : "Confirm"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
