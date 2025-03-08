import React from "react";

interface ShiftConfirmationProps {
  shift: any; // Accept any shape of data
}

const ShiftConfirmation: React.FC<ShiftConfirmationProps> = () => {
  return (
    <div className="w-full max-w-lg bg-dark-card p-8 rounded-lg shadow-lg border border-darkblue-700">
      <div className="flex items-center justify-center mb-6">
        <div className="bg-darkblue-900/30 rounded-full p-3">
          <svg
            className="w-10 h-10 text-darkblue-400"
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
      </div>

      <h2 className="text-2xl font-bold text-center text-darkblue-300 mb-4">
        Shift Scheduled Successfully!
      </h2>

      <p className="text-center text-dark-muted">
        Your shift has been successfully scheduled and added to the database.
      </p>
    </div>
  );
};

export default ShiftConfirmation;
