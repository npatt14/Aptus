import React from "react";

interface ErrorMessageProps {
  message?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message = "We're reviewing your request. Please try again with more specific details.",
}) => {
  return (
    <div className="w-full max-w-lg bg-red-50 p-6 rounded-lg shadow-md border border-red-200">
      <div className="flex items-center space-x-2 mb-4">
        <svg
          className="w-6 h-6 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2 className="text-2xl font-bold text-gray-800">Unable to Process</h2>
      </div>

      <p className="text-gray-700 mb-4">{message}</p>

      <div className="border-t border-red-200 pt-3 mt-4">
        <p className="text-sm text-gray-500">
          Try to include specific information like position, dates, times, and
          rate.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Example: "Need a nurse on Friday from 9am to 5pm at $25/hour"
        </p>
      </div>
    </div>
  );
};

export default ErrorMessage;
