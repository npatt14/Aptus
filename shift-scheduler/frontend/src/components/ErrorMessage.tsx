import React from "react";

interface ErrorMessageProps {
  message?: string;
  onDismiss: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message = "We're reviewing your request. Please try again with more specific details.",
  onDismiss,
}) => {
  return (
    <div className="w-full max-w-lg bg-dark-card p-6 rounded-lg shadow-lg mx-auto border border-red-900/30">
      <div className="flex items-center space-x-4 mb-4">
        <div className="bg-red-900/20 rounded-full p-2">
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            data-testid="error-icon"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-red-400">Unable to Process</h2>
      </div>

      <p className="text-dark-text mb-5 pl-14">{message}</p>

      <div className="border-t border-dark-border pt-4 mt-4">
        <p className="text-sm text-dark-muted">
          Include specific information like position, dates, times, and
          rate.
        </p>
        <p className="text-sm text-dark-muted mt-2 mb-4">
          Example: "Need a nurse on Friday from 9am to 5pm at $25/hour"
        </p>

        <button
          onClick={onDismiss}
          className="w-full bg-dark-accent hover:bg-dark-accent-hover text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-dark-accent focus:ring-offset-2 focus:ring-offset-dark-bg transition-colors duration-200"
        >
          Try Againn
        </button>
      </div>
    </div>
  );
};

export default ErrorMessage;
