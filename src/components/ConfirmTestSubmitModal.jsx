import React from 'react';

const ConfirmTestSubmitModal = ({ show, onClose, onConfirm, message }) => {
  if (!show) return null;
  const finalMessage =
    message || 'Are you sure you want to Submit your test?';
  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-md max-w-sm w-full">
        <h2 className="text-lg font-semibold mb-4 text-center">
          {finalMessage}
        </h2>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onConfirm}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Yes
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmTestSubmitModal;
