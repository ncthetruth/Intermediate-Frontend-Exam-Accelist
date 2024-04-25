import React from "react";

interface Props {
  show: boolean;
  message?: string;
  warningMessage?: string;
  onClose: () => void;
}

const PopupContent: React.FC<Props> = ({ show, message, warningMessage, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="absolute inset-0 bg-gray-800 opacity-75"></div>
      <div className="bg-white p-8 rounded-lg shadow-lg z-10">
        <div className="text-center mb-4">
          {warningMessage ? (
            <h2 className="text-3xl font-bold text-yellow-600">{warningMessage}</h2>
          ) : (
            <h2 className="text-3xl font-bold text-red-600">{message}</h2>
          )}
          {}
          {message && !warningMessage && <p className="text-lg my-2 font-semibold">{message}</p>}
        </div>
        <button
          onClick={onClose}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:animate-pulse"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PopupContent;
