import React from "react";

interface ShiftConfirmationProps {
  onDismiss: () => void;
}

const ShiftConfirmation: React.FC<ShiftConfirmationProps> = ({ onDismiss }) => {
  return (
    <div className="w-full max-w-lg bg-dark-card p-6 rounded-lg shadow-lg mx-auto">
      <div className="flex items-center space-x-4 mb-4">
        <div className="bg-green-900/20 rounded-full p-2">
          <svg
            className="w-8 h-8 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-green-400">Success!</h2>
      </div>

      <p className="text-dark-text mb-5 pl-14">
        Your shift has been scheduled successfully.
      </p>

      <button
        onClick={onDismiss}
        className="mt-4 w-full bg-dark-accent hover:bg-dark-accent-hover text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-dark-accent focus:ring-offset-2 focus:ring-offset-dark-bg transition-colors duration-200"
      >
        Schedule Another Shift
      </button>
    </div>
  );
};

export default ShiftConfirmation;
